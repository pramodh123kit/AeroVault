using AeroVault.Business;
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
        var departments = await _departmentRepository.GetAllDepartmentsAsync();
        var systems = await _systemRepository.GetAllSystemsAsync();
        var divisions = await _divisionRepository.GetAllDivisionsAsync();

        DateTime onemonthagoVid = DateTime.Now.AddMonths(-1);
        DateTime threeMonthsAgoVid = DateTime.Now.AddMonths(-3);
        DateTime sixMonthsAgoVid = DateTime.Now.AddMonths(-6);
        DateTime oneYearAgoVid = DateTime.Now.AddMonths(-12);
        var videosForOne = _uploadDl.GetVideos(threeMonthsAgoVid);
        var videosForThree = _uploadDl.GetVideos(threeMonthsAgoVid);
        var videosForSix = _uploadDl.GetVideos(threeMonthsAgoVid);
        var videosForYear = _uploadDl.GetVideos(threeMonthsAgoVid);
        var videos = _uploadDl.GetVideos();

        // Calculate the date for three months ago
        DateTime onemonthagoDoc = DateTime.Now.AddMonths(-1);
        DateTime threeMonthsAgoDoc = DateTime.Now.AddMonths(-3);
        DateTime sixMonthsAgoDoc = DateTime.Now.AddMonths(-6);
        DateTime oneYearAgoDoc = DateTime.Now.AddYears(-1);
        var documentsForOne = _uploadDl.GetDocuments(onemonthagoDoc);
        var documentsForThree = _uploadDl.GetDocuments(threeMonthsAgoDoc);
        var documentsForSix = _uploadDl.GetDocuments(sixMonthsAgoDoc);
        var documentsForYear = _uploadDl.GetDocuments(oneYearAgoDoc);
        var documents = _uploadDl.GetDocuments();

        var viewModel = new OverviewViewModel
        {
            DepartmentCount = departments.Count,
            SystemCount = systems.Count,

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

            DivisionCount = divisions.Count
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