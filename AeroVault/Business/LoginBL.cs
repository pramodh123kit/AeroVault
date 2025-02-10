﻿using System;
using System.DirectoryServices;
using Microsoft.Extensions.Configuration;
using SLA_Authentication_DLL;
using AeroVault.Models;
using Microsoft.AspNetCore.Http;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Net;
using System.Security.Authentication;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace AeroVault.Business
{
    public class LoginBL
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
       // clsRole _role = new clsRole();


        public LoginBL(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;

            var connectionString = configuration.GetConnectionString("SLA_AUTH_ConnectionString");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new Exception("SLA_AUTH_ConnectionString is not configured properly.");
            }

           
        }




        public bool GetLoginValidation(StaffML staffMl)
        {
            bool isValid = IsValid(staffMl.StaffNo, staffMl.StaffPassword);

            if (isValid)
            {
               
                _httpContextAccessor.HttpContext.Session.SetString("StaffNo", staffMl.StaffNo);
            }

            return isValid;
        }

        public bool IsValid(string StaffNo, string Password)
        {
            try
            {
                var adDomain = _configuration["AppSettings:ADDomain"];

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

        //public StaffML GetRole(StaffML staffMl)
        //{
        //    var staff = new StaffML();
        //   // var role = new clsRole();

        //    var dt = _role.getUserRolesforApplication(staffMl.StaffNo, "AEVT");

        //    if (dt != null && dt.Rows.Count > 0)
        //    {
        //        staff.UserRole = "AEVT-Admin";
        //    }
        //    else
        //    {
        //        staff.UserRole = "AEVT-Staff";
        //    }

        //    return staff;
        //}


        public static readonly HttpClient client = new HttpClient();

        public async Task<StaffML> GetRole(StaffML staffMl)
        {
            try
            {
                string url = _configuration["AppSecSettings:AppSecService"].ToString();
                string AppID = _configuration["AppSecSettings:AppId"].ToString();
                var requestData = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("USERNAME",staffMl.StaffNo ),
                new KeyValuePair<string, string>("PASSWORD", staffMl.StaffPassword),
                new KeyValuePair<string, string>("APPSECAPPID", AppID)
            };

                var content = new FormUrlEncodedContent(requestData);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

                HttpResponseMessage response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {

                    staffMl.UserRole = "AEVT-Admin";

                    return staffMl;
                }
                else
                {
                    staffMl.UserRole = "AEVT-Staff";
                    
                    return staffMl;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
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