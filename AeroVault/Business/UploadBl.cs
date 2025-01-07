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
    }
}