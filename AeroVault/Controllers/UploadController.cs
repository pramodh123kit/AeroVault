using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using Oracle.ManagedDataAccess.Client;

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
            Files = _uploadBl.GetAllFiles() ?? new List<FileModel>() // Ensure it's never null
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
            // Get base path from configuration
            var basePath = _configuration["FileSettings:BasePath"];

            // Construct full file path
            var fullPath = Path.Combine(basePath, fileName);

            // Check if file exists
            if (!System.IO.File.Exists(fullPath))
            {
                // Try finding the file with different potential naming
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

                // If still not found
                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound($"File {fileName} not found");
                }
            }

            // Determine content type
            var contentType = GetContentType(fileName);

            // Validate file type
            var allowedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
            ".mp4", ".avi", ".mov", ".wmv", ".mkv"
        };
            var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Unsupported file type");
            }

            // For PDFs, documents, and videos, we want to render in the browser
            if (IsBrowserRenderableType(fileExtension))
            {
                return File(System.IO.File.OpenRead(fullPath), contentType);
            }

            // For other file types, return as attachment
            return PhysicalFile(fullPath, contentType, fileName);
        }
        catch (Exception ex)
        {
            // Log the exception
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

    // Helper method to determine content type

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

            // If unique identifier is provided, use it directly
            if (!string.IsNullOrEmpty(uniqueIdentifier))
            {
                var matchingFiles = Directory.GetFiles(basePath, $"*_{uniqueIdentifier}.*")
                    .ToList();

                if (matchingFiles.Any())
                {
                    return Json(new { foundFileName = Path.GetFileName(matchingFiles.First()) });
                }
            }

            // If no unique identifier or no match, try finding by original filename
            var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);

            foreach (var ext in supportedExtensions)
            {
                // Try exact match first
                var exactMatchPath = Path.Combine(basePath, fileName);
                if (System.IO.File.Exists(exactMatchPath))
                {
                    return Json(new { foundFileName = fileName });
                }

                // Then try with extension
                var fullPathWithExt = Path.Combine(basePath, fileNameWithoutExtension + ext);
                if (System.IO.File.Exists(fullPathWithExt))
                {
                    return Json(new { foundFileName = fileNameWithoutExtension + ext });
                }
            }

            // If no file found
            return Json(new { foundFileName = (string)null });
        }
        catch (Exception ex)
        {
            // Log the exception
            return StatusCode(500, "An error occurred while searching for the file");
        }
    }


    [HttpPost]

    public async Task<IActionResult> UploadFiles([FromForm] UploadRequest uploadRequest)

    {

        try

        {

            // Validate input

            if (uploadRequest.Files == null || uploadRequest.Files.Count == 0)

            {

                return BadRequest("No files uploaded");

            }


            // Get base upload path from configuration

            var basePath = _configuration["FileSettings:BasePath"];


            // Prepare to store uploaded files and file records

            var fileRecords = new List<FileModel>();


            foreach (var file in uploadRequest.Files)

            {

                if (file.Length == 0) continue;


                // Generate a unique identifier

                string uniqueIdentifier;

                do

                {

                    uniqueIdentifier = GenerateUniqueIdentifier();

                } while (IsIdentifierExists(uniqueIdentifier));


                // Get original filename details

                var originalFileName = file.FileName;

                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);

                var fileExtension = Path.GetExtension(originalFileName);


                // Create unique filename

                var uniqueFileName = $"{fileNameWithoutExtension}_{uniqueIdentifier}{fileExtension}";


                var filePath = Path.Combine(basePath, uniqueFileName);


                // Ensure directory exists

                Directory.CreateDirectory(basePath);


                // Save file to disk

                using (var stream = new FileStream(filePath, FileMode.Create))

                {

                    await file.CopyToAsync(stream);

                }


                // Determine the file type based on the file extension

                var fileType = fileExtension.ToLowerInvariant();

                string fileTypeString = DetermineFileType(fileType);


                // Create file record

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


                // Save file record to database

                fileRecords.Add(fileRecord);

            }


            // Use your data layer to insert file records

            _uploadBl.SaveFileRecords(fileRecords);


            return Ok(new

            {

                message = $"{fileRecords.Count} files uploaded successfully",

                files = fileRecords.Select(f => f.FileName)

            });

        }

        catch (Exception ex)

        {

            // Log the exception

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