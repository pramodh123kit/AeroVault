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

    [HttpGet]
    public async Task<IActionResult> GetAllDivisions()
    {
        var divisions = await _divisionBl.GetAllDivisionsAsync();
        return Json(divisions);
    }


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

