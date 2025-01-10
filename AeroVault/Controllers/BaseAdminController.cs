using Microsoft.AspNetCore.Mvc;
using AeroVault.Models;
using Microsoft.Extensions.Configuration;

namespace AeroVault.Controllers
{
    public abstract class BaseAdminController : Controller
    {
        protected readonly ApplicationDbContext _context;
        protected readonly IConfiguration _configuration;
        private ApplicationDbContext context;

        protected BaseAdminController(ApplicationDbContext context)
        {
            this.context = context;
        }

        protected BaseAdminController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
    }
}