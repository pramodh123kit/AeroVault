using AeroVault.Models;
using System.Collections.Generic;

namespace AeroVault.Models
{
    public class DepartmentViewModel
    {
        public List<DepartmentModel> Departments { get; set; }
        public List<DivisionModel> Divisions { get; set; }
        public List<SystemModel> Systems { get; set; } 
        public List<FileModel> Files { get; set; }
    }
}