using AeroVault.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class FileModel
{
    [Key]
    [Column("FileID")]
    public int FileID { get; set; }

    [Column("SystemID")]
    public int SystemID { get; set; }

    [Required]
    [StringLength(255)]
    [Column("FileName")]
    public string FileName { get; set; }

    [StringLength(50)]
    [Column("FileType")]
    public string FileType { get; set; }

    [StringLength(50)]
    [Column("FileCategory")]
    public string FileCategory { get; set; }

    [StringLength(500)]
    [Column("FilePath")]
    public string FilePath { get; set; }

    [Column("Added_Date")]
    public DateTime? AddedDate { get; set; } = DateTime.Now;

    [Column("Added_Time")]
    public DateTime? AddedTime { get; set; } = DateTime.Now;

    // Navigation property
    public SystemModel System { get; set; }

    [NotMapped] // This property won't be mapped to the database
    public string DepartmentName { get; set; }

    [NotMapped] // This property won't be mapped to the database
    public string DepartmentNames { get; set; } // Add this property to hold multiple department names
}