using System.ComponentModel.DataAnnotations;

namespace AeroVault.Models
{
    public class SystemModel
    {
        [Key]
        public int SystemID { get; set; }
        public string SystemName { get; set; }
        public string Description { get; set; }
        public int DepartmentID { get; set; }
    }
}