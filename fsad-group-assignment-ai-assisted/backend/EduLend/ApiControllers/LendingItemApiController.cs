using Microsoft.AspNetCore.Mvc;
using Edulend.Models;
using Edulend.DAL;

namespace Edulend.Controllers
{
    [Route("api/lending-items")]
    [ApiController]
    public class LendingItemApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LendingItemApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult Add(LendingItem item)
        {
            if (_context.Items.Any(i => i.Name == item.Name))
                return BadRequest("Item name already exists");

            if (string.IsNullOrWhiteSpace(item.Category) || !IsValidCategory(item.Category))
                return BadRequest("Invalid or missing category");

            if (!IsAdmin(item.AdminId))
                return Unauthorized("Admin not authorized");

            _context.Items.Add(item);
            _context.SaveChanges();
            return Ok(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, LendingItem updated)
        {
            var item = _context.Items.Find(id);
            if (item == null) return NotFound("Item not found");
            if (!IsAdmin(updated.AdminId)) return Unauthorized("Admin not authorized");

            item.Name = updated.Name ?? item.Name;
            item.Category = updated.Category ?? item.Category;
            item.Condition = updated.Condition ?? item.Condition;
            item.Quantity = updated.Quantity != 0 ? updated.Quantity : item.Quantity;
            item.Availability = updated.Availability ?? item.Availability;

            _context.SaveChanges();
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromBody] int adminId)
        {
            var item = _context.Items.Find(id);
            if (item == null) return NotFound("Item not found");
            if (!IsAdmin(adminId)) return Unauthorized("Admin not authorized");

            _context.Items.Remove(item);
            _context.SaveChanges();
            return Ok("Item deleted");
        }

        [HttpGet("{id}/availability")]
        public IActionResult CheckAvailability(int id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var item = _context.Items.Find(id);
            if (item == null) return NotFound("Item not found");

            var overlapping = _context.Requests
                .Where(r => r.ItemId == id && r.Status != "Returned" &&
                            r.StartDate < endDate && r.EndDate > startDate)
                .ToList();

            return Ok(new
            {
                Available = overlapping.Count == 0,
                UnavailableDates = overlapping.Select(r => new { r.StartDate, r.EndDate })
            });
        }

        [HttpGet]
        public IActionResult ListAvailable()
        {
            var items = _context.Items.Where(i => i.Availability == "In Stock").ToList();
            if (!items.Any()) return NotFound("No items found");
            return Ok(items);
        }

        private bool IsAdmin(int id)
        {
            return _context.Users.Any(u => u.Id == id && u.Role == "admin");
        }

        private bool IsValidCategory(string category)
        {
            return new[] { "Laptop", "Projector", "Tablet" }.Contains(category);
        }
    }
}