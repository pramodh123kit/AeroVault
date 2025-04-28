using AeroVault.Data;
using AeroVault.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Business
{
    public class DivisionBl
    {
        private readonly DivisionDl _divisionDl;

        public DivisionBl(DivisionDl divisionDl)
        {
            _divisionDl = divisionDl;
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _divisionDl.GetAllDivisionsAsync();
        }

        //public async Task<List<DepartmentModel>> GetDepartmentsByDivisionAsync(int divisionId)
        //{
        //    return await _divisionDl.GetDepartmentsByDivisionAsync(divisionId);
        //}


        //public async Task AddDivisionAsync(string divisionName)
        //{
        //    if (string.IsNullOrEmpty(divisionName))
        //    {
        //        throw new ArgumentException("Division name cannot be empty.");
        //    }
        //    await _divisionDl.AddDivisionAsync(divisionName);
        //}
        //public async Task UpdateDivisionNameAsync(string originalName, string newDivisionName)
        //{
        //    if (string.IsNullOrEmpty(originalName) || string.IsNullOrEmpty(newDivisionName))
        //    {
        //        throw new ArgumentException("Division names cannot be empty.");
        //    }

        //    await _divisionDl.UpdateDivisionNameAsync(originalName, newDivisionName);
        //}

        //Below function is old function needs to replace in onother form
        //public async Task<(bool Success, string Message)> SoftDeleteDivisionAsync(int divisionId)
        //{
        //    try
        //    {
        //        bool deleted = await _divisionDl.SoftDeleteDivisionAsync(divisionId);
        //        return deleted ? (true, "Division soft deleted successfully") : (false, "Division not found");
        //    }
        //    catch (Exception ex)
        //    {
        //        return (false, "An unexpected error occurred: " + ex.Message);
        //    }
        //}


        public bool updateDivisionByID(int DivisionID, string DivisionName)
        {
            try
            {
                bool Updated = _divisionDl.updateDivisionByID(DivisionID, DivisionName);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool AddDivision(string DivisionName)
        {
            try
            {
                bool Updated = _divisionDl.AddDivision(DivisionName);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool enableDivision(int DivisionID)
        {
            try
            {
                bool Updated = _divisionDl.enableDivision(DivisionID);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool disableDivision(int DivisionID)
        {
            try
            {
                bool Updated = _divisionDl.disableDivision(DivisionID);
                return Updated ? true : false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public List<DivisionModel> GetAllDivisions()
        {
            return _divisionDl.GetAllDivisions();
        }

    }
}