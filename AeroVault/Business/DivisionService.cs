﻿using AeroVault.Data;
using AeroVault.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Business
{
    public class DivisionService
    {
        private readonly DivisionRepository _divisionRepository;

        public DivisionService(DivisionRepository divisionRepository)
        {
            _divisionRepository = divisionRepository;
        }

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _divisionRepository.GetAllDivisionsAsync();
        }

        public async Task AddDivisionAsync(string divisionName)
        {
            if (string.IsNullOrEmpty(divisionName))
            {
                throw new ArgumentException("Division name cannot be empty.");
            }
            await _divisionRepository.AddDivisionAsync(divisionName);
        }
        public async Task UpdateDivisionNameAsync(string originalName, string newDivisionName)
        {
            if (string.IsNullOrEmpty(originalName) || string.IsNullOrEmpty(newDivisionName))
            {
                throw new ArgumentException("Division names cannot be empty.");
            }

            await _divisionRepository.UpdateDivisionNameAsync(originalName, newDivisionName);
        }

        public async Task<(bool Success, string Message)> SoftDeleteDivisionAsync(int divisionId)
        {
            try
            {
                bool deleted = await _divisionRepository.SoftDeleteDivisionAsync(divisionId);
                return deleted ? (true, "Division soft deleted successfully") : (false, "Division not found");
            }
            catch (Exception ex)
            {
                return (false, "An unexpected error occurred: " + ex.Message);
            }
        }

        public async Task<List<DepartmentModel>> GetDepartmentsByDivisionAsync(int divisionId)
        {
            return await _divisionRepository.GetDepartmentsByDivisionAsync(divisionId);
        }
    }
}