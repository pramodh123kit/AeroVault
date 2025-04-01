using Microsoft.AspNetCore.Mvc;
using AeroVault.Business;
using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using Microsoft.AspNetCore.Authorization;
using System;

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
            if (HttpContext.Session.GetString("User Role") == "AEVT-Admin")
            {
                TempData["AccessDeniedMessage"] = "Access not given";
                return RedirectToAction("Index", "Admin");
            }

            try
            {
                string userDepartment = HttpContext.Session.GetString("Department") ?? "No Department";

                string staffNo = HttpContext.Session.GetString("StaffNo");


                // Get the count of viewed files

                int viewedFileCountByDepartment = _userOverviewBl.GetViewedFileCountByDepartment(staffNo, userDepartment);

                ViewBag.ViewedFileCountByDepartment = viewedFileCountByDepartment;


                // Get the total count of non-deleted files in the user's department

                int totalFilesCount = _userOverviewBl.GetTotalFilesCountByDepartment(userDepartment);

                ViewBag.TotalFilesCount = totalFilesCount;


                // Calculate the pending file count

                int pendingFileCount = totalFilesCount - viewedFileCountByDepartment;

                ViewBag.PendingFileCount = pendingFileCount;


                // Log the counts

                Console.WriteLine($"Total Files Count: {totalFilesCount}");

                Console.WriteLine($"Pending Files Count: {pendingFileCount}");


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

                if (HttpContext.Session.GetString("StaffRecordInserted") == null)
                {
                    InsertStaffRecord();
                    HttpContext.Session.SetString("StaffRecordInserted", "true");
                }

                return View("~/Views/User/UserOverview/UserPageOverview.cshtml");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return View("Error");
            }
        }

        private void InsertStaffRecord()
        {
            string staffNo = HttpContext.Session.GetString("StaffNo") ?? "Unknown";
            string staffName = HttpContext.Session.GetString("StaffName") ?? "Unknown";
            string email = HttpContext.Session.GetString("Email") ?? "No Email";
            string department = HttpContext.Session.GetString("Department") ?? "No Department";
            string jobTitle = HttpContext.Session.GetString("JobTitle") ?? "No Job Title";

            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                string query = @"
            INSERT INTO Staff (StaffNo, StaffName, Email, Department, JobTitle)
            VALUES (:StaffNo, :StaffName, :Email, :Department, :JobTitle)";

                using (OracleCommand command = new OracleCommand(query, connection))
                {
                    command.Parameters.Add(":StaffNo", OracleDbType.Varchar2).Value = staffNo;
                    command.Parameters.Add(":StaffName", OracleDbType.Varchar2).Value = staffName;
                    command.Parameters.Add(":Email", OracleDbType.Varchar2).Value = email;
                    command.Parameters.Add(":Department", OracleDbType.Varchar2).Value = department;
                    command.Parameters.Add(":JobTitle", OracleDbType.Varchar2).Value = jobTitle;
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}