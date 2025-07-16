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

        public Task<List<SystemModel>> GetAllSystemsAsync() =>
            _systemDl.GetAllSystemsAsync();

        public Task<bool> CheckSystemExistsAsync(string systemName) =>
            _systemDl.CheckSystemExistsAsync(systemName);

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

        public Task<List<object>> GetDivisionsForPopupAsync() =>
            _systemDl.GetDivisionsForPopupAsync();

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
                Console.WriteLine($"Error in UpdateSystemAsync: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }

        public Task<List<int>> GetSystemDepartmentIdsAsync(string systemName) =>
            _systemDl.GetSystemDepartmentIdsAsync(systemName);

        public Task<bool> SoftDeleteSystemAsync(string systemName) =>
            _systemDl.SoftDeleteSystemAsync(systemName);

        public Task<SystemModel> GetSystemDetailsAsync(string systemName) =>
            _systemDl.GetSystemDetailsAsync(systemName);

        public Task<List<FileModel>> GetFilesBySystemIdAsync(int systemId) =>
            _systemDl.GetFilesBySystemIdAsync(systemId);

        public Task<bool> SoftDeleteFileAsync(int fileId) =>
            _systemDl.SoftDeleteFileAsync(fileId);

        public Task<bool> UpdateFileAsync(UpdateFileRequest request) =>
            _systemDl.UpdateFileAsync(request);

        internal object AddSystemAsync(string systemName, object divisionId)
        {
            throw new NotImplementedException();
        }

        internal object AddDepartmentAsync(object systemName, int divisionId)
        {
            throw new NotImplementedException();
        }

        public bool enableSystem(int SystemID)
        {
            try
            {
                bool Updated = _systemDl.enableSystem(SystemID);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool disableSystem(int SystemID)
        {
            try
            {
                bool Updated = _systemDl.disableSystem(SystemID);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }




    }
}