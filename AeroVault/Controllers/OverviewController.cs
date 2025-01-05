using AeroVault.Controllers;
using AeroVault.Data; // Include your repositories
using AeroVault.Models; // Include your models
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class OverviewController : BaseAdminController
{
    private readonly DivisionRepository _divisionRepository;
    private readonly SystemRepository _systemRepository;

    public async Task<IActionResult> Index()
    {
        var divisions = await _divisionRepository.GetAllDivisionsAsync();
        var systems = await _systemRepository.GetAllSystemsAsync();

        var viewModel = new OverviewViewModel
        {
            DepartmentCount = divisions.Count,
            SystemCount = systems.Count,
            DocumentCount = 0, // Set to 0 or fetch from the database if needed
            VideoCount = 0 // Set to 0 or fetch from the database if needed
        };

        // Log the counts for debugging
        Console.WriteLine($"Department Count: {viewModel.DepartmentCount}");
        Console.WriteLine($"System Count: {viewModel.SystemCount}");

        return PartialView("~/Views/Admin/_Overview.cshtml", viewModel);
    }

    public OverviewController(ApplicationDbContext context, DivisionRepository divisionRepository, SystemRepository systemRepository)
        : base(context)
    {
        _divisionRepository = divisionRepository;
        _systemRepository = systemRepository;
    }
}