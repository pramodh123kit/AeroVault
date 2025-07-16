using AeroVault.Models;
using AeroVault.Repositories;
using AeroVault.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Controllers
{
    [AuthorizeUser]
    public class DepartmentsController : BaseAdminController
    {
        private readonly DepartmentBl _departmentBl;

        public DepartmentsController(ApplicationDbContext context, DepartmentBl departmentBl) : base(context)
        {
            _departmentBl = departmentBl;
        }

        public async Task<IActionResult> Index()
        {
            var departments = await _departmentBl.GetAllDepartmentsAsync();
            var divisions = await _departmentBl.GetAllDivisionsAsync();

            ViewData["Divisions"] = divisions;

            var viewModel = new DepartmentViewModel
            {
                Departments = departments,
                Divisions = divisions
            };

            return View("~/Views/Admin/_Departments.cshtml", viewModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            var departments = await _departmentBl.GetAllDepartmentsAsync();
            return Json(departments);
        }

        // ✅ Get all divisions (for first dropdown)
        [HttpGet]
        public async Task<IActionResult> GetAllDivisions()
        {
            var divisions = await _departmentBl.GetAllDivisionsAsync();
            return Json(divisions);
        }

        // ✅ Get departments for a selected division ID (for second dropdown)
        //[HttpGet]
        //public async Task<IActionResult> GetDepartmentsByDivision(int divisionId)
        //{
        //    var departments = await _departmentBl.GetDepartmentsByDivisionAsync(divisionId);
        //    return Json(departments);
        //}

        [HttpPost]
        public ActionResult AddDepartment([FromBody] UpdateDepartmentRequest request)
        {
            var result = _departmentBl.AddDepartmentAsync(request.DepartmentName, request.DivisionId);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return Ok(result.Data);
        }

        //[HttpPost]
        //public ActionResult GetDivi([FromBody] UpdateDepartmentRequest request)
        //{
        //    var result = _departmentBl.GetdiviAsync(request.DivisionId);
        //    if (!result.Success)
        //    {
        //        return BadRequest(result.Message);
        //    }
        //    return Ok(result.Data);
        //}

        [HttpPost]
        public async Task<IActionResult> GetDivi([FromBody] UpdateDepartmentRequest request)
        {
            var result = await _departmentBl.GetdiviAsync(request.DivisionId);

            if (result == null || result.Count == 0)
            {
                return NotFound("No departments found for the selected division.");
            }

            return Ok(result);
        }



        [HttpPost]
        public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentRequest request)
        {
            var result = await _departmentBl.UpdateDepartmentAsync(request);
            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }
            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        [HttpPut]
        public async Task<IActionResult> SoftDeleteDepartment([FromBody] DepartmentDeleteModel model)
        {
            var result = await _departmentBl.SoftDeleteDepartmentAsync(model.DepartmentId);
            if (!result.Success)
            {
                return NotFound(result.Message);
            }
            return Json(new { success = true, message = result.Message, departmentId = model.DepartmentId });
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemsByDepartment(int departmentId)
        {
            var systems = await _departmentBl.GetSystemsByDepartmentAsync(departmentId);
            return Json(systems);
        }

        public class UpdateDepartmentRequest
        {
            public int DepartmentId { get; set; }
            public string DepartmentName { get; set; }
            public int DivisionId { get; set; }
            public object SystemName { get; internal set; }
        }

        public class DepartmentDeleteModel
        {
            public int DepartmentId { get; set; }
        }

        [HttpPost]
        public IActionResult enableDepartment([FromBody] DepartmentModel model)
        {
            try
            {
                if (model.DepartmentID > 0)
                {
                    var success = _departmentBl.enableDepartment(model.DepartmentID);
                    if (success)
                        return Ok();
                    else
                        return StatusCode(500, "Failed to enable department");
                }
                return BadRequest("Invalid Department ID");
            }
            catch (Exception e)
            {
                return StatusCode(500, new
                {
                    Message = "Error enabling department",
                    ErrorDetails = e.Message
                });
            }
        }

        [HttpPost]
        public IActionResult disableDepartment([FromBody] DepartmentModel model)
        {
            try
            {
                if (model.DepartmentID > 0)
                {
                    var success = _departmentBl.disableDepartment(model.DepartmentID);
                    if (success)
                        return Ok();
                    else
                        return StatusCode(500, "Failed to disable department");
                }
                return BadRequest("Invalid Department ID");
            }
            catch (Exception e)
            {
                return StatusCode(500, new
                {
                    Message = "Error disabling department",
                    ErrorDetails = e.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemDepartmentIds(int systemId)
        {
            var departmentIds = await _departmentBl.GetDepartmentIdsBySystemIdAsync(systemId);
            return Json(departmentIds);
        }

    }
}
