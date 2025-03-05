using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using Microsoft.AspNetCore.Authorization;

namespace AeroVault.Controllers
{
    [AuthorizeUser]
    public class UserOverview : Controller
    {
        private readonly UserOverviewBl _userOverviewBl;
        private readonly string _connectionString;

        public UserOverview(UserOverviewBl userOverviewBl, IConfiguration configuration)
        {
            _userOverviewBl = userOverviewBl;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public IActionResult UserPageOverview()
        {
            // Check if the user is an admin
            if (HttpContext.Session.GetString("User Role") == "AEVT-Admin")
            {
                TempData["AccessDeniedMessage"] = "Access not given"; // Set the message
                return RedirectToAction("Index", "Admin"); // Redirect to Admin Index
            }

            try
            {
                string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department";

                bool isActive = _userOverviewBl.IsDepartmentActive(userDepartment);
                ViewBag.IsDepartmentActive = isActive;

                List<string> systems = new List<string>();
                if (isActive)
                {
                    systems = _userOverviewBl.GetSystemsByDepartment(userDepartment);

                    var (systemCount, documentCount, videoCount) = _userOverviewBl.GetDepartmentCounts(userDepartment);
                    ViewBag.SystemCount = systemCount;
                    ViewBag.DocumentCount = documentCount;
                    ViewBag.VideoCount = videoCount;

                    var recentFiles = _userOverviewBl.GetRecentFilesByDepartment(userDepartment);
                    ViewBag.RecentFiles = recentFiles;
                }

                ViewBag.Systems = systems;

                // Check if the staff record has already been inserted in this session
                if (HttpContext.Session.GetString("StaffRecordInserted") == null)
                {
                    InsertStaffRecord();
                    // Set session variable to indicate the record has been inserted
                    HttpContext.Session.SetString("StaffRecordInserted", "true");
                }

                return View("~/Views/User/UserOverview/UserPageOverview.cshtml");
            }
            catch (Exception ex)
            {
                return View("Error");
            }
        }

        private void InsertStaffRecord()
        {
            string staffNo = HttpContext.Session.GetString("StaffNo") ?? "Unknown";
            string staffName = HttpContext.Session.GetString("StaffName") ?? "Unknown";

            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                string query = @"
                    INSERT INTO Staff (StaffNo, StaffName)
                    VALUES (:StaffNo, :StaffName)";

                using (OracleCommand command = new OracleCommand(query, connection))
                {
                    command.Parameters.Add(":StaffNo", OracleDbType.Varchar2).Value = staffNo;
                    command.Parameters.Add(":StaffName", OracleDbType.Varchar2).Value = staffName;
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}