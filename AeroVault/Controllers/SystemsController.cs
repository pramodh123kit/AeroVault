using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AeroVault.Models;
using AeroVault.Business;
using AeroVault.Services;

namespace AeroVault.Controllers
{
    public class SystemsController : BaseAdminController

    {
        private readonly SystemService _systemService;


        public SystemsController(ApplicationDbContext context, SystemService systemService) : base(context)
        {
            _systemService = systemService;
        }




        public async Task<IActionResult> Index()
        {
            var systems = await _systemService.GetAllSystemsAsync();
            var divisionsWithDepartments = await _systemService.GetDivisionsForPopupAsync();

            ViewBag.DivisionsWithDepartments = divisionsWithDepartments;
            return View("~/Views/Admin/_Systems.cshtml", systems);
        }


        [HttpGet]
        [Route("Systems/GetAllSystems")]
        public async Task<IActionResult> GetAllSystems()
        {
            var systems = await _systemService.GetAllSystemsAsync();
            return Ok(systems);
        }

        [HttpPost]
        public async Task<IActionResult> CheckSystemExists([FromBody] SystemExistsRequest request)
        {
            var exists = await _systemService.CheckSystemExistsAsync(request.SystemName);
            return Json(new { exists });
        }

        [HttpPost]
        public async Task<IActionResult> CreateSystem([FromBody] CreateSystemRequest request)
        {
            try
            {
                var result = await _systemService.CreateSystemAsync(request);
                return result; // This should return Ok() or other appropriate responses
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in CreateSystem: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while creating the system." });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteSystem(int systemId)
        {
            var result = await _systemService.DeleteSystemAsync(systemId);
            return result;
        }

        [HttpGet]
        public async Task<IActionResult> GetDivisionsForPopup()
        {
            var divisions = await _systemService.GetDivisionsForPopupAsync();
            return Json(divisions);
        }

        // DTO for the request
        public class SystemExistsRequest
        {
            public string SystemName { get; set; }
        }

        // DTO for creating a system
        public class CreateSystemRequest
        {
            public string SystemName { get; set; }
            public string Description { get; set; }
            public List<int> DepartmentIds { get; set; }
        }


        [HttpPut]
        public async Task<IActionResult> UpdateSystem([FromBody] UpdateSystemRequest request)
        {
            try
            {
                var result = await _systemService.UpdateSystemAsync(request);
                return result; // This should return Ok() or other appropriate responses
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateSystem: {ex.Message}"); // Log the error
                return StatusCode(500, new { message = "An error occurred while updating the system." });
            }
        }

        // DTO for updating a system
        // DTO for updating a system
        public class UpdateSystemRequest
        {
            public int SystemID { get; set; } // Add this line
            public string SystemName { get; set; }
            public string Description { get; set; }
            public List<int> DepartmentIds { get; set; }
        }



        [HttpGet]
        public async Task<IActionResult> GetSystemDepartments(string systemName)
        {
            var departmentIds = await _systemService.GetSystemDepartmentIdsAsync(systemName);
            return Json(departmentIds);
        }


        [HttpPost]
        public async Task<IActionResult> SoftDeleteSystem([FromBody] SoftDeleteSystemRequest request)
        {
            try
            {
                var result = await _systemService.SoftDeleteSystemAsync(request.SystemName);
                if (result)
                {
                    return Ok(new { message = "System soft deleted successfully" });
                }
                else
                {
                    return NotFound(new { message = "System not found" });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in SoftDeleteSystem: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while deleting the system." });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSystemDetails(string systemName)
        {
            var systemDetails = await _systemService.GetSystemDetailsAsync(systemName);
            return Json(systemDetails);
        }

        // DTO for soft delete request
        public class SoftDeleteSystemRequest
        {
            public string SystemName { get; set; }
        }


        [HttpGet]
        public async Task<IActionResult> GetSystemFiles(int systemId)
        {
            try
            {
                var files = await _systemService.GetFilesBySystemIdAsync(systemId);
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving system files", error = ex.Message });
            }
        }

    }
}