using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class ReviewController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Review");
        }
    }
}