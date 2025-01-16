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
        var videos = _uploadDl.GetVideos();
        var documents = _uploadDl.GetDocuments();

        var viewModel = new OverviewViewModel
        {
            DepartmentCount = departments.Count,
            SystemCount = systems.Count,
            DocumentCount = documents.Count, // Set to 0 or fetch from the database if needed
            VideoCount = videos.Count, // Set to 0 or fetch from the database if needed
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