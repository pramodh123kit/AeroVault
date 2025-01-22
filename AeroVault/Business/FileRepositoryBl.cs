using AeroVault.Data;
using AeroVault.Models;

namespace AeroVault.Business
{
    public class FileRepositoryBl
    {
        private readonly FileRepositoryDl _fileRepositoryDl;

        public FileRepositoryBl(FileRepositoryDl fileRepositoryDl)
        {
            _fileRepositoryDl = fileRepositoryDl;
        }

        public List<DepartmentModel> GetActiveDepartments()
        {
            return _fileRepositoryDl.GetActiveDepartments();
        }

        public List<SystemModel> GetSystemsByDepartment(int departmentId)
        {
            return _fileRepositoryDl.GetSystemsByDepartment(departmentId);
        }

        public List<FileModel> GetFilesBySystem(int systemId)
        {
            return _fileRepositoryDl.GetFilesBySystem(systemId);
        }
    }
}