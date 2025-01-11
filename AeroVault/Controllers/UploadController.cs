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
        var viewModel = new DepartmentViewModel
        {
            Divisions = _uploadBl.GetActiveDivisions(),
            Departments = _uploadBl.GetActiveDepartments(),
            Systems = _uploadBl.GetActiveSystems(),
            Files = _uploadBl.GetAllFiles() ?? new List<FileModel>() // Ensure it's never null
        };

        return PartialView("~/Views/Admin/_Upload.cshtml", viewModel);
    }

    public IActionResult GetSystemsByDepartment(int departmentId)
    {
        var systems = _uploadBl.GetActiveSystemsByDepartment(departmentId);
        return Json(systems);
    }
}