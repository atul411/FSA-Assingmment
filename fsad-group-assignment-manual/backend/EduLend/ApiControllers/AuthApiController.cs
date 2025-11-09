using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Edulend.Models;
using Edulend.DAL;
using Edulend.Business;
using Edulend.ViewModels;

namespace Edulend.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthApiController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthApiController(AppDbContext context)
    {
        _context = context;
        _tokenService = new TokenService();
        _passwordHasher = new PasswordHasher<User>();
    }

    [HttpPost("signin")]
    public IActionResult Signin([FromBody] SigninRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Password can't be empty");

        if (!Regex.IsMatch(request.Email ?? "", @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            return BadRequest("Invalid email format");

        if (_context.Users.Any(u => u.Email == request.Email))
            return BadRequest("User already exists with the given email");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            SchoolId = request.SchoolId,
            Role = request.Role
        };

        // Hash the password before saving
        user.Password = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        _context.SaveChanges();

        var token = _tokenService.GenerateToken(user);
        return Ok(new
        {
            Message = "Account created successfully",
            Token = token,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Password can't be empty");

        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user == null)
            return NotFound("User not found");
        if (string.IsNullOrEmpty(user.Password))
            return Unauthorized("Password is not set for this user");

        var result = _passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Password is incorrect");

        var token = _tokenService.GenerateToken(user);
        return Ok(new
        {
            Message = "Login successful",
            Token = token,
            Role = user.Role
        });
    }
}