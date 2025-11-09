namespace Edulend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? StudentId { get; set; } // Optional for staff/admin
        public string? Password { get; set; }
        public string? Role { get; set; } // "student", "staff", "admin"
    }
}