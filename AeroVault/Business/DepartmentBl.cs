//using AeroVault.Models;
//using AeroVault.Repositories;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using static AeroVault.Controllers.DepartmentsController;
//namespace AeroVault.Services
//{
//    public class DepartmentBl
//    {
//        private readonly DepartmentDl _departmentDl;

//        public DepartmentBl(DepartmentDl departmentDl)
//        {
//            _departmentDl = departmentDl;
//        }

//        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
//        {
//            return await _departmentDl.GetAllDepartmentsAsync();
//        }

//        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
//        {
//            return await _departmentDl.GetAllDivisionsAsync();
//        }

//        public (bool Success, string Message, object Data) AddDepartmentAsync(string departmentName, int divisionId)
//        {
//            if (string.IsNullOrWhiteSpace(departmentName))
//            {
//                return (false, "Department name cannot be empty.", null);
//            }

//            try
//            {


//                var (departmentId, divisionName) = _departmentDl.AddDepartmentAsync(departmentName, divisionId);

//                return (true, "Department added successfully.", new
//                {
//                    departmentId,
//                    departmentName,
//                    divisionId,
//                    divisionName
//                });
//            }
//            catch (Exception ex)
//            {
//                return (false, "Internal server error: " + ex.Message, null);
//            }
//        }

//        public async Task<(bool Success, string Message)> UpdateDepartmentAsync(UpdateDepartmentRequest request)
//        {
//            if (request == null || string.IsNullOrWhiteSpace(request.DepartmentName))
//            {
//                return (false, "Invalid department data");
//            }

//            try
//            {
//                bool updated = await _departmentDl.UpdateDepartmentAsync(request.DepartmentId, request.DepartmentName, request.DivisionId);
//                return updated ? (true, "Department updated successfully!") : (false, "Department not found");
//            }
//            catch (Exception ex)
//            {
//                return (false, "Internal server error: " + ex.Message);
//            }
//        }

//        public async Task<(bool Success, string Message)> SoftDeleteDepartmentAsync(int departmentId)
//        {
//            try
//            {
//                bool deleted = await _departmentDl.SoftDeleteDepartmentAsync(departmentId);
//                return deleted ? (true, "Department soft deleted successfully") : (false, "Department not found");
//            }
//            catch (Exception ex)
//            {
//                return (false, "An unexpected error occurred: " + ex.Message);
//            }
//        }

//        public async Task<List<SystemModel>> GetSystemsByDepartmentAsync(int departmentId)
//        {
//            return await _departmentDl.GetSystemsByDepartmentAsync(departmentId);
//        }


//        public bool disableDepartment(int DepartmentID)
//        {
//            try
//            {
//                bool Updated = _departmentDl.disableDepartment(DepartmentID);
//                return Updated ? true : false;
//            }
//            catch (Exception e)
//            {
//                return false;
//            }
//        }

//        public bool enableDepartment(int DepartmentID)
//        {
//            try
//            {
//                bool Updated = _departmentDl.enableDepartment(DepartmentID);
//                return Updated ? true : false;
//            }
//            catch (Exception e)
//            {
//                return false;
//            }
//        }

//        public List<DepartmentModel> GetAllDepartments()
//        {
//            return _departmentDl.GetAllDepartments();
//        }
//    }
//}

using AeroVault.Models;
using AeroVault.Repositories;
using AeroVault.Services;
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

        public (bool Success, string Message, object Data) AddDepartmentAsync(string departmentName, int divisionId)
        {
            if (string.IsNullOrWhiteSpace(departmentName))
            {
                return (false, "Department name cannot be empty.", null);
            }

            try
            {


                var (departmentId, divisionName) = _departmentDl.AddDepartmentAsync(departmentName, divisionId);

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

        //UpdateDepartment

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


        public bool enableDepartment(int departmentID)
        {
            try
            {
                return _departmentDl.enableDepartment(departmentID);
            }
            catch (Exception e)
            {
                // Log e.Message if needed
                return false;
            }
        }

        public bool disableDepartment(int departmentID)
        {
            try
            {
                return _departmentDl.disableDepartment(departmentID);
            }
            catch (Exception e)
            {
                // Log e.Message if needed
                return false;
            }
        }

        public async Task<List<DepartmentModel>> GetdiviAsync(int divisionID)
        {
            return await _departmentDl.GetDepartmentsByDivisionAsync(divisionID);
        }

        public async Task<List<int>> GetDepartmentIdsBySystemIdAsync(int systemId)
        {
            return await _departmentDl.GetDepartmentIdsBySystemIdAsync(systemId);
        }




    }
}