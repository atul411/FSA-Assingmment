namespace Edulend.Models
{
    public class Request
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int SchoolId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? ReturnedDate { get; set; } // null if not yet returned
        public string? Status { get; set; } // "Pending", "Approved", "Rejected", "Returned"
        
        public int AdminId { get; set; }
    }
}