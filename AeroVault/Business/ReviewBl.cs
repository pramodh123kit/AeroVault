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
    }
}