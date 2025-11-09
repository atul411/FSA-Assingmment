using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Edulend.Models;
using Edulend.DAL;
using Edulend.Business;
using Edulend.ViewModels;
using System.Text.RegularExpressions;

namespace Edulend.Controllers;

[Route("api/requests")]
[ApiController]
public class RequestApiController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequestApiController(AppDbContext context) => _context = context;

    [HttpPost("requestItem")]
    public IActionResult RequestItem(Request req)
    {
        var item = _context.Items.Find(req.ItemId);
        if (item == null) return NotFound("Item not found");

        var student = _context.Users.Find(req.StudentId);
        if (student == null || student.Role != "student") return NotFound("student not found");

        var overlapping = _context.Requests
            .Any(r => r.ItemId == req.ItemId && r.Status != "Returned" &&
                      r.StartDate < req.EndDate && r.EndDate > req.StartDate);

        if (overlapping) return BadRequest("Item not available for the requested period");

        req.Status = "Pending";
        _context.Requests.Add(req);
        _context.SaveChanges();
        return Ok(req);
    }

    [HttpPost("openRequests")]
    public IActionResult ApproveReject([FromBody] dynamic payload)
    {
        string status = payload.status;
        int? staffId = payload.staffId;
        int? adminId = payload.adminId;

        if (status != "Approved" && status != "Rejected")
            return BadRequest("invalid status");

        bool authorized = (staffId != null && IsStaff((int)staffId)) || (adminId != null && IsAdmin((int)adminId));
        if (!authorized) return Unauthorized("Unauthorized action");

        var openRequests = _context.Requests.Where(r => r.Status == "Pending").ToList();
        if (!openRequests.Any()) return NotFound("Request not found");

        return Ok(openRequests.Select(r => new
        {
            r.Id,
            Item = _context.Items.Find(r.ItemId),
            User = _context.Users.Find(r.StudentId)
        }));
    }

    [HttpPut("/ChangeStatus")]
    public IActionResult MarkReturned([FromBody] dynamic payload)
    {
        int requestId = payload.requestId;
        int? staffId = payload.staffId;
        int? adminId = payload.adminId;

        var request = _context.Requests.Find(requestId);
        if (request == null) return NotFound("Request not found");
        if (request.Status == "Returned") return BadRequest("Item already returned");

        bool authorized = (staffId != null && IsStaff((int)staffId)) || (adminId != null && IsAdmin((int)adminId));
        if (!authorized) return Unauthorized("Unauthorized action");

        request.Status = "Returned";
        _context.SaveChanges();
        return Ok("Item marked as returned");
    }

    [HttpPost("{requestId}/return")]
    public IActionResult MarkAsReturned(int requestId)
    {
        var request = _context.Requests.Find(requestId);
        if (request == null) return NotFound("Request not found");
        if (request.Status != "Approved") return BadRequest("Only approved requests can be returned");

        request.Status = "Returned";
        request.ReturnedDate = DateTime.Now;

        _context.SaveChanges();
        return Ok("Item marked as returned");
    }

    [HttpGet("overdue")]
    public IActionResult GetOverdueRequests()
    {
        var overdue = _context.Requests
            .Where(r => r.Status == "Approved" && r.EndDate < DateTime.Now && r.ReturnedDate == null)
            .Select(r => new
            {
                r.Id,
                r.ItemId,
                r.StudentId,
                r.StartDate,
                r.EndDate,
                DaysOverdue = (DateTime.Now - r.EndDate).Days
            })
            .ToList();

        return Ok(overdue);
    }

    private bool IsAdmin(int id) => _context.Users.Any(u => u.Id == id && u.Role == "admin");
    private bool IsStaff(int id) => _context.Users.Any(u => u.Id == id && u.Role == "staff");
}