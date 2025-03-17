using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AeroVault.Models;

namespace AeroVault.Controllers
{
    public class TestController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> TestConnection()
        {
            var canConnect = await _context.TestConnectionAsync();
            if (canConnect)
            {
                return Content("Database connection is successful.");
            }
            else
            {
                return Content("Database connection failed.");
            }
        }
    }
}