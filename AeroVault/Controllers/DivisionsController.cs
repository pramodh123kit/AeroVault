using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[AuthorizeUser]
public class DivisionsController : BaseAdminController
{
    private readonly DivisionBl _divisionBl;

    public DivisionsController(ApplicationDbContext context, DivisionBl divisionBl)
        : base(context)
    {
        _divisionBl = divisionBl;
    }

    public IActionResult Index()
    {
        //var divisionsList = await _divisionBl.GetAllDivisionsAsync();
        return PartialView("~/Views/Admin/_Divisions.cshtml");
    }

    //Below function is old function Before delete the function needs to check usage in frontend

    //[HttpGet]
    //public async Task<IActionResult> GetDepartmentsByDivision(int divisionId)
    //{
    //    var departments = await _divisionBl.GetDepartmentsByDivisionAsync(divisionId);
    //    return Json(departments);
    //}

    //Below function is old function Before delete the function needs to check usage in frontend

    [HttpGet]
    public async Task<IActionResult> GetAllDivisions()
    {
        var divisions = await _divisionBl.GetAllDivisionsAsync();
        return Json(divisions);
    }


    //[HttpPost]
    //public async Task<IActionResult> AddDivision([FromForm] string divisionName)
    //{
    //    Console.WriteLine($"AddDivision method called at: {DateTime.Now}");
    //    Console.WriteLine($"Received division name: {divisionName}");

    //    if (string.IsNullOrEmpty(divisionName))
    //    {
    //        Console.WriteLine("Division name is null or empty");
    //        return BadRequest(new { Message = "Division name cannot be empty." });
    //    }

    //    try
    //    {
    //        await _divisionBl.AddDivisionAsync(divisionName);
    //        Console.WriteLine($"Division '{divisionName}' added successfully");
    //        return Ok(new
    //        {
    //            Message = "Division added successfully!",
    //            DivisionName = divisionName
    //        });
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine($"Error adding division: {ex.Message}");
    //        return StatusCode(500, new
    //        {
    //            Message = "Internal server error",
    //            ErrorDetails = ex.Message
    //        });
    //    }
    //}

    //[HttpPost]
    //public async Task<IActionResult> UpdateDivision(string originalName, string newDivisionName)
    //{
    //    if (string.IsNullOrEmpty(originalName) || string.IsNullOrEmpty(newDivisionName))
    //    {
    //        return BadRequest(new { Message = "Division names cannot be empty." });
    //    }

    //    try
    //    {
    //        await _divisionBl.UpdateDivisionNameAsync(originalName, newDivisionName);
    //        return Ok(new
    //        {
    //            Message = "Division updated successfully",
    //            NewDivisionName = newDivisionName
    //        });
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine($"Error updating division: {ex.Message}");
    //        return StatusCode(500, new
    //        {
    //            Message = "Internal server error",
    //            ErrorDetails = ex.Message
    //        });
    //    }
    //}

    //[HttpPost]
    //public async Task<IActionResult> SoftDeleteDivision([FromBody] DivisionDeleteModel model)
    //{
    //    if (model == null || model.DivisionId <= 0)
    //    {
    //        return BadRequest(new { Message = "Invalid Division ID." });
    //    }

    //    try
    //    {
    //        var result = await _divisionBl.SoftDeleteDivisionAsync(model.DivisionId);
    //        if (result.Success)
    //        {
    //            return Ok(new { Message = result.Message });
    //        }
    //        else
    //        {
    //            return NotFound(new { Message = result.Message });
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        Console.WriteLine($"Error deleting division: {ex.Message}");
    //        return StatusCode(500, new
    //        {
    //            Message = "Internal server error",
    //            ErrorDetails = ex.Message
    //        });
    //    }
    //}


    [HttpPost]
    public ActionResult enableDivision([FromBody] DivisionModel model)
    {
        try
        {

            if (model.DivisionID != 0)
            {
                _divisionBl.enableDivision(model.DivisionID);
                return Ok();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, new
            {
                Message = "NO ID Number",
                ErrorDetails = e.Message
            });
        }
        return null;
    }


    [HttpPost]
    public ActionResult disableDivision([FromBody] DivisionModel model)
    {
        try
        {

            if (model.DivisionID != 0)
            {
                _divisionBl.disableDivision(model.DivisionID);
                return Ok();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, new
            {
                Message = "NO ID Number",
                ErrorDetails = e.Message
            });
        }
        return null;
    }



    [HttpPost]
    public ActionResult UpdateeDivisionByID([FromBody] DivisionModel model)
    {
        try
        {

            if (model.DivisionID != 0)
            {
                _divisionBl.updateDivisionByID(model.DivisionID, model.DivisionName);
                return Ok();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, new
            {
                Message = "NO ID Number",
                ErrorDetails = e.Message
            });
        }
        return null;
    }

    [HttpPost]
    public ActionResult AddDivisionByID([FromBody] DivisionModel model)
    {
        try
        {

            if (model.DivisionID != 0)
            {
                _divisionBl.updateDivisionByID(model.DivisionID, model.DivisionName);
                return Ok();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, new
            {
                Message = "NO ID Number",
                ErrorDetails = e.Message
            });
        }
        return null;
    }

    [HttpPost]
    public ActionResult AddDivision([FromBody] DivisionModel model)
    {
        try
        {

            if (model.DivisionName != "")
            {
                _divisionBl.AddDivision(model.DivisionName);
                return Ok();
            }
        }
        catch (Exception e)
        {
            return StatusCode(500, new
            {
                Message = "NO ID Number",
                ErrorDetails = e.Message
            });
        }
        return null;
    }



    [HttpGet]
    public IActionResult GetAllDivisionsNew()
    {
        var divisions = _divisionBl.GetAllDivisions();
        return Json(divisions);
    }

}

