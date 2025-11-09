namespace Edulend.ViewModels;

public class SigninRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? SchoolId { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
}

public class LoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}
