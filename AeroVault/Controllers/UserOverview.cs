using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;

namespace AeroVault.Controllers
{
    public class UserOverview : Controller
    {
        private readonly UserOverviewBl _userOverviewBl;

        public UserOverview(UserOverviewBl userOverviewBl)
        {
            _userOverviewBl = userOverviewBl;
        }

        public IActionResult UserPageOverview()
        {
            try
            {
                // Retrieve the department from the session
                string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department"; 

                // Check if the department is active
                bool isActive = _userOverviewBl.IsDepartmentActive(userDepartment);
                ViewBag.IsDepartmentActive = isActive;

                List<string> systems = new List<string>();
                if (isActive)
                {
                    // Get systems for the specific department
                    systems = _userOverviewBl.GetSystemsByDepartment(userDepartment);

                    // Get department counts
                    var (systemCount, documentCount, videoCount) = _userOverviewBl.GetDepartmentCounts(userDepartment);
                    ViewBag.SystemCount = systemCount;
                    ViewBag.DocumentCount = documentCount;
                    ViewBag.VideoCount = videoCount;

                    // Get recent files for the department
                    var recentFiles = _userOverviewBl.GetRecentFilesByDepartment(userDepartment);
                    ViewBag.RecentFiles = recentFiles;
                }

                // Pass systems to the view
                ViewBag.Systems = systems;

                return View("~/Views/User/UserOverview/UserPageOverview.cshtml");
            }
            catch (Exception ex)
            {
                // Log the exception
                return View("Error");
            }
        }
    }
}