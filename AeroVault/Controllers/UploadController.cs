using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;

[AuthorizeUser]
public class UploadController : BaseAdminController
{
    private readonly UploadBl _uploadBl;
    private readonly IConfiguration _configuration;

    public UploadController(
        ApplicationDbContext context,
        UploadBl uploadBl,
        IConfiguration configuration) : base(context)
    {
        _uploadBl = uploadBl;
        _configuration = configuration;
    }

    public IActionResult Index()
    {
        var viewModel = new DepartmentViewModel
        {
            Divisions = _uploadBl.GetActiveDivisions(),
            Departments = _uploadBl.GetActiveDepartments(),
            Systems = _uploadBl.GetActiveSystems(),
            Files = _uploadBl.GetAllFiles() ?? new List<FileModel>() 
        };

        return PartialView("~/Views/Admin/_Upload.cshtml", viewModel);
    }

    public IActionResult GetSystemsByDepartment(int departmentId)
    {
        var systems = _uploadBl.GetActiveSystemsByDepartment(departmentId);
        return Json(systems);
    }

    [HttpGet]
    public IActionResult ViewFile(string fileName)
    {
        try
        {
            var basePath = _configuration["FileSettings:BasePath"];

            var fullPath = Path.Combine(basePath, fileName);

            if (!System.IO.File.Exists(fullPath))
            {
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                var supportedExtensions = new[] {
                ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
                ".mp4", ".avi", ".mov", ".wmv", ".mkv"
            };

                foreach (var ext in supportedExtensions)
                {
                    var altPath = Path.Combine(basePath, fileNameWithoutExtension + ext);
                    if (System.IO.File.Exists(altPath))
                    {
                        fullPath = altPath;
                        fileName = Path.GetFileName(altPath);
                        break;
                    }
                }

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound($"File {fileName} not found");
                }
            }

            var contentType = GetContentType(fileName);

            var allowedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
            ".mp4", ".avi", ".mov", ".wmv", ".mkv"
        };
            var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Unsupported file type");
            }

            if (IsBrowserRenderableType(fileExtension))
            {
                return File(System.IO.File.OpenRead(fullPath), contentType);
            }

            return PhysicalFile(fullPath, contentType, fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while trying to view the file");
        }
    }

    private bool IsBrowserRenderableType(string fileExtension)
    {
        var renderableTypes = new[] {
        ".pdf", ".txt", ".doc", ".docx", ".xls", ".xlsx",
        ".mp4", ".avi", ".mov", ".wmv", ".mkv"
    };

        return renderableTypes.Contains(fileExtension.ToLowerInvariant());
    }
    private string GetContentType(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();

        return ext switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt" => "text/plain",
            ".mp4" => "video/mp4",
            ".avi" => "video/x-msvideo",
            ".mov" => "video/quicktime",
            ".wmv" => "video/x-ms-wmv",
            ".mkv" => "video/x-matroska",
            _ => "application/octet-stream"
        };
    }

    [HttpGet]
    public IActionResult FindFile(string fileName, string uniqueIdentifier = null)
    {
        try
        {
            var basePath = _configuration["FileSettings:BasePath"];
            var supportedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
            ".mp4", ".avi", ".mov", ".wmv", ".mkv"
        };

            if (!string.IsNullOrEmpty(uniqueIdentifier))
            {
                var matchingFiles = Directory.GetFiles(basePath, $"*_{uniqueIdentifier}.*")
                    .ToList();

                if (matchingFiles.Any())
                {
                    return Json(new { foundFileName = Path.GetFileName(matchingFiles.First()) });
                }
            }

            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);

            foreach (var ext in supportedExtensions)
            {
                var exactMatchPath = Path.Combine(basePath, fileName);
                if (System.IO.File.Exists(exactMatchPath))
                {
                    return Json(new { foundFileName = fileName });
                }

                var fullPathWithExt = Path.Combine(basePath, fileNameWithoutExtension + ext);
                if (System.IO.File.Exists(fullPathWithExt))
                {
                    return Json(new { foundFileName = fileNameWithoutExtension + ext });
                }
            }

            return Json(new { foundFileName = (string)null });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while searching for the file");
        }
    }

    [HttpPost]

    public async Task<IActionResult> UploadFiles([FromForm] UploadRequest uploadRequest)
    {
        try
        {
            if (uploadRequest.Files == null || uploadRequest.Files.Count == 0)
            {
                return BadRequest("No files uploaded");
            }

            var basePath = _configuration["FileSettings:BasePath"];
            var fileRecords = new List<FileModel>();
            foreach (var file in uploadRequest.Files)
            {
                if (file.Length == 0) continue;
                string uniqueIdentifier;
                do
                {
                    uniqueIdentifier = GenerateUniqueIdentifier();
                } while (IsIdentifierExists(uniqueIdentifier));

                var originalFileName = file.FileName;
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);
                var fileExtension = Path.GetExtension(originalFileName);

                var uniqueFileName = $"{fileNameWithoutExtension}_{uniqueIdentifier}{fileExtension}";
                var filePath = Path.Combine(basePath, uniqueFileName);

                Directory.CreateDirectory(basePath);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileType = fileExtension.ToLowerInvariant();
                string fileTypeString = DetermineFileType(fileType);

                var fileRecord = new FileModel
                {
                    FileName = originalFileName,
                    UniqueFileIdentifier = uniqueIdentifier,
                    SystemID = uploadRequest.SystemId,
                    FileType = fileTypeString,
                    FileCategory = uploadRequest.Category,
                    AddedDate = DateTime.Now,
                    AddedTime = DateTime.Now,
                    IsDeleted = 0
                };

                fileRecords.Add(fileRecord);
            }

            _uploadBl.SaveFileRecords(fileRecords);
            return Ok(new
            {
                message = $"{fileRecords.Count} files uploaded successfully",
                files = fileRecords.Select(f => f.FileName)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Upload failed: {ex.Message}");
        }
    }
    private string GenerateUniqueIdentifier()
    {
        return Guid.NewGuid().ToString();
    }
    private string DetermineFileType(string fileExtension)
    {
        if (new[] { ".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx" }.Contains(fileExtension))
        {
            return "Document";
        }
        else if (new[] { ".mp4", ".avi", ".mov", ".wmv", ".mkv" }.Contains(fileExtension))
        {
            return "Video";
        }

        throw new ArgumentException("Unsupported file type");
    }

    private bool IsIdentifierExists(string uniqueIdentifier)
    {
        using (var connection = new OracleConnection(_configuration.GetConnectionString("DefaultConnection")))
        {
            connection.Open();
            var query = "SELECT COUNT(*) FROM Files WHERE UniqueFileIdentifier = :identifier";
            using (var command = new OracleCommand(query, connection))
            {
                command.Parameters.Add(new OracleParameter("identifier", uniqueIdentifier));
                var count = Convert.ToInt32(command.ExecuteScalar());
                return count > 0;
            }
        }
    }
    public class UploadRequest
    {
        public int SystemId { get; set; }
        public string Category { get; set; }
        public List<IFormFile> Files { get; set; }
    }

    [HttpGet]
    public IActionResult GetAllFiles()
    {
        var files = _uploadBl.GetAllFiles();
        return Json(files);
    }
}