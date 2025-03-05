using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AeroVault.Models;
using AeroVault.Business;
using Microsoft.AspNetCore.Http;

namespace AeroVault.Controllers
{
    public class LoginController : Controller
    {
        private readonly LoginBl _loginBl;
        private readonly ILogger<LoginController> _logger;

        public LoginController(LoginBl loginBl, ILogger<LoginController> logger)
        {
            _loginBl = loginBl;
            _logger = logger;
        }

        public IActionResult Index()
        {
            HttpContext.Session.Clear();
            return View("LoginPage");
        }

        [HttpPost]
        public IActionResult Authenticate(string staffNo, string password)
        {
            if (string.IsNullOrEmpty(staffNo) || string.IsNullOrEmpty(password))
            {
                TempData["ErrorMessage"] = "Username and password are required.";
                return View("LoginPage");
            }

            try
            {
                var staffMl = new StaffML { StaffNo = staffNo, StaffPassword = password };

                if (!_loginBl.GetLoginValidation(staffMl))
                {
                    TempData["ErrorMessage"] = "Invalid credentials.";
                    return View("LoginPage");
                }

                var userRole = _loginBl.GetRole(staffMl).GetAwaiter().GetResult();

                if (!IsAuthorized(userRole.UserRole))
                {
                    TempData["ErrorMessage"] = $"Unauthorized role: {userRole.UserRole}";
                    return View("LoginPage");
                }

                SetUserSession(staffMl, userRole);

                // Redirect based on role
                if (userRole.UserRole == "AEVT-Admin")
                {
                    return RedirectToAction("Index", "Admin");
                }
                else if (userRole.UserRole == "AEVT-Staff")
                {
                    return RedirectToAction("UserPageOverview", "UserOverview"); // Ensure this matches the action name
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Authentication error");
                TempData["ErrorMessage"] = $"Error: {ex.Message}";
                return View("LoginPage");
            }

            // If none of the above conditions are met, return to the login page
            return View("LoginPage");
        }
        private bool IsAuthorized(string role)
        {
            return role == "AEVT-Admin" || role == "AEVT-Staff";
        }

        private void SetUserSession(StaffML staff, StaffML role)
        {
            HttpContext.Session.SetString("StaffNo", staff.StaffNo);
            HttpContext.Session.SetString("User Role", role.UserRole); // Ensure this is set correctly

            var userDetails = _loginBl.GetNameAndEmail(staff);
            if (userDetails != null)
            {
                HttpContext.Session.SetString("StaffName", userDetails.StaffName ?? "");
                HttpContext.Session.SetString("EmailAddress", userDetails.EmailAddress ?? "");
            }
        }

        public IActionResult Logout()
        {
            _logger.LogInformation($"User logged out: {HttpContext.Session.GetString("StaffNo")}");
            HttpContext.Session.Clear();
            return RedirectToAction("Index");
        }
    }
}