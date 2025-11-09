using Edulend.Models;

namespace Edulend.Business;

public class TokenService
{
    public string GenerateToken(User user)
    {
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.Email}:{user.Role}:{DateTime.UtcNow}"));
    }
}