using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazeCareProject.Data;
using CodeFirst.Models;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Security.Cryptography;

namespace AmazeCareProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly AmazeCareDBContext _context;

        public DoctorsController(AmazeCareDBContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet,Authorize(Roles ="Admin,Patient")]
        public async Task<ActionResult<IEnumerable<Doctors>>> GetDoctors()
        {
          if (_context.Doctors == null)
          {
              return NotFound();
          }
            return await _context.Doctors.ToListAsync();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}"), Authorize(Roles = "Patient,Admin,Doctor")]
        public async Task<ActionResult<Doctors>> GetDoctors(int id)
        {
          if (_context.Doctors == null)
          {
              return NotFound();
          }
            var doctors = await _context.Doctors.FindAsync(id);

            if (doctors == null)
            {
                return NotFound();
            }

            return doctors;
        }

        [HttpPut("{id}"), Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> PutDoctors(int id, Doctors doctors)
        {
            if (id != doctors.DoctorId)
            {
                return BadRequest();
            }

            _context.Entry(doctors).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //[HttpPost]
        //public async Task<ActionResult<Doctors>> PostDoctors(Doctors doctors)
        //{
        //  if (_context.Doctors == null)
        //  {
        //      return Problem("Entity set 'AmazeCareDBContext.Doctors'  is null.");
        //  }
        //    _context.Doctors.Add(doctors);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetDoctors", new { id = doctors.DoctorId }, doctors);
        //}

        [HttpPost]

        public async Task<ActionResult<Doctors>> PostDoctors(Doctors doctors)
        {
            if (_context.Doctors == null)
            {
                return Problem("Entity set 'AmazeCareDBContext.Doctors'  is null.");
            }
            var usernameExists = await UsernameExists(doctors.UserName);
            if (usernameExists)
            {
                return BadRequest("UserName already exists. Please choose a different username");
            }
            doctors.Password=hashing(doctors.Password);
            _context.Doctors.Add(doctors);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctors", new { id = doctors.DoctorId }, doctors);
        }
        private string hashing(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder hashedpassword = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    hashedpassword.Append(bytes[i].ToString("x2"));
                }
                return hashedpassword.ToString();
            }
        }
        private async Task<bool> UsernameExists(string username)
        {
            return await _context.Patient.AnyAsync(p => p.UserName == username) ||
                await _context.Doctors.AnyAsync(d => d.UserName == username) ||
                await _context.Admin.AnyAsync(a => a.UserName == username);
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}"),Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeleteDoctors(int id)
        {
            if (_context.Doctors == null)
            {
                return NotFound();
            }
            var doctors = await _context.Doctors.FindAsync(id);
            if (doctors == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctors);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("View Appointments"),Authorize(Roles ="Doctor")]
        public IActionResult GetAppointments(int id)
        {
            var getAppointment = _context.Doctors.Where(p => p.DoctorId == id).Join(
                _context.Appointments,
                p => p.DoctorId,
                a => a.DoctorId,
                (p, a) => new
                {
                    AppointmentId = a.AppointmentId,
                    PatientName = a.Patient.FullName,
                    ContactNumber = a.Patient.ContactNumber,
                    Date = a.AppointmentDate

                });
            return Ok(getAppointment);
        }


        [HttpGet("GetAppointmentDetails/{appointmentId}")]
        public async Task<ActionResult<object>> GetAppointmentDetails(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);

            if (appointment == null)
            {
                return NotFound();
            }

            return new { PatientId = appointment.PatientId, DoctorId = appointment.DoctorId, AppointmentId = appointment.AppointmentId };
        }



        private bool DoctorsExists(int id)
        {
            return (_context.Doctors?.Any(e => e.DoctorId == id)).GetValueOrDefault();
        }
    }
}
