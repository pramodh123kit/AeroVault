using AeroVault.Models;
using AeroVault.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Controllers
{
    public class DepartmentsController : BaseAdminController
    {
        private readonly DepartmentService _departmentService;

        public DepartmentsController(ApplicationDbContext context, DepartmentService departmentService) : base(context)
        {
            _departmentService = departmentService;
        }

        public async Task<IActionResult> Index()
        {
            var departments = await _departmentService.GetAllDepartmentsAsync();
            var divisions = await _departmentService.GetAllDivisionsAsync();

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
            var departments = await _departmentService.GetAllDepartmentsAsync();
            return Json(departments);
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment(string departmentName, int divisionId)
        {
            var result = await _departmentService.AddDepartmentAsync(departmentName, divisionId);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentRequest request)
        {
            var result = await _departmentService.UpdateDepartmentAsync(request);
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
            var result = await _departmentService.SoftDeleteDepartmentAsync(model.DepartmentId);
            if (!result.Success)
            {
                return NotFound(result.Message);
            }
            return Json(new { success = true, message = result.Message, departmentId = model.DepartmentId });
        }


        [HttpGet]
        public async Task<IActionResult> GetSystemsByDepartment(int departmentId)
        {
            var systems = await _departmentService.GetSystemsByDepartmentAsync(departmentId);
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