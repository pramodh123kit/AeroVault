using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;

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
            // Fetch active departments
            List<DepartmentModel> departments = _fileRepositoryBl.GetActiveDepartments();

            // Get systems for the first department (or default)
            List<SystemModel> systems = departments.Any()
                ? _fileRepositoryBl.GetSystemsByDepartment(departments.First().DepartmentID)
                : new List<SystemModel>();

            // Pass departments and systems to the view
            ViewBag.Departments = departments;
            ViewBag.Systems = systems;

            return View("~/Views/User/UserFileRepository/FileRepository.cshtml");
        }

        [HttpGet]
        public IActionResult GetSystemsByDepartment(int departmentId)
        {
            var systems = _fileRepositoryBl.GetSystemsByDepartment(departmentId);
            return Json(systems);
        }


        [HttpGet]
        public IActionResult GetFilesBySystem(int systemId)
        {
            var files = _fileRepositoryBl.GetFilesBySystem(systemId);
            return Json(files);
        }
    }

}