using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class OverviewController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Overview");
        }
    }
}