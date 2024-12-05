using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace AeroVault.Models
{
    public class SystemModel
    {
        [Key]
        public int SystemID { get; set; }
        public string SystemName { get; set; }
        public string Description { get; set; }
        public ICollection<SystemDepartmentModel> SystemDepartments { get; set; }
    }
}