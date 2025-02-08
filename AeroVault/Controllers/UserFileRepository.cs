using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;
using AeroVault.Data;

namespace AeroVault.Controllers
{

    public class UserFileRepository : Controller
    {
        private readonly FileRepositoryBl _fileRepositoryBl;

        public UserFileRepository(FileRepositoryBl fileRepositoryBl)
        {
            _fileRepositoryBl = fileRepositoryBl;
        }

        public IActionResult FileRepository()
        {
            var departments = _fileRepositoryBl.GetDepartments();
            ViewBag.Departments = departments; 
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
    }
}