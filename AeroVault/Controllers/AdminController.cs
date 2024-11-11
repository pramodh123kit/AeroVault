using Microsoft.AspNetCore.Mvc;

namespace AeroVault.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult HumanR()
        {
            return View();
        }

        public IActionResult LoadView(string viewName)
        {
            switch (viewName)
            {
                case "_Upload":
                    return PartialView("_Upload");
                case "_Systems":
                    return PartialView("_Systems");
                case "_Departments":
                    return PartialView("_Departments");
                case "_Divisions":
                    return PartialView("_Divisions");
                case "_Review":
                    return PartialView("_Review");
                default:
                    return PartialView("_Overview");
            }
        }
    }
}