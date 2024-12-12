﻿using AeroVault.Data;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static AeroVault.Controllers.SystemsController;

namespace AeroVault.Business
{
    public class SystemService
    {
        private readonly SystemRepository _systemRepository;

        public SystemService(SystemRepository systemRepository)
        {
            _systemRepository = systemRepository;
        }

        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            return await _systemRepository.GetAllSystemsAsync();
        }

        public async Task<bool> CheckSystemExistsAsync(string systemName)
        {
            return await _systemRepository.CheckSystemExistsAsync(systemName);
        }

        public async Task<IActionResult> CreateSystemAsync(CreateSystemRequest request)
        {
            try
            {
                var newSystemId = await _systemRepository.CreateSystemAsync(request);
                return new OkObjectResult(new
                {
                    systemId = newSystemId,
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

        public async Task<IActionResult> DeleteSystemAsync(int systemId)
        {
            var success = await _systemRepository.DeleteSystemAsync(systemId);
            if (!success)
            {
                return new NotFoundObjectResult(new { message = "System not found" });
            }
            return new OkObjectResult(new { message = "System deleted successfully" });
        }

        public async Task<List<object>> GetDivisionsForPopupAsync()
        {
            return await _systemRepository.GetDivisionsForPopupAsync();
        }
    }
}