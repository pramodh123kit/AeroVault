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
                // Validate input
                if (string.IsNullOrWhiteSpace(request.SystemName))
                {
                    return BadRequest(new { message = "System name is required" });
                }

                if (request.DepartmentIds == null || request.DepartmentIds.Count == 0)
                {
                    return BadRequest(new { message = "At least one department must be selected" });
                }

                // Check if system already exists
                var exists = await _systemService.CheckSystemExistsAsync(request.SystemName);
                if (exists)
                {
                    return Conflict(new { message = "A system with this name already exists" });
                }

                // Create system
                var result = await _systemService.CreateSystemAsync(request);
                return result;
            }
            catch (Exception ex)
            {
                // Log the exception
                //_logger.LogError(ex, "Error creating system");
                return StatusCode(500, new { message = "An error occurred while creating the system" });
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
                return result; 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the system." });
            }
        }

        // DTO for updating a system
        public class UpdateSystemRequest
        {
            public int SystemID { get; set; } 
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

        [HttpPost]
        public async Task<IActionResult> DeleteFile([FromBody] DeleteFileRequest request)
        {
            try
            {
                var result = await _systemService.SoftDeleteFileAsync(request.FileId);

                if (result)
                {
                    return Ok(new { success = true, message = "File deleted successfully" });
                }
                else
                {
                    return NotFound(new { success = false, message = "File not found" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An error occurred while deleting the file" });
            }
        }

        public class DeleteFileRequest
        {
            public int FileId { get; set; }
        }

        [HttpPut]
        [Route("Systems/UpdateFile")]
        public async Task<IActionResult> UpdateFile([FromBody] UpdateFileRequest request)
        {
            try
            {
                var result = await _systemService.UpdateFileAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateFile: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the file." });
            }
        }

        public class UpdateFileRequest
        {
            public int FileId { get; set; }
            public string FileName { get; set; }
            public string FileCategory { get; set; }
        }

    }
}