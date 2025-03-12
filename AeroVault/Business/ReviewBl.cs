using AeroVault.Data;
using AeroVault.Models;
using System.Threading.Tasks; // For async methods

namespace AeroVault.Business
{
    public class ReviewBl
    {
        private readonly ReviewDl _reviewDl;

        public ReviewBl(ReviewDl reviewDl)
        {
            _reviewDl = reviewDl;
        }

        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            return await _reviewDl.GetAllDepartmentsAsync();
        }

        public async Task<List<SystemModel>> GetSystemsByDepartmentAsync(int departmentId)
        {
            return await _reviewDl.GetSystemsByDepartmentAsync(departmentId);
        }

        public async Task<List<FileModel>> GetFilesBySystemAsync(int systemId)
        {
            return await _reviewDl.GetFilesBySystemAsync(systemId);
        }
        public async Task<bool> CheckStaffNoExistsAsync(string staffNo)
        {
            return await _reviewDl.CheckStaffNoExistsAsync(staffNo);
        }
        public async Task<StaffModel> GetStaffDetailsAsync(string staffNo)
        {
            return await _reviewDl.GetStaffDetailsAsync(staffNo);
        }
        public async Task<DepartmentModel> GetDepartmentByNameAsync(string departmentName)
        {
            return await _reviewDl.GetDepartmentByNameAsync(departmentName);
        }
        public async Task<SystemModel> GetSystemByIdAsync(int systemId)
        {
            return await _reviewDl.GetSystemByIdAsync(systemId);
        }
        public async Task<ViewedFileModel> CheckFileViewedAsync(string staffNo, string uniqueFileIdentifier)
        {
            return await _reviewDl.CheckFileViewedAsync(staffNo, uniqueFileIdentifier);
        }
        public async Task<List<string>> GetUniqueFileIdentifiersByStaffNoAsync(string staffNo)
        {
            return await _reviewDl.GetUniqueFileIdentifiersByStaffNoAsync(staffNo);
        }
        public async Task<List<ViewedFileModel>> GetViewedFilesByStaffNoAsync(string staffNo)
        {
            return await _reviewDl.GetViewedFilesByStaffNoAsync(staffNo);
        }
    }
}