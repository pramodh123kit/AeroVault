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
}