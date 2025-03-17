using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    [AuthorizeUser]
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("User Role") == "AEVT-Staff")
            {
                TempData["AccessDeniedMessage"] = "Access not given";
                return RedirectToAction("UserPageOverview", "UserOverview");
            }

            return View();
        }

        public IActionResult ReviewTable()
        {
            return View();
        }
    }
}