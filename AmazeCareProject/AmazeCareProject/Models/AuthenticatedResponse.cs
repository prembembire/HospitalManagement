namespace AmazeCareProject.Models
{
    public class AuthenticatedResponse
    {
        public string? token { get; set; }
        public int? id {  get; set; }
        public string? role { get; set; }//I have added the role here
    }
}
