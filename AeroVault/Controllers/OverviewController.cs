﻿using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Data; // Include your repositories
using AeroVault.Models; // Include your models
using AeroVault.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class OverviewController : BaseAdminController
{
    private readonly DepartmentRepository _departmentRepository;
    private readonly SystemRepository _systemRepository;
    private readonly DivisionRepository _divisionRepository;
    private readonly UploadBl _uploadDl;

    public async Task<IActionResult> Index()
    {

        DateTime onemonthago = DateTime.Now.AddMonths(-1);
        DateTime threeMonthsAgo = DateTime.Now.AddMonths(-3);
        DateTime sixMonthsAgo = DateTime.Now.AddMonths(-6);
        DateTime oneYearAgo = DateTime.Now.AddMonths(-12);

        var divisions = await _divisionRepository.GetAllDivisionsAsync();
        var divisionsForOne = await _divisionRepository.GetDivisionsAddedAfterAsync(onemonthago);
        var divisionsForThree = await _divisionRepository.GetDivisionsAddedAfterAsync(threeMonthsAgo);
        var divisionsForSix = await _divisionRepository.GetDivisionsAddedAfterAsync(sixMonthsAgo);
        var divisionsForYear = await _divisionRepository.GetDivisionsAddedAfterAsync(oneYearAgo);

        var systems = await _systemRepository.GetAllSystemsAsync();
        var systemsForOne = await _systemRepository.GetSystemsAddedAfterAsync(onemonthago);
        var systemsForThree = await _systemRepository.GetSystemsAddedAfterAsync(threeMonthsAgo);
        var systemsForSix = await _systemRepository.GetSystemsAddedAfterAsync(sixMonthsAgo);
        var systemsForYear = await _systemRepository.GetSystemsAddedAfterAsync(oneYearAgo);

        var videos = _uploadDl.GetVideos();
        var videosForOne = _uploadDl.GetVideos(onemonthago);
        var videosForThree = _uploadDl.GetVideos(threeMonthsAgo);
        var videosForSix = _uploadDl.GetVideos(sixMonthsAgo);
        var videosForYear = _uploadDl.GetVideos(oneYearAgo);

        var documents = _uploadDl.GetDocuments();
        var documentsForOne = _uploadDl.GetDocuments(onemonthago);
        var documentsForThree = _uploadDl.GetDocuments(threeMonthsAgo);
        var documentsForSix = _uploadDl.GetDocuments(sixMonthsAgo);
        var documentsForYear = _uploadDl.GetDocuments(oneYearAgo);

        var departments = await _departmentRepository.GetAllDepartmentsAsync();
        var departmentsForOne = await _departmentRepository.GetDepartmentsAddedAfterAsync(onemonthago);
        var departmentsForThree = await _departmentRepository.GetDepartmentsAddedAfterAsync(threeMonthsAgo);
        var departmentsForSix = await _departmentRepository.GetDepartmentsAddedAfterAsync(sixMonthsAgo);
        var departmentsForYear = await _departmentRepository.GetDepartmentsAddedAfterAsync(oneYearAgo);

        var viewModel = new OverviewViewModel
        {
            DepartmentCount = departments.Count,
            Department_1_Count = departmentsForOne.Count,
            Department_3_Count = departmentsForThree.Count,
            Department_6_Count = departmentsForSix.Count,
            Department_12_Count = departmentsForYear.Count,


            SystemCount = systems.Count,
            System_1_Count = systemsForOne.Count,
            System_3_Count = systemsForThree.Count,
            System_6_Count = systemsForSix.Count,
            System_12_Count = systemsForYear.Count,

            DocumentCount = documents.Count,
            Document_1_Count = documentsForOne.Count,
            Document_3_Count = documentsForThree.Count,
            Document_6_Count = documentsForSix.Count,
            Document_12_Count = documentsForYear.Count,

            VideoCount = videos.Count,
            Video_1_Count = videosForOne.Count,
            Video_3_Count = videosForThree.Count,
            Video_6_Count = videosForSix.Count,
            Video_12_Count = videosForYear.Count,

            DivisionCount = divisions.Count,
            Division_1_Count = divisionsForOne.Count,
            Division_3_Count = divisionsForThree.Count,
            Division_6_Count = divisionsForSix.Count,
            Division_12_Count = divisionsForYear.Count
        };

        // Log the counts for debugging
        Console.WriteLine($"Department Count: {viewModel.DepartmentCount}");
        Console.WriteLine($"System Count: {viewModel.SystemCount}");
        Console.WriteLine($"Division Count: {viewModel.DivisionCount}");
        Console.WriteLine($"Videos Count: {viewModel.VideoCount}");
        Console.WriteLine($"Documents Count: {viewModel.DocumentCount}");

        return PartialView("~/Views/Admin/_Overview.cshtml", viewModel);
    }

    public OverviewController(ApplicationDbContext context, DepartmentRepository departmentRepository, SystemRepository systemRepository, DivisionRepository divisionRepository, UploadBl uploadbl)
        : base(context)
    {
        _departmentRepository = departmentRepository;
        _systemRepository = systemRepository;
        _divisionRepository = divisionRepository;
        _uploadDl = uploadbl;
    }


}