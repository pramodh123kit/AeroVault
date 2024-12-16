using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

public class DivisionsController : BaseAdminController
{
    private readonly DivisionService _divisionService;

    public DivisionsController(ApplicationDbContext context, DivisionService divisionService)
        : base(context)
    {
        _divisionService = divisionService;
    }

    // GET: /Divisions
    public async Task<IActionResult> IndexAsync()
    {
        var divisionsList = await _divisionService.GetAllDivisionsAsync();
        return PartialView("~/Views/Admin/_Divisions.cshtml", divisionsList);
    }

    // GET: /Divisions/GetAll
    [HttpGet]
    public async Task<IActionResult> GetAllDivisions()
    {
        var divisions = await _divisionService.GetAllDivisionsAsync();
        return Json(divisions);
    }

    // POST: /Divisions/Add
    [HttpPost]
    public async Task<IActionResult> AddDivision([FromForm] string divisionName)
    {
        // Add more comprehensive logging
        Console.WriteLine($"AddDivision method called at: {DateTime.Now}");
        Console.WriteLine($"Received division name: {divisionName}");

        if (string.IsNullOrEmpty(divisionName))
        {
            Console.WriteLine("Division name is null or empty");
            return BadRequest(new { Message = "Division name cannot be empty." });
        }

        try
        {
            await _divisionService.AddDivisionAsync(divisionName);
            Console.WriteLine($"Division '{divisionName}' added successfully");
            return Ok(new
            {
                Message = "Division added successfully!",
                DivisionName = divisionName
            });
        }
        catch (Exception ex)
        {
            // More detailed error logging
            Console.WriteLine($"Error adding division: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");

            return StatusCode(500, new
            {
                Message = "Internal server error",
                ErrorDetails = ex.Message
            });
        }
    }


    [HttpPost]
    public async Task<IActionResult> UpdateDivision(string originalName, string newDivisionName)
    {
        if (string.IsNullOrEmpty(originalName) || string.IsNullOrEmpty(newDivisionName))
        {
            return BadRequest(new { Message = "Division names cannot be empty." });
        }

        try
        {
            await _divisionService.UpdateDivisionNameAsync(originalName, newDivisionName);
            return Ok(new
            {
                Message = "Division updated successfully",
                NewDivisionName = newDivisionName
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating division: {ex.Message}");
            return StatusCode(500, new
            {
                Message = "Internal server error",
                ErrorDetails = ex.Message
            });
        }
    }
}