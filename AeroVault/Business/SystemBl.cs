using AeroVault.Data;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static AeroVault.Controllers.SystemsController;

namespace AeroVault.Business
{
    public class SystemBl
    {
        private readonly SystemDl _systemDl;

        public SystemBl(SystemDl systemDl)
        {
            _systemDl = systemDl;
        }

        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            return await _systemDl.GetAllSystemsAsync();
        }

        public async Task<bool> CheckSystemExistsAsync(string systemName)
        {
            return await _systemDl.CheckSystemExistsAsync(systemName);
        }

        public async Task<IActionResult> CreateSystemAsync(CreateSystemRequest request)
        {
            try
            {
                var newSystemId = await _systemDl.CreateSystemAsync(request);
                return new OkObjectResult(new
                {
                    systemId = newSystemId,
                    systemName = request.SystemName,
                    description = request.Description,
                    departments = request.DepartmentIds
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateSystemAsync: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }

        public async Task<IActionResult> DeleteSystemAsync(int systemId)
        {
            var success = await _systemDl.DeleteSystemAsync(systemId);
            if (!success)
            {
                return new NotFoundObjectResult(new { message = "System not found" });
            }
            return new OkObjectResult(new { message = "System deleted successfully" });
        }

        public async Task<List<object>> GetDivisionsForPopupAsync()
        {
            return await _systemDl.GetDivisionsForPopupAsync();
        }

        public async Task<IActionResult> UpdateSystemAsync(UpdateSystemRequest request)
        {
            try
            {
                var updatedSystem = await _systemDl.UpdateSystemAsync(request);

                return new OkObjectResult(new
                {
                    systemName = request.SystemName,
                    description = request.Description,
                    departments = request.DepartmentIds
                });
            }
            catch (InvalidOperationException ex)
            {
                return new ConflictObjectResult(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<List<int>> GetSystemDepartmentIdsAsync(string systemName)
        {
            return await _systemDl.GetSystemDepartmentIdsAsync(systemName);
        }


        public async Task<bool> SoftDeleteSystemAsync(string systemName)
        {
            try
            {
                return await _systemDl.SoftDeleteSystemAsync(systemName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SoftDeleteSystemAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<SystemModel> GetSystemDetailsAsync(string systemName)
        {
            return await _systemDl.GetSystemDetailsAsync(systemName);
        }

        public async Task<List<FileModel>> GetFilesBySystemIdAsync(int systemId)
        {
            return await _systemDl.GetFilesBySystemIdAsync(systemId);
        }

        public async Task<bool> SoftDeleteFileAsync(int fileId)
        {
            return await _systemDl.SoftDeleteFileAsync(fileId);
        }

        public async Task<bool> UpdateFileAsync(UpdateFileRequest request)
        {
            return await _systemDl.UpdateFileAsync(request);
        }
    }
}