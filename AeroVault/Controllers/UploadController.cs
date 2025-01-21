using AeroVault.Business;
using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;

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
                return NotFound($"File {fileName} not found");
            }

            // Determine content type
            var contentType = GetContentType(fileName);

            // Validate file type
            var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt" };
            var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Unsupported file type");
            }

            // For PDFs and supported document types, we want to render in the browser
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

        var renderableTypes = new[] { ".pdf", ".txt", ".doc", ".docx", ".xls", ".xlsx" };

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

            _ => "application/octet-stream"

        };

    }

    [HttpGet]
    public IActionResult FindFile(string fileName)
    {
        try
        {
            // Get base path from configuration
            var basePath = _configuration["FileSettings:BasePath"];

            // Supported extensions
            var supportedExtensions = new[] { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt" };

            // Try to find the file with different extensions
            foreach (var ext in supportedExtensions)
            {
                var fullPath = Path.Combine(basePath, fileName + ext);

                if (System.IO.File.Exists(fullPath))
                {
                    return Json(new { foundFileName = fileName + ext });
                }
            }

            // If no file found
            return Json(new { foundFileName = (string)null });
        }
        catch (Exception ex)
        {
            // Log the exception
            //_logger.LogError(ex, $"Error finding file: {fileName}");
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

                // Use the original filename without modification
                var fileName = file.FileName;
                var filePath = Path.Combine(basePath, fileName);

                // Ensure directory exists
                Directory.CreateDirectory(basePath);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Determine the file type based on the file extension
                var fileType = Path.GetExtension(fileName).ToLowerInvariant();
                string fileTypeString;

                if (fileType == ".pdf" || fileType == ".doc" || fileType == ".docx" ||
                    fileType == ".txt" || fileType == ".xls" || fileType == ".xlsx")
                {
                    fileTypeString = "Document";
                }
                else if (fileType == ".mp4" || fileType == ".avi" || fileType == ".mov" ||
                         fileType == ".wmv" || fileType == ".mkv")
                {
                    fileTypeString = "Video";
                }
                else
                {
                    return BadRequest("Unsupported file type. Only documents and videos are allowed.");
                }

                // Create file record
                var fileRecord = new FileModel
                {
                    FileName = fileName,
                    SystemID = uploadRequest.SystemId,
                    FileType = fileTypeString, // Set the determined file type
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

    public class UploadRequest

    {

        public int SystemId { get; set; }

        public string Category { get; set; }

        public List<IFormFile> Files { get; set; }

    }
}