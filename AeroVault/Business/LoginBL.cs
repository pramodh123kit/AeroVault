using System;
using System.DirectoryServices;
using Microsoft.Extensions.Configuration;
using SLA_Authentication_DLL;
using AeroVault.Models;
using Microsoft.AspNetCore.Http;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace AeroVault.Business
{
    public class LoginBl
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoginBl(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public bool GetLoginValidation(StaffML staffMl)
        {
            bool isValid = IsValid(staffMl.StaffNo, staffMl.StaffPassword);

            if (isValid)
            {
                // Use HttpContextAccessor to set session
                _httpContextAccessor.HttpContext.Session.SetString("StaffNo", staffMl.StaffNo);
            }

            return isValid;
        }

        public bool IsValid(string StaffNo, string Password)
        {
            try
            {
                var adDomain = _configuration["AppSettings:ADDomain"];

                // Add more detailed logging
                Console.WriteLine($"Attempting AD authentication for user: {StaffNo}");
                Console.WriteLine($"AD Domain: {adDomain}");

                var entry = new DirectoryEntry(adDomain, StaffNo, Password, AuthenticationTypes.Secure);
                try
                {
                    var obj = entry.NativeObject;
                    var search = new DirectorySearcher(entry)
                    {
                        Filter = "(SAMAccountName=" + StaffNo + ")"
                    };
                    search.PropertiesToLoad.Add("cn");
                    var result = search.FindOne();

                    if (result != null)
                    {
                        Console.WriteLine($"User {StaffNo} authenticated successfully");
                        return true;
                    }
                    else
                    {
                        Console.WriteLine($"User {StaffNo} authentication failed: No user found");
                        return false;
                    }
                }

                catch (Exception searchEx)
                {
                    Console.WriteLine($"Error during AD search for {StaffNo}: {searchEx}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Full authentication error for {StaffNo}: {ex}");
                return false;
            }
        }

        public StaffML GetRole(StaffML staffMl)
        {
            var staff = new StaffML();
            var role = new clsRole();

            var dt = role.getUserRolesforApplication(staffMl.StaffNo, "AEVT");

            if (dt != null && dt.Rows.Count > 0)
            {
                staff.UserRole = "AEVT-Admin";
            }
            else
            {
                staff.UserRole = "AEVT-Staff";
            }

            return staff;
        }

        public StaffML GetNameAndEmail(StaffML staffNo)
        {
            StaffML emailMl = new StaffML();

            try
            {
                var updateDe = new DirectoryEntry();
                var dirSearcher = new DirectorySearcher(updateDe)
                {
                    Filter = "(&(objectCategory=Person)(objectClass=user)(SAMAccountName=" + staffNo.StaffNo + "))",
                    SearchScope = SearchScope.Subtree
                };
                var searchResults = dirSearcher.FindOne();

                if (searchResults != null)
                {
                    var directoryEntry = searchResults.GetDirectoryEntry();
                    if (directoryEntry.Properties["displayName"].Value != null)
                    {
                        emailMl.StaffName = directoryEntry.Properties["displayName"].Value.ToString();
                    }

                    if (directoryEntry.Properties["mail"].Value != null)
                    {
                        emailMl.EmailAddress = directoryEntry.Properties["mail"].Value.ToString();
                    }
                }
                else
                {
                    Console.WriteLine($"No results found for {staffNo.StaffNo}");
                }

                return emailMl;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving name and email: {ex}");
                return null;
            }
        }
    }
}