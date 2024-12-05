using System.ComponentModel.DataAnnotations;

namespace AeroVault.Models
{
    public class DivisionModel
    {
        [Key]
        public int DivisionID { get; set; }

        [Required(ErrorMessage = "Division name is required.")]
        [StringLength(100, ErrorMessage = "Division name cannot be longer than 100 characters.")]
        public string DivisionName { get; set; }
    }
}