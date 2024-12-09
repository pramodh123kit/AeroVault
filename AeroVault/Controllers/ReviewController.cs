using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

public class ReviewController : BaseAdminController
{
    public ReviewController(ApplicationDbContext context) : base(context) { }

    public IActionResult Index()
    {
        return PartialView("~/Views/Admin/_Review.cshtml"); // Return partial view
    }
}