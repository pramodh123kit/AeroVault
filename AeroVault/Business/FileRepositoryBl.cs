using AeroVault.Data;
using AeroVault.Models;
using System.Collections.Generic;

namespace AeroVault.Business
{
    public class FileRepositoryBl
    {
        private readonly FileRepositoryDl _fileRepositoryDl;

        public FileRepositoryBl(FileRepositoryDl fileRepositoryDl)
        {
            _fileRepositoryDl = fileRepositoryDl;
        }

        public List<DepartmentModel> GetDepartments()
        {
            return _fileRepositoryDl.GetNonDeletedDepartments();
        }

        public List<SystemModel> GetNonDeletedSystemsByDepartment(int departmentId)
        {
            return _fileRepositoryDl.GetNonDeletedSystemsByDepartment(departmentId);
        }

        public List<FileModel> GetDocumentsBySystem(int systemId)
        {
            return _fileRepositoryDl.GetDocumentsBySystem(systemId);
        }

        public List<FileModel> GetVideosBySystem(int systemId)
        {
            return _fileRepositoryDl.GetVideosBySystem(systemId);
        }

        public string GetBasePath()
        {
            return _fileRepositoryDl.GetBasePath();
        }
    }
}