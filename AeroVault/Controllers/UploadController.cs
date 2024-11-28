using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class UploadController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Upload");
        }
    }
}