using System;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using AeroVault.Models;
using Microsoft.AspNetCore.Authentication;
using SLA_Authentication_DLL;

namespace AeroVault.Business
{
    public class LoginBL
    {
        private readonly LoginDL _loginDl;

        // Add constructor to inject LoginDL with IConfiguration
        public LoginBL(LoginDL loginDl)
        {
            _loginDl = loginDl;
        }

        public bool GetLoginValidation(StaffML staffMl, IHttpContextAccessor httpContextAccessor)
        {
            bool isValid = IsValid(staffMl.StaffNo, staffMl.StaffPassword);

            if (isValid)
            {
                httpContextAccessor.HttpContext.Session.SetString("StaffNo", staffMl.StaffNo);
            }

            return isValid;
        }

        public bool IsValid(string StaffNo, string Password)
        {
            try
            {
                using (PrincipalContext context = new PrincipalContext(ContextType.Domain, "srilankan.corp"))
                {
                    return context.ValidateCredentials(StaffNo, Password);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Authentication error: {ex.Message}");
                return false;
            }
        }

        public StaffML GetRole(StaffML staffMl)
        {
            var staff = new StaffML();

            try
            {
                // Replace clsRole with actual role retrieval method
                var df = _loginDl.GetPermissionRoles(staffMl);

                if (df)
                {
                    staff.UserRole = "ALTS-Staff";
                }
                else
                {
                    staff.UserRole = "Unauthorized";
                }
            }
            catch (Exception)
            {
                staff.UserRole = "Unauthorized";
            }

            return staff;
        }

        public StaffML GetNameAndEmail(StaffML staffNo)
        {
            StaffML emailMl = new StaffML();

            string staffno = staffNo.ToString()
;
            try
            {
                var updateDe = new DirectoryEntry();
                var dirSearcher = new DirectorySearcher(updateDe)
                {
                    Filter = "(&(objectCategory=Person)(objectClass=user)(SAMAccountName=" + staffNo.StaffNo + "))",
                    SearchScope = SearchScope.Subtree
                };
                var searchResults = dirSearcher.FindOne();

                if (searchResults?.GetDirectoryEntry().Properties["displayName"].Value != null)
                {
                    emailMl.StaffName = searchResults.GetDirectoryEntry().Properties["displayName"].Value.ToString();
                }

                if (searchResults?.GetDirectoryEntry().Properties["mail"].Value != null)
                {
                    emailMl.EmailAddress = searchResults.GetDirectoryEntry().Properties["mail"].Value.ToString();
                }

                return emailMl;

            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}