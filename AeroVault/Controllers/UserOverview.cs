using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class UserOverview : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
