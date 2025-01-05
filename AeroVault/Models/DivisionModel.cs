using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroVault.Models
{
    public class DivisionModel
    {
        [Key]
        public int DivisionID { get; set; }

        [Required(ErrorMessage = "Division name is required.")]
        [StringLength(100, ErrorMessage = "Division name cannot be longer than 100 characters.")]
        public string DivisionName { get; set; }
        [Column("IsDeleted")]
        public int IsDeleted { get; set; } = 0;
        public DateTime? AddedDate { get; set; }
    }
}