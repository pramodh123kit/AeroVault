using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class DivisionsController : BaseAdminController
{
    private readonly DivisionBl _divisionBl;

    public DivisionsController(ApplicationDbContext context, DivisionBl divisionBl)
        : base(context)
    {
        _divisionBl = divisionBl;
    }

    // GET: /Divisions
    public async Task<IActionResult> IndexAsync()
    {
        var divisionsList = await _divisionBl.GetAllDivisionsAsync();
        return PartialView("~/Views/Admin/_Divisions.cshtml", divisionsList);
    }

    // GET: /Divisions/GetAll
    [HttpGet]
    public async Task<IActionResult> GetAllDivisions()
    {
        var divisions = await _divisionBl.GetAllDivisionsAsync();
        return Json(divisions);
    }

    // POST: /Divisions/Add
    [HttpPost]
    public async Task<IActionResult> AddDivision([FromForm] string divisionName)
    {
        Console.WriteLine($"AddDivision method called at: {DateTime.Now}");
        Console.WriteLine($"Received division name: {divisionName}");

        if (string.IsNullOrEmpty(divisionName))
        {
            Console.WriteLine("Division name is null or empty");
            return BadRequest(new { Message = "Division name cannot be empty." });
        }

        try
        {
            await _divisionBl.AddDivisionAsync(divisionName);
            Console.WriteLine($"Division '{divisionName}' added successfully");
            return Ok(new
            {
                Message = "Division added successfully!",
                DivisionName = divisionName
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error adding division: {ex.Message}");
            return StatusCode(500, new
            {
                Message = "Internal server error",
                ErrorDetails = ex.Message
            });
        }
    }

    // POST: /Divisions/Update
    [HttpPost]
    public async Task<IActionResult> UpdateDivision(string originalName, string newDivisionName)
    {
        if (string.IsNullOrEmpty(originalName) || string.IsNullOrEmpty(newDivisionName))
        {
            return BadRequest(new { Message = "Division names cannot be empty." });
        }

        try
        {
            await _divisionBl.UpdateDivisionNameAsync(originalName, newDivisionName);
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

    // POST: /Divisions/Delete
    [HttpPost]
    public async Task<IActionResult> SoftDeleteDivision([FromBody] DivisionDeleteModel model)
    {
        if (model == null || model.DivisionId <= 0)
        {
            return BadRequest(new { Message = "Invalid Division ID." });
        }

        try
        {
            var result = await _divisionBl.SoftDeleteDivisionAsync(model.DivisionId);
            if (result.Success)
            {
                return Ok(new { Message = result.Message });
            }
            else
            {
                return NotFound(new { Message = result.Message });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting division: {ex.Message}");
            return StatusCode(500, new
            {
                Message = "Internal server error",
                ErrorDetails = ex.Message
            });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartmentsByDivision(int divisionId)
    {
        var departments = await _divisionBl.GetDepartmentsByDivisionAsync(divisionId);
        return Json(departments);
    }

}

// Model for soft delete
public class DivisionDeleteModel
{
    public int DivisionId { get; set; }
}