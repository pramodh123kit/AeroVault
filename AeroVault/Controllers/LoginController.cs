using Microsoft.AspNetCore.Mvc;
using AeroVault.Models;
using AeroVault.Business;
using Microsoft.AspNetCore.Http;

namespace AeroVault.Controllers
{
    public class LoginController : Controller
    {
        private readonly LoginBL _loginBl;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoginController(LoginBL loginBl, IHttpContextAccessor httpContextAccessor)
        {
            _loginBl = loginBl;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View("LoginPage");
        }

        [HttpPost]
        public IActionResult Authenticate(string staffNo, string password)
        {
            if (string.IsNullOrEmpty(staffNo) || string.IsNullOrEmpty(password))
            {
                ModelState.AddModelError("", "Username and password are required.");
                return View("LoginPage");
            }

            var staffMl = new StaffML
            {
                StaffNo = staffNo,
                StaffPassword = password
            };

            bool isValidLogin = _loginBl.GetLoginValidation(staffMl, _httpContextAccessor);

            if (isValidLogin)
            {
                // Get user role and additional details
                var userRole = _loginBl.GetRole(staffMl);
                var userDetails = _loginBl.GetNameAndEmail(staffMl);

                // Store additional user information in session
                _httpContextAccessor.HttpContext.Session.SetString("UserRole", userRole.UserRole);

                if (userDetails != null)
                {
                    _httpContextAccessor.HttpContext.Session.SetString("StaffName", userDetails.StaffName ?? "");
                    _httpContextAccessor.HttpContext.Session.SetString("EmailAddress", userDetails.EmailAddress ?? "");
                }

                // Redirect based on user role
                switch (userRole.UserRole)
                {
                    case "ALTS-Staff":
                        return RedirectToAction("Index", "Admin");
                    case "Unauthorized":
                        ModelState.AddModelError("", "You are not authorized to access this system.");
                        return View("LoginPage");
                    default:
                        return RedirectToAction("Index", "Home");
                }
            }

            ModelState.AddModelError("", "Invalid login attempt");
            return View("LoginPage");
        }

        public IActionResult Logout()
        {
            // Clear session
            HttpContext.Session.Clear();
            return RedirectToAction("Index");
        }
    }
}