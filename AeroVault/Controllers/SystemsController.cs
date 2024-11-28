using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class SystemsController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Systems");
        }
    }
}