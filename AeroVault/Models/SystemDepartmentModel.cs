using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroVault.Models
{
    public class SystemDepartmentModel
    {
        public int SystemID { get; set; }
        public SystemModel System { get; set; }

        public int DepartmentID { get; set; }
        public DepartmentModel Department { get; set; }
    }
}