using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class UserFileRepository : Controller
    {
        public IActionResult FileRepository()
        {
            return View();
        }
    }
}
