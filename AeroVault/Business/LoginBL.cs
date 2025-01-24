using System;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using AeroVault.Models;
using Microsoft.AspNetCore.Authentication;

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
            try
            {
                using (PrincipalContext context = new PrincipalContext(ContextType.Domain, "srilankan.corp"))
                {
                    UserPrincipal user = UserPrincipal.FindByIdentity(context, staffNo.StaffNo);

                    if (user != null)
                    {
                        return new StaffML
                        {
                            StaffName = user.DisplayName,
                            EmailAddress = user.EmailAddress,
                            StaffNo = user.SamAccountName
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving user details: {ex.Message}");
            }

            return null;
        }
    }
}