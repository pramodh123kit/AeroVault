using System;

namespace AeroVault.Models
{
    public class ViewedFileModel
    {
        public DateTime? ViewedDate { get; set; } // Nullable DateTime to represent the date the file was viewed
        public string Status { get; set; } // Status can be "Read" or "Pending"
        public string UniqueFileIdentifier { get; set; } // Add this property
    }
}