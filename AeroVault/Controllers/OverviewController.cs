using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

public class OverviewController : BaseAdminController
{
    public OverviewController(ApplicationDbContext context) : base(context) { }

    public IActionResult Index()
    {
        return PartialView("~/Views/Admin/_Overview.cshtml");
       

    }
}