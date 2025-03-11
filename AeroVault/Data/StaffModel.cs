namespace AeroVault.Models
{
    public class StaffModel
    {
        public int RefNo { get; set; }
        public string StaffNo { get; set; }
        public string StaffName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public string Department { get; set; }
        public DateTime TimeOfLoggingIn { get; set; }
    }
}