using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;

namespace AeroVault.Controllers
{
    public class UserOverview : Controller
    {
        private readonly UserOverviewBl _userOverviewBl;

        public UserOverview(UserOverviewBl userOverviewBl)
        {
            _userOverviewBl = userOverviewBl;
        }

        public IActionResult UserPageOverview()
        {
            // Get active systems
            var systems = _userOverviewBl.GetActiveSystems();

            // Create a view model or pass systems directly
            ViewBag.Systems = systems;

            return View("~/Views/User/UserOverview/UserPageOverview.cshtml");
        }
    }
}