using Microsoft.EntityFrameworkCore;
using Edulend.Models; 

namespace Edulend.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }
        public DbSet<LendingItem> Items { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<User> Users { get; set; }


    }
}