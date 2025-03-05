using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;
using AeroVault.Data;

namespace AeroVault.Controllers
{
    [AuthorizeUser]
    public class UserFileRepository : Controller
    {
        private readonly FileRepositoryBl _fileRepositoryBl;

        public UserFileRepository(FileRepositoryBl fileRepositoryBl)
        {
            _fileRepositoryBl = fileRepositoryBl;
        }

        public IActionResult FileRepository()
        {

            // Check if the user is an admin
            if (HttpContext.Session.GetString("User Role") == "AEVT-Admin")
            {
                TempData["AccessDeniedMessage"] = "Access not given"; // Set the message
                return RedirectToAction("Index", "Admin"); // Redirect to Admin Index
            }

            // Retrieve the logged-in staff's department from the session
            string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department";

            // Fetch the department ID based on the department name
            var departments = _fileRepositoryBl.GetDepartments();
            var selectedDepartment = departments.FirstOrDefault(d => d.DepartmentName == userDepartment);

            // Fetch systems for the selected department
            List<SystemModel> systems = new List<SystemModel>();
            if (selectedDepartment != null)
            {
                systems = _fileRepositoryBl.GetNonDeletedSystemsByDepartment(selectedDepartment.DepartmentID);
            }

            // Pass the departments and systems to the view
            ViewBag.Departments = departments;
            ViewBag.Systems = systems; // Pass the systems to the view

            return View("~/Views/User/UserFileRepository/FileRepository.cshtml");
        }

        [HttpGet]
        public IActionResult GetSystemsByDepartment(int departmentId)
        {
            var systems = _fileRepositoryBl.GetNonDeletedSystemsByDepartment(departmentId);
            return Json(systems); 
        }

        [HttpGet]
        public IActionResult GetDocumentsBySystem(int systemId)
        {
            var documents = _fileRepositoryBl.GetDocumentsBySystem(systemId);
            return Json(documents);
        }

        [HttpGet]
        public IActionResult GetVideosBySystem(int systemId)
        {
            var videos = _fileRepositoryBl.GetVideosBySystem(systemId);
            return Json(videos);
        }


        [HttpGet]
        public IActionResult FindFile(string fileName, string uniqueIdentifier = null)
        {
            try
            {
                var basePath = _fileRepositoryBl.GetBasePath(); // Get the base path
                var supportedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
            ".mp4", ".avi", ".mov", ".wmv", ".mkv"
        };

                // Log the base path
                Console.WriteLine($"Base Path: {basePath}");

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
                    Console.WriteLine($"Checking exact match: {exactMatchPath}"); // Log the path
                    if (System.IO.File.Exists(exactMatchPath))
                    {
                        return Json(new { foundFileName = fileName });
                    }

                    // Then try with extension
                    var fullPathWithExt = Path.Combine(basePath, fileNameWithoutExtension + ext);
                    Console.WriteLine($"Checking with extension: {fullPathWithExt}"); // Log the path
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
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while searching for the file");
            }
        }

        [HttpGet]
        public IActionResult ViewFile(string fileName)
        {
            try
            {
                var basePath = _fileRepositoryBl.GetBasePath(); // Get the base path
                var fullPath = Path.Combine(basePath, fileName); // Construct the full path

                // Log the full path for debugging
                Console.WriteLine($"Attempting to view file at: {fullPath}");

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound($"File {fileName} not found");
                }

                var contentType = GetContentType(fileName); // Ensure you have a method to get the content type

                // Serve the file as inline
                Response.Headers.Add("Content-Disposition", "inline; filename=" + fileName);
                return PhysicalFile(fullPath, contentType);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while trying to view the file");
            }
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
    }
}