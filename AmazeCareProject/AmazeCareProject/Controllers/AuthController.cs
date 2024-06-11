using AmazeCareProject.Data;
using AmazeCareProject.Models;
using CodeFirst.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AmazeCareProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AmazeCareDBContext _dbContext;

        public AuthController(IConfiguration config, AmazeCareDBContext dBContext)
        {
            _config = config;
            _dbContext = dBContext;
        }


        //[AllowAnonymous] // Anyone can use
        //[HttpPost]


        //public IActionResult Auth([FromBody] User user)
        //{
        //    IActionResult response = Unauthorized();
        //    if (user != null)
        //    {



        //        if (user.SelectedRole == "Patient")
        //        {
        //            var dbUser = _dbContext.Patient.FirstOrDefault(p => p.UserName == user.UserName);
        //            if ((user.UserName == dbUser.UserName) && (user.Password == dbUser.Password))
        //            {
        //                var issuer = _config["Jwt:Issuer"];
        //                var audience = _config["Jwt:Audience"];
        //                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
        //                var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
        //                var subject = new ClaimsIdentity(new[]
        //                {
        //                new Claim(JwtRegisteredClaimNames.Name, user.UserName),
        //                new Claim(ClaimTypes.Role, user.SelectedRole),
        //            });
        //                var expires = DateTime.UtcNow.AddMinutes(100);
        //                var tokenDescriptor = new SecurityTokenDescriptor
        //                {
        //                    Subject = subject,
        //                    SigningCredentials = signingCredentials,
        //                    Expires = expires,
        //                    Issuer = issuer,
        //                    Audience = audience // Ensure that this matches the audience in appsettings.json
        //                };

        //                var tokenHandler = new JwtSecurityTokenHandler();
        //                var token = tokenHandler.CreateToken(tokenDescriptor);
        //                var jwtToken = tokenHandler.WriteToken(token);
        //                //return Ok(jwtToken);
        //                return Ok(new AuthenticatedResponse { token = jwtToken, id = dbUser.PatientId });
        //            }


        //        }
        //        if (user.SelectedRole == "Doctor")
        //        {
        //            var dbUser = _dbContext.Doctors.FirstOrDefault(p => p.UserName == user.UserName);
        //            if ((user.UserName == dbUser.UserName) && (user.Password == dbUser.Password))
        //            {
        //                var issuer = _config["Jwt:Issuer"];
        //                var audience = _config["Jwt:Audience"];
        //                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
        //                var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
        //                var subject = new ClaimsIdentity(new[]
        //                {
        //                new Claim(JwtRegisteredClaimNames.Name, user.UserName),
        //                new Claim(ClaimTypes.Role, user.SelectedRole),
        //            });
        //                var expires = DateTime.UtcNow.AddMinutes(10);
        //                var tokenDescriptor = new SecurityTokenDescriptor
        //                {
        //                    Subject = subject,
        //                    SigningCredentials = signingCredentials,
        //                    Expires = expires,
        //                    Issuer = issuer,
        //                    Audience = audience
        //                };

        //                var tokenHandler = new JwtSecurityTokenHandler();
        //                var token = tokenHandler.CreateToken(tokenDescriptor);
        //                var jwtToken = tokenHandler.WriteToken(token);
        //                return Ok(new AuthenticatedResponse { token = jwtToken, id = dbUser.DoctorId });
        //            }


        //        }


        //        if (user.SelectedRole == "Admin")
        //        {
        //            var dbUser = _dbContext.Admin.FirstOrDefault(p => p.UserName == user.UserName);
        //            if ((user.UserName == dbUser.UserName) && (user.Password == dbUser.Password))
        //            {
        //                var issuer = _config["Jwt:Issuer"];
        //                var audience = _config["Jwt:Audience"];
        //                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
        //                var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
        //                var subject = new ClaimsIdentity(new[]
        //                {
        //                new Claim(JwtRegisteredClaimNames.Name, user.UserName),
        //                new Claim(ClaimTypes.Role,user.SelectedRole)
        //            });
        //                var expires = DateTime.UtcNow.AddMinutes(10);
        //                var tokenDescriptor = new SecurityTokenDescriptor
        //                {
        //                    Subject = subject,
        //                    SigningCredentials = signingCredentials,
        //                    Expires = expires,
        //                    Issuer = issuer,
        //                    Audience = audience 
        //                };

        //                var tokenHandler = new JwtSecurityTokenHandler();
        //                var token = tokenHandler.CreateToken(tokenDescriptor);
        //                var jwtToken = tokenHandler.WriteToken(token);
        //                return Ok(new AuthenticatedResponse { token = jwtToken, id = dbUser.AdminId });
        //            }
        //        }

        //    }
        //    return response;
        //}
















        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult roleBasedAuth([FromBody] User user)
        {
            IActionResult response = Unauthorized();
            if (user != null)
            {
                string pass =hashing( user.Password);//added

                var dbPatient = _dbContext.Patient.FirstOrDefault(p => (p.UserName == user.UserName) && (p.Password == pass));
                if (dbPatient != null)
                {
                    return Token("Patient", user, dbPatient.PatientId);
                }

                var dbDoctor = _dbContext.Doctors.FirstOrDefault(p => (p.UserName == user.UserName) && (p.Password == pass));
                if (dbDoctor != null)
                {
                    return Token("Doctor", user, dbDoctor.DoctorId);
                }

                var dbAdmin = _dbContext.Admin.FirstOrDefault(p => (p.UserName == user.UserName) && (p.Password == user.Password));
                if (dbAdmin != null)
                {
                    return Token("Admin", user, dbAdmin.AdminId);
                }
            }
            return response;
        }
        private string hashing(string password)
        {
            using (SHA256  sha256Hash = SHA256.Create())
            {
                byte[] bytes=sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder hashedpassword=new StringBuilder();
                for(int i=0;i<bytes.Length; i++)
                {
                    hashedpassword.Append(bytes[i].ToString("x2"));
                }
                return hashedpassword.ToString();
            }
        }

        private IActionResult Token(string role, User user, int userId)
        {
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
            var subject = new ClaimsIdentity(new[]
            {
        new Claim(JwtRegisteredClaimNames.Name, user.UserName),
        new Claim(ClaimTypes.Role, role),
    });
            var expires = DateTime.UtcNow.AddMinutes(100);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = subject,
                SigningCredentials = signingCredentials,
                Expires = expires,
                Issuer = issuer,
                Audience = audience
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            return Ok(new AuthenticatedResponse { token = jwtToken, id = userId, role = role });
        }






        [AllowAnonymous]
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] User user)
        {
            var response="Something error occured please try later";
            if (user == null)
            {
                return BadRequest(new { error = "Invalid user data provided." });
            }
            else
            {
                string pass = hashing(user.Password);//Added
                var patient = _dbContext.Patient.FirstOrDefault(p => user.UserName == p.UserName);
                var doctor  = _dbContext.Doctors.FirstOrDefault(d=>user.UserName==d.UserName);
                if(patient != null && doctor == null)
                {
                    patient.Password=pass;

                }
                else if(patient==null && doctor != null)
                {
                    doctor.Password = pass;
                }
                else
                {
                    return NotFound(new { error = $"No Patient or Doctor found with userName : {user.UserName}" });
    
                }
            }
            try
            {
                _dbContext.SaveChanges(); // Save changes to the database
                return Ok(new { message = "Password reset successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An error occurred while resetting the password: {ex.Message}" });
            }


        }




        //[AllowAnonymous]
        //[HttpPost("reset-password")]
        //public IActionResult ResetPassword([FromBody] User user)
        //{
        //    if (user == null)
        //    {
        //        return BadRequest(new { error = "Invalid user data provided." });
        //    }

            //    // Determine the user role
            //    switch (user.SelectedRole)
            //    {
            //        case "Patient":
            //            var patient = _dbContext.Patient.FirstOrDefault(p => p.UserName == user.UserName);
            //            if (patient == null)
            //            {
            //                return NotFound(new { error = "No patient found with the provided username." });
            //            }
            //            patient.Password = user.Password;
            //            break;

            //        case "Doctor":
            //            var doctor = _dbContext.Doctors.FirstOrDefault(d => d.UserName == user.UserName);
            //            if (doctor == null)
            //            {
            //                return NotFound(new { error = "No doctor found with the provided username." });
            //            }
            //            doctor.Password = user.Password;
            //            break;

            //        case "Admin":
            //            var admin = _dbContext.Admin.FirstOrDefault(a => a.UserName == user.UserName);
            //            if (admin == null)
            //            {
            //                return NotFound(new { error = "No admin found with the provided username." });
            //            }
            //            admin.Password = user.Password;
            //            break;

            //        default:
            //            return BadRequest(new { error = "Invalid role provided." });
            //    }

            //    try
            //    {
            //        _dbContext.SaveChanges(); // Save changes to the database
            //        return Ok(new { message = "Password reset successfully!" });
            //    }
            //    catch (Exception ex)
            //    {
            //        return StatusCode(500, new { error = $"An error occurred while resetting the password: {ex.Message}" });
            //    }
            //}









    }
}


