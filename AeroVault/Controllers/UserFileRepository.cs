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
            if (HttpContext.Session.GetString("User Role") == "AEVT-Admin")
            {
                TempData["AccessDeniedMessage"] = "Access not given"; 
                return RedirectToAction("Index", "Admin"); 
            }

            string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department";

            var departments = _fileRepositoryBl.GetDepartments();
            var selectedDepartment = departments.FirstOrDefault(d => d.DepartmentName == userDepartment);

            List<SystemModel> systems = new List<SystemModel>();
            if (selectedDepartment != null)
            {
                systems = _fileRepositoryBl.GetNonDeletedSystemsByDepartment(selectedDepartment.DepartmentID);
            }

            ViewBag.Departments = departments;
            ViewBag.Systems = systems; 
            ViewBag.DepartmentID = selectedDepartment?.DepartmentID; 

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
                var basePath = _fileRepositoryBl.GetBasePath(); 
                var supportedExtensions = new[] {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt",
            ".mp4", ".avi", ".mov", ".wmv", ".mkv"
        };

                Console.WriteLine($"Base Path: {basePath}");

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
                    Console.WriteLine($"Checking exact match: {exactMatchPath}"); 
                    if (System.IO.File.Exists(exactMatchPath))
                    {
                        return Json(new { foundFileName = fileName });
                    }

                    var fullPathWithExt = Path.Combine(basePath, fileNameWithoutExtension + ext);
                    Console.WriteLine($"Checking with extension: {fullPathWithExt}"); 
                    if (System.IO.File.Exists(fullPathWithExt))
                    {
                        return Json(new { foundFileName = fileNameWithoutExtension + ext });
                    }
                }

                return Json(new { foundFileName = (string)null });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while searching for the file");
            }
        }

        [HttpGet]
        public IActionResult ViewFile(string fileName)
        {
            try
            {
                var basePath = _fileRepositoryBl.GetBasePath(); 
                var fullPath = Path.Combine(basePath, fileName); 

                Console.WriteLine($"Attempting to view file at: {fullPath}");

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound($"File {fileName} not found");
                }

                var contentType = GetContentType(fileName); 

                Response.Headers.Add("Content-Disposition", "inline; filename=" + fileName);
                return PhysicalFile(fullPath, contentType);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while trying to view the file");
            }
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
        public IActionResult CheckSystemBelongsToDepartment(int systemId)
        {
            string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department";

            var departments = _fileRepositoryBl.GetDepartments();
            var selectedDepartment = departments.FirstOrDefault(d => d.DepartmentName == userDepartment);

            if (selectedDepartment != null)
            {
                var systemDepartments = _fileRepositoryBl.GetSystemDepartmentsBySystemId(systemId);
                bool belongsToDepartment = systemDepartments.Any(sd => sd.DepartmentID == selectedDepartment.DepartmentID);

                return Json(new { belongsToDepartment });
            }

            return Json(new { belongsToDepartment = false });
        }

        [HttpPost]
        public IActionResult RecordFileView([FromBody] RecordFileViewRequest request)
        {
            try
            {
                _fileRepositoryBl.RecordFileView(request.StaffNo, request.UniqueIdentifier);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        public class RecordFileViewRequest
        {
            public string StaffNo { get; set; }
            public string UniqueIdentifier { get; set; }
        }

        [HttpGet]
        public IActionResult CheckFileViewed(string staffNo, string uniqueIdentifier)
        {
            try
            {
                bool viewed = _fileRepositoryBl.CheckFileViewed(staffNo, uniqueIdentifier);
                return Json(new { viewed });
            }
            catch (Exception ex)
            {
                return Json(new { viewed = false, error = ex.Message });
            }
        }
    }
}