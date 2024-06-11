
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
using AmazeCareProject.Exceptions;

namespace AmazeCareProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AmazeCareDBContext _context;

        public AppointmentsController(AmazeCareDBContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet, Authorize(Roles = "Admin,Doctor,Patient")]

        public async Task<ActionResult<IEnumerable<Appointments>>> GetAppointments()
        {
            if (_context.Appointments == null)
            {
                return NotFound();
            }
            return await _context.Appointments.ToListAsync();
        }


        // GET: api/Appointments/5
        [HttpGet("{id}"), Authorize(Roles = "Admin,Doctor,Patient")]


        public async Task<ActionResult<Appointments>> GetAppointments(int id)
        {
            if (_context.Appointments == null)
            {
                return NotFound();
            }
            var appointments = await _context.Appointments.FindAsync(id);

            if (appointments == null)
            {
                return NotFound();
            }

            return appointments;
        }


        [HttpPut("{id}"), Authorize(Roles = "Admin,Doctor,Patient")]

        public async Task<IActionResult> PutAppointments(int id, Appointments appointments)
        {
            if (id != appointments.AppointmentId)
            {
                return BadRequest();
            }

            _context.Entry(appointments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentsExists(id))
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

        [HttpPut("DoctorId"), Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointments appointments)
        {
            try
            {
                if (id != appointments.DoctorId)
                    return BadRequest("Invalid Doctor ID.");

                _context.Entry(appointments).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentsExists(id))
                    return NotFound("Appointment not found.");

                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error: " + ex.Message);
            }
        }

        //[HttpGet("AvailableTimeSlots")]
        //public IActionResult GetAvailableTimeSlots(int doctorId, DateTime appointmentDate)    //removed datetimne and added string
        //{

        //    // Assuming each appointment has a fixed duration, e.g., 30 minutes
        //    const int appointmentDurationMinutes = 30;

        //    // Fetch existing appointments for the selected doctor and date
        //    var existingAppointments = _context.Appointments
        //        .Where(a => a.DoctorId == doctorId &&
        //                    a.AppointmentDate.Date == appointmentDate.Date)
        //        .ToList();

        //    // Assuming the clinic opens at 9:00 AM and closes at 5:00 PM
        //    var clinicOpeningTime = appointmentDate.Date.AddHours(9);
        //    var clinicClosingTime = appointmentDate.Date.AddHours(17);

        //    // Generate time slots between clinic opening and closing time
        //    var timeSlots = new List<string>();
        //    var currentTime = clinicOpeningTime;

        //    while (currentTime < clinicClosingTime)
        //    {
        //        var endTime = currentTime.AddMinutes(appointmentDurationMinutes);
        //        if (!existingAppointments.Any(a => a.AppointmentDate >= currentTime && a.AppointmentDate < endTime))
        //        {
        //            // If there are no appointments overlapping with the current time slot, add it to available time slots
        //            timeSlots.Add(currentTime.ToString("hh:mm tt"));
        //        }
        //        currentTime = endTime;
        //    }

        //    return Ok(new { availableTimeSlots = timeSlots });
        //}
        [HttpGet("AvailableTimeSlots")]
        public IActionResult GetAvailableTimeSlots(int doctorId, DateTime appointmentDate)
        {
            // Assuming each appointment has a fixed duration, e.g., 30 minutes
            const int appointmentDurationMinutes = 30;

            // Fetch existing appointments for the selected doctor and date
            var existingAppointments = _context.Appointments
                .Where(a => a.DoctorId == doctorId &&
                            a.AppointmentDate.Date == appointmentDate.Date)
                .ToList();

            // Assuming the clinic opens at 9:00 AM and closes at 5:00 PM
            var clinicOpeningTime = appointmentDate.Date.AddHours(9);
            var clinicClosingTime = appointmentDate.Date.AddHours(17);

            // Lunch break time
            var lunchStartTime = appointmentDate.Date.AddHours(12);
            var lunchEndTime = appointmentDate.Date.AddHours(14);

            // Generate time slots between clinic opening and closing time, excluding lunchtime
            var timeSlots = new List<string>();
            var currentTime = clinicOpeningTime;

            while (currentTime < clinicClosingTime)
            {
                // Skip lunchtime slots
                if (currentTime >= lunchStartTime && currentTime < lunchEndTime)
                {
                    currentTime = lunchEndTime; // Skip lunchtime
                    continue;
                }

                var endTime = currentTime.AddMinutes(appointmentDurationMinutes);
                if (!existingAppointments.Any(a => a.AppointmentDate >= currentTime && a.AppointmentDate < endTime))
                {
                    // If there are no appointments overlapping with the current time slot, add it to available time slots
                    timeSlots.Add(currentTime.ToString("hh:mm tt"));
                }
                currentTime = endTime;
            }

            return Ok(new { availableTimeSlots = timeSlots });
        }

        //[HttpPost("BookAppointment"), Authorize(Roles = "Admin,Patient")]
        //public async Task<Appointments> AddAppointment(Appointments appointments)
        //{

        //    if (appointments.AppointmentDate <= DateTime.Now)
        //    {
        //        throw new InvalidAppointmentDateTimeException();
        //    }

        //    var existingAppointments = await _context.Appointments.ToListAsync();

        //    var conflictingAppointments = existingAppointments
        //        .Where(a => a.DoctorId == appointments.DoctorId &&
        //                    Math.Abs((a.AppointmentDate - appointments.AppointmentDate).TotalMinutes) < 30)
        //        .ToList();

        //    if (conflictingAppointments.Any())
        //    {
        //        throw new();
        //    }

        //    _context.Appointments.Add(appointments);
        //    await _context.SaveChangesAsync();
        //    return appointments;
        //}



        //[HttpPost("Post operation"), Authorize(Roles = "Admin,Patient")]
        //public async Task<ActionResult<Appointments>> PostAppointments(Appointments appointments)
        //{
        //    if (_context.Appointments == null)
        //    {
        //        return Problem("Entity set 'AmazeCareDBContext.Appointments'  is null.");
        //    }
        //    _context.Appointments.Add(appointments);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetAppointments", new { id = appointments.AppointmentId }, appointments);
        //}
        [HttpPost("BookAppointment"), Authorize(Roles = "Admin,Patient")]
        public async Task<Appointments> AddAppointment(Appointments appointments)
        {
            // Convert the incoming appointment date to Indian Standard Time (IST)
            appointments.AppointmentDate = TimeZoneInfo.ConvertTimeFromUtc(appointments.AppointmentDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));

            if (appointments.AppointmentDate <= DateTime.Now)
            {
                throw new InvalidAppointmentDateTimeException();
            }

            var existingAppointments = await _context.Appointments.ToListAsync();

            var conflictingAppointments = existingAppointments
                .Where(a => a.DoctorId == appointments.DoctorId &&
                            Math.Abs((a.AppointmentDate - appointments.AppointmentDate).TotalMinutes) < 30)
                .ToList();

            if (conflictingAppointments.Any())
            {
                throw new();
            }

            _context.Appointments.Add(appointments);
            await _context.SaveChangesAsync();
            return appointments;
        }

        [HttpPost("PostOperation"), Authorize(Roles = "Admin,Patient")]
        public async Task<ActionResult<Appointments>> PostAppointments(Appointments appointments)
        {
            // Convert the incoming appointment date to Indian Standard Time (IST)
            appointments.AppointmentDate = TimeZoneInfo.ConvertTimeFromUtc(appointments.AppointmentDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));

            if (_context.Appointments == null)
            {
                return Problem("Entity set 'AmazeCareDBContext.Appointments' is null.");
            }

            _context.Appointments.Add(appointments);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointments", new { id = appointments.AppointmentId }, appointments);
        }



        // DELETE: api/Appointments/5
        [HttpDelete("{id}"), Authorize(Roles = "Admin,Doctor,Patient")]
        public async Task<IActionResult> DeleteAppointments(int id)
        {
            if (_context.Appointments == null)
            {
                return NotFound();
            }
            var appointments = await _context.Appointments.FindAsync(id);
            if (appointments == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointments);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool AppointmentsExists(int id)
        {
            return (_context.Appointments?.Any(e => e.AppointmentId == id)).GetValueOrDefault();
        }
    }
}