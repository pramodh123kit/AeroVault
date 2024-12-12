using AeroVault.Models;
using AeroVault.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static AeroVault.Controllers.DepartmentsController;
namespace AeroVault.Services
{
    public class DepartmentService
    {
        private readonly DepartmentRepository _departmentRepository;

        public DepartmentService(DepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            return await _departmentRepository.GetAllDepartmentsAsync();
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _departmentRepository.GetAllDivisionsAsync();
        }

        public async Task<(bool Success, string Message, object Data)> AddDepartmentAsync(string departmentName, int divisionId)
        {
            // Validate inputs
            if (string.IsNullOrWhiteSpace(departmentName))
            {
                return (false, "Department name cannot be empty.", null);
            }

            try
            {
                // Check if department already exists
                bool exists = await _departmentRepository.DepartmentExistsAsync(departmentName, divisionId);
                if (exists)
                {
                    return (false, "A department with this name already exists in the selected division.", null);
                }

                // Add department
                var (departmentId, divisionName) = await _departmentRepository.AddDepartmentAsync(departmentName, divisionId);

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
                bool updated = await _departmentRepository.UpdateDepartmentAsync(request.DepartmentId, request.DepartmentName, request.DivisionId);
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
                bool deleted = await _departmentRepository.SoftDeleteDepartmentAsync(departmentId);
                return deleted ? (true, "Department soft deleted successfully") : (false, "Department not found");
            }
            catch (Exception ex)
            {
                return (false, "An unexpected error occurred: " + ex.Message);
            }
        }
    }
}