using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
public class DivisionsController : BaseAdminController
{
    public DivisionsController(ApplicationDbContext context) : base(context) { }
    public async Task<IActionResult> IndexAsync()
    {
        var divisionsList = await GetAllDivisionsAsync();
        return PartialView("~/Views/Admin/_Divisions.cshtml", divisionsList); 

    }

    // Methods to read divisions
    public async Task<List<DivisionModel>> GetAllDivisionsAsync()
    {
        return await _context.Set<DivisionModel>()
            .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS")
            .ToListAsync();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDivisions()
    {
        var divisions = await GetAllDivisionsAsync();
        return Json(divisions);
    }

    // Method to add a division
    [HttpPost]
    public async Task<IActionResult> AddDivision(string divisionName)
    {
        if (string.IsNullOrEmpty(divisionName))
        {
            return BadRequest("Division name cannot be empty.");
        }

        string sql = "INSERT INTO Divisions (DivisionName) VALUES (:DivisionName)";
        var parameter = new OracleParameter(":DivisionName", divisionName);
        await _context.Database.ExecuteSqlRawAsync(sql, parameter);
        return Ok(new { Message = "Division added successfully!" });
    }
}