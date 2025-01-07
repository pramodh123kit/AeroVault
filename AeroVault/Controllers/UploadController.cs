using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

public class UploadController : BaseAdminController
{
    private readonly UploadBl _uploadBl;

    public UploadController(
        ApplicationDbContext context,
        UploadBl uploadBl) : base(context)
    {
        _uploadBl = uploadBl;
    }

    public IActionResult Index()
    {
        // Fetch active departments
        var activeDepartments = _uploadBl.GetActiveDepartments();

        // Fetch active systems
        var activeSystems = _uploadBl.GetActiveSystems();

        // Create a view model
        var viewModel = new DepartmentViewModel
        {
            Departments = activeDepartments,
            Systems = activeSystems // Assuming you have a property for systems in your view model
        };

        return PartialView("~/Views/Admin/_Upload.cshtml", viewModel);
    }
}