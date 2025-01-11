using AeroVault.Data;
using AeroVault.Models;

namespace AeroVault.Business
{
    public class UploadBl
    {
        private readonly UploadDl _uploadDl;

        public UploadBl(UploadDl uploadDl)
        {
            _uploadDl = uploadDl;
        }

        public List<DepartmentModel> GetActiveDepartments()
        {
            return _uploadDl.GetActiveDepartments();
        }

        public List<SystemModel> GetActiveSystems()
        {
            return _uploadDl.GetActiveSystems();
        }

        public List<DivisionModel> GetActiveDivisions()
        {
            return _uploadDl.GetActiveDivisions();
        }

        public List<SystemModel> GetActiveSystemsByDepartment(int departmentId)
        {
            return _uploadDl.GetActiveSystemsByDepartment(departmentId);
        }
        public List<FileModel> GetAllFiles()
        {
            return _uploadDl.GetAllFiles();
        }
    }
}