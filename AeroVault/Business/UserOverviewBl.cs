﻿using AeroVault.Data;
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
    }
}