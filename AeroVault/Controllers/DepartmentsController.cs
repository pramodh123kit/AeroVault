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
            var divisions = await _departmentBl.GetAllDepartmentsAsync();
            return Json(divisions);
        }




        [HttpPost]
        public ActionResult AddDepartment([FromBody] UpdateDepartmentRequest request)
        {
            var result =_departmentBl.AddDepartmentAsync(request.DepartmentName, request.DivisionId);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpPut]
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

        }

        public class DepartmentDeleteModel
        {
            public int DepartmentId { get; set; }
        }
    }
}