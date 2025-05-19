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
        public async Task<int> GetViewedFileCountAsync(string uniqueFileIdentifier)

        {

            return await _reviewDl.GetViewedFileCountAsync(uniqueFileIdentifier);

        }
        public async Task<List<ViewedFileModel>> GetStaffNosByUniqueFileIdentifierAsync(string uniqueFileIdentifier)
        {
            return await _reviewDl.GetStaffNosByUniqueFileIdentifierAsync(uniqueFileIdentifier);
        }

        public async Task<List<FileWithViewDetailsModel>> GetFilesWithViewDetailsAsync(int systemId)
        {
            var result = new List<FileWithViewDetailsModel>();

            // Step 1: Get all files for the system
            var files = await _reviewDl.GetFilesBySystemAsync(systemId); // Assume _fileRepository is your DAL class

            foreach (var file in files)
            {
                var model = new FileWithViewDetailsModel
                {
                    File = file,
                    ViewedCount = 0,
                    Viewers = new List<ViewedFileModel>()
                };

                if (!string.IsNullOrEmpty(file.UniqueFileIdentifier))
                {
                    // Step 2: Get count of unique viewers
                    model.ViewedCount = await _reviewDl.GetViewedFileCountAsync(file.UniqueFileIdentifier);

                    // Step 3: Get list of viewers (optional - remove if not needed)
                    model.Viewers = await _reviewDl.GetStaffNosByUniqueFileIdentifierAsync(file.UniqueFileIdentifier);
                }

                result.Add(model);
            }

            return result;
        }

    }
}