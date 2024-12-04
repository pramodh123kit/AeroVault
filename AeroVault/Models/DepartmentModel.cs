using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        // Add this column to represent soft delete
        [Column("is_deleted")]
        public int IsDeleted { get; set; } = 0;
    }
}