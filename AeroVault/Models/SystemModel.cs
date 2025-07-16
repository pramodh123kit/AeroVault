using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroVault.Models
{
    public class SystemModel
    {
        [Key]
        public int SystemID { get; set; }
        public string SystemName { get; set; }
        public string Description { get; set; }

        [Column("is_deleted")]
        public int IsDeleted { get; set; } = 0;

        public ICollection<SystemDepartmentModel> SystemDepartments { get; set; }

        public DateTime? AddedDate { get; set; }

        public int VideoCount { get; set; }
        public int DocCount { get; set; }
        public int DivisionID { get; set; }
       
    }
}