using AeroVault.Data;
using AeroVault.Models;

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
    }
}