using System.ComponentModel.DataAnnotations;

namespace AeroVault.Models
{
    public class StaffML
    {
        [Required(ErrorMessage = "Staff Number is required")]
        public string StaffNo { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public string StaffPassword { get; set; }

        public string StaffName { get; set; }
        public string EmailAddress { get; set; }
        public string UserRole { get; set; }
        public string Department { get; set; }

        public StaffML()
        {
            StaffNo = string.Empty;
            StaffPassword = string.Empty;
            StaffName = string.Empty;
            EmailAddress = string.Empty;
            UserRole = string.Empty;
            Department = string.Empty;
        }
    }
}