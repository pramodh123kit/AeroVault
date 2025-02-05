using Microsoft.AspNetCore.Mvc;
using System.DirectoryServices.AccountManagement;
using AeroVault.Business;
using AeroVault.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication;

namespace AeroVault.Controllers
{
    public class DiagnosticsController : Controller
    {
        private readonly LoginBl _loginBl;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<DiagnosticsController> _logger;

        public DiagnosticsController(
            LoginBl loginBl,
            IHttpContextAccessor httpContextAccessor,
            ILogger<DiagnosticsController> logger)
        {
            _loginBl = loginBl;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public IActionResult TestAPPSECConnection()
        {
            var connectionResults = new List<string>();

            try
            {
                using (PrincipalContext context = new PrincipalContext(ContextType.Domain, "srilankan.corp"))
                {
                    connectionResults.Add("✅ LDAP Domain Connection: Successful");
                }
            }
            catch (Exception ex)
            {
                connectionResults.Add($"❌ LDAP Domain Connection Failed: {ex.Message}");
                _logger.LogError(ex, "LDAP Connection Test Failed");
            }

            try
            {
                var testStaff = new StaffML
                {
                    StaffNo = "",     
                    StaffPassword = ""  
                };

                //bool isValidLogin = _loginBl.GetLoginValidation(testStaff, _httpContextAccessor);

                //if (isValidLogin)
                //{
                //    connectionResults.Add("✅ APPSEC Authentication: Successful");

                //    var userDetails = _loginBl.GetNameAndEmail(testStaff);
                //    if (userDetails != null)
                //    {
                //        connectionResults.Add($"👤 User Name: {userDetails.StaffName}");
                //        connectionResults.Add($"📧 Email: {userDetails.EmailAddress}");
                //    }
                //}
                //else
                //{
                //    connectionResults.Add("❌ APPSEC Authentication: Failed");
                //}
            }
            catch (Exception ex)
            {
                connectionResults.Add($"❌ Authentication Test Failed: {ex.Message}");
                _logger.LogError(ex, "APPSEC Authentication Test Failed");
            }

            ViewBag.ConnectionResults = connectionResults;
            return View();
        }
    }
}