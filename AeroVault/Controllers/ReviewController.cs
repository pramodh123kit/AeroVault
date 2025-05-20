using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

[AuthorizeUser]
public class ReviewController : BaseAdminController
{
    private readonly ReviewBl _reviewBl;

    public ReviewController(ApplicationDbContext context, ReviewBl reviewBl) : base(context)
    {
        _reviewBl = reviewBl;
    }

    public async Task<IActionResult> Index()
    {
        var departments = await _reviewBl.GetAllDepartmentsAsync();

        var viewModel = new DepartmentViewModel
        {
            Departments = departments
        };

        return PartialView("~/Views/Admin/_Review.cshtml", viewModel);
    }


    public async Task<IActionResult> GetSystemsByDepartment(int departmentId)
    {
        var systems = await _reviewBl.GetSystemsByDepartmentAsync(departmentId);
        return Json(systems);
    }

    public async Task<IActionResult> GetFilesBySystem(int systemId)
    {
        var files = await _reviewBl.GetFilesBySystemAsync(systemId);
        return Json(files);
    }
    [HttpGet]
    public async Task<IActionResult> CheckStaffNoExists(string staffNo)
    {
        bool exists = await _reviewBl.CheckStaffNoExistsAsync(staffNo);
        return Json(new { exists });
    }
    public async Task<IActionResult> GetStaffDetails(string staffNo)
    {
        var staffDetails = await _reviewBl.GetStaffDetailsAsync(staffNo);
        return Json(staffDetails);
    }
    public async Task<IActionResult> GetDepartmentId(string departmentName)
    {
        var department = await _reviewBl.GetDepartmentByNameAsync(departmentName);
        return Json(new { departmentId = department?.DepartmentID });
    }
    public async Task<IActionResult> GetSystemById(int systemId)
    {
        var system = await _reviewBl.GetSystemByIdAsync(systemId);
        return Json(system);
    }
    [HttpGet]
    public async Task<IActionResult> CheckFileViewed(string staffNo, string uniqueFileIdentifier)
    {
        var viewedFile = await _reviewBl.CheckFileViewedAsync(staffNo, uniqueFileIdentifier);
        return Json(viewedFile);
    }

    [HttpGet]
    public async Task<IActionResult> GetUniqueFileIdentifiers(string staffNo)
    {
        var uniqueFileIdentifiers = await _reviewBl.GetUniqueFileIdentifiersByStaffNoAsync(staffNo);
        return Json(new { uniqueFileIdentifiers });
    }

    [HttpGet]
    public async Task<IActionResult> GetViewedFiles(string staffNo)
    {
        var viewedFiles = await _reviewBl.GetViewedFilesByStaffNoAsync(staffNo);
        return Json(viewedFiles);
    }
    public async Task<IActionResult> GetNonDeletedFilesBySystem(int systemId)
    {
        var files = await _reviewBl.GetFilesBySystemAsync(systemId);
        var nonDeletedFiles = files.Where(f => f.IsDeleted == 0).ToList();
        return Json(nonDeletedFiles);
    }
    [HttpGet]
    public async Task<IActionResult> GetViewedFileCount(string uniqueFileIdentifier)
    {
        int count = await _reviewBl.GetViewedFileCountAsync(uniqueFileIdentifier);
        return Json(new { count });
    }
    [HttpGet]
    public async Task<IActionResult> GetStaffNosByUniqueFileIdentifier(string uniqueFileIdentifier)
    {
        var staffDetails = await _reviewBl.GetStaffNosByUniqueFileIdentifierAsync(uniqueFileIdentifier);
        return Json(staffDetails);


    }


    [HttpGet]
    public async Task<IActionResult> GetStaffNosByUniqueFileIdentifierAsync(string uniqueFileIdentifier)
    {
        var staffDetails = await _reviewBl.GetStaffNosByUniqueFileIdentifierAsync(uniqueFileIdentifier);
        return Json(staffDetails);

    }

}