using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class DepartmentsController : Controller
    {
        public IActionResult Index()
        {
            return PartialView("_Departments");
        }
    }
}