using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class DivisionsController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Divisions");
        }
    }
}