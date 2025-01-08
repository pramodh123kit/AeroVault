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
        // Fetch active divisions
        var activeDivisions = _uploadBl.GetActiveDivisions();

        // Fetch active departments
        var activeDepartments = _uploadBl.GetActiveDepartments();

        // Create a view model
        var viewModel = new DepartmentViewModel
        {
            Divisions = activeDivisions,
            Departments = activeDepartments,
            Systems = _uploadBl.GetActiveSystems() // Assuming you want to keep this as well
        };

        return PartialView("~/Views/Admin/_Upload.cshtml", viewModel);
    }

    public IActionResult GetSystemsByDepartment(int departmentId)
    {
        var systems = _uploadBl.GetActiveSystemsByDepartment(departmentId);
        return Json(systems);
    }
}