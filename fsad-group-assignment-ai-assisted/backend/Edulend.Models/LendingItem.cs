namespace Edulend.Models
{
    public class LendingItem
    {
         public int Id { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Condition { get; set; }
        public int Quantity { get; set; }
        public string? Availability { get; set; } // "In Stock", "Out of Stock"
        public int AdminId { get; set; }
        public int UserId { get; set; }
    }
}