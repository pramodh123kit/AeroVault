using AeroVault.Models;
using AeroVault.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static AeroVault.Controllers.DepartmentsController;
namespace AeroVault.Services
{
    public class DepartmentBl
    {
        private readonly DepartmentDl _departmentDl;

        public DepartmentBl(DepartmentDl departmentDl)
        {
            _departmentDl = departmentDl;
        }

        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            return await _departmentDl.GetAllDepartmentsAsync();
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _departmentDl.GetAllDivisionsAsync();
        }

        public async Task<(bool Success, string Message, object Data)> AddDepartmentAsync(string departmentName, int divisionId)
        {
            if (string.IsNullOrWhiteSpace(departmentName))
            {
                return (false, "Department name cannot be empty.", null);
            }

            try
            {
                bool exists = await _departmentDl.DepartmentExistsAsync(departmentName, divisionId);
                if (exists)
                {
                    return (false, "A department with this name already exists in the selected division.", null);
                }

                var (departmentId, divisionName) = await _departmentDl.AddDepartmentAsync(departmentName, divisionId);

                return (true, "Department added successfully.", new
                {
                    departmentId,
                    departmentName,
                    divisionId,
                    divisionName
                });
            }
            catch (Exception ex)
            {
                return (false, "Internal server error: " + ex.Message, null);
            }
        }

        public async Task<(bool Success, string Message)> UpdateDepartmentAsync(UpdateDepartmentRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.DepartmentName))
            {
                return (false, "Invalid department data");
            }

            try
            {
                bool updated = await _departmentDl.UpdateDepartmentAsync(request.DepartmentId, request.DepartmentName, request.DivisionId);
                return updated ? (true, "Department updated successfully!") : (false, "Department not found");
            }
            catch (Exception ex)
            {
                return (false, "Internal server error: " + ex.Message);
            }
        }

        public async Task<(bool Success, string Message)> SoftDeleteDepartmentAsync(int departmentId)
        {
            try
            {
                bool deleted = await _departmentDl.SoftDeleteDepartmentAsync(departmentId);
                return deleted ? (true, "Department soft deleted successfully") : (false, "Department not found");
            }
            catch (Exception ex)
            {
                return (false, "An unexpected error occurred: " + ex.Message);
            }
        }

        public async Task<List<SystemModel>> GetSystemsByDepartmentAsync(int departmentId)
        {
            return await _departmentDl.GetSystemsByDepartmentAsync(departmentId);
        }
    }
}