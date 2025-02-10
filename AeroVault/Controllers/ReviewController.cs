﻿using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

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
}