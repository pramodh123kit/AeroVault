using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class UserOverview : Controller
    {
        public IActionResult UserPageOverview()
        {
            return View("~/Views/User/UserOverview/UserPageOverview.cshtml");
        }
    }
}
