using Microsoft.AspNetCore.Mvc;
using AeroVault.Models;

namespace AeroVault.Controllers
{
    public abstract class BaseAdminController : Controller
    {
        protected readonly ApplicationDbContext _context;
        private readonly string _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";


        protected BaseAdminController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}