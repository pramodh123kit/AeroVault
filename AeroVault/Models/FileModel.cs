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

    [Column("Added_Date")]
    public DateTime? AddedDate { get; set; } = DateTime.Now;

    [Column("Added_Time")]
    public DateTime? AddedTime { get; set; } = DateTime.Now;

    public SystemModel System { get; set; }

    [NotMapped] 
    public string DepartmentName { get; set; }

    [NotMapped] 
    public string DepartmentNames { get; set; } 

    [Column("IS_DELETED")]
    public int IsDeleted { get; set; } = 0;
}