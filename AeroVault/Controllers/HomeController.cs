using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    [AuthorizeUser]
    public class HomeController : Controller
    {
        public IActionResult AccessDenied()
        {
            return View(); 
        }
    }
}
