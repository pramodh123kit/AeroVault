using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace AeroVault.Models
{
    public class DepartmentModel
    {
        [Key]
        public int DepartmentID { get; set; }

        [Required]
        [StringLength(100)]
        public string DepartmentName { get; set; }

        public int DivisionID { get; set; }
        public DivisionModel Division { get; set; }

        [Column("is_deleted")]
        public int IsDeleted { get; set; } = 0;
        public ICollection<SystemDepartmentModel> SystemDepartments { get; set; }
        public DateTime? AddedDate { get; set; }
    }
}