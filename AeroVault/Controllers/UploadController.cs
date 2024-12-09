using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

public class UploadController : BaseAdminController
{
    public UploadController(ApplicationDbContext context) : base(context) { }

    public IActionResult Index()
    {
        return PartialView("~/Views/Admin/_Upload.cshtml"); // Return partial view
    }
}