using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
