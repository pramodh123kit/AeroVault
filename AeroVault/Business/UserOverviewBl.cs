using AeroVault.Data;
using System.Collections.Generic;

namespace AeroVault.Business
{
    public class UserOverviewBl
    {
        private readonly UserOverviewDl _userOverviewDl;

        public UserOverviewBl(UserOverviewDl userOverviewDl)
        {
            _userOverviewDl = userOverviewDl;
        }

        public List<string> GetActiveSystems()
        {
            return _userOverviewDl.GetActiveSystems();
        }

        public List<string> GetSystemsByDepartment(string departmentName)
        {
            return _userOverviewDl.GetSystemsByDepartment(departmentName);
        }
        public bool IsDepartmentActive(string departmentName)
        {
            return _userOverviewDl.IsDepartmentActive(departmentName);
        }

        public (int SystemCount, int DocumentCount, int VideoCount) GetDepartmentCounts(string departmentName)
        {
            return _userOverviewDl.GetDepartmentCounts(departmentName);
        }

        public List<FileModel> GetRecentFilesByDepartment(string departmentName, int count = 10)
        {
            return _userOverviewDl.GetRecentFilesByDepartment(departmentName, count);
        }
        public int GetViewedFileCountByDepartment(string staffNo, string department)
        {
            return _userOverviewDl.GetViewedFileCountByDepartment(staffNo, department);
        }
        public int GetPendingFileCount(string staffNo, string department)
        {
            return _userOverviewDl.GetPendingFileCount(staffNo, department);
        }
        public int GetTotalFilesCountByDepartment(string department)
        {
            return _userOverviewDl.GetTotalFilesCountByDepartment(department);
        }
    }
}