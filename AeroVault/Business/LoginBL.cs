using System;
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
using Newtonsoft.Json.Linq;

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
                        Filter = $"(SAMAccountName={StaffNo})"
                    };
                    search.PropertiesToLoad.Add("cn");
                    search.PropertiesToLoad.Add("displayName");
                    search.PropertiesToLoad.Add("department");
                    search.PropertiesToLoad.Add("mail");
                    search.PropertiesToLoad.Add("title");
                    var result = search.FindOne();

                    if (result != null)
                    {
                        Console.WriteLine($"User    {StaffNo} authenticated successfully");

                        var directoryEntry = result.GetDirectoryEntry();
                        string staffName = directoryEntry.Properties["displayName"].Value?.ToString() ?? "Unknown User";
                        string email = directoryEntry.Properties["mail"].Value?.ToString() ?? "No Email";
                        string jobTitle = directoryEntry.Properties["title"].Value?.ToString() ?? "No Job Title";

                        Console.WriteLine($"Retrieved StaffName: {staffName}");
                        Console.WriteLine($"Retrieved Email: {email}");
                        Console.WriteLine($"Retrieved Job Title: {jobTitle}");

                        var staffMl = new StaffML
                        {
                            StaffNo = StaffNo,
                            StaffName = staffName,
                            UserRole = "AEVT-Staff"
                        };

                        string ldapPath = directoryEntry.Path;

                        if (!string.IsNullOrEmpty(ldapPath))
                        {
                            var parts = ldapPath.Split(',');
                            int ouCount = 0;
                            foreach (var part in parts)
                            {
                                if (part.Trim().StartsWith("OU="))
                                {
                                    ouCount++;
                                    if (ouCount == 2)
                                    {
                                        string department = part.Trim().Substring(3);
                                        _httpContextAccessor.HttpContext.Session.SetString("Department", department);
                                        break;
                                    }
                                }
                            }
                        }

                        _httpContextAccessor.HttpContext.Session.SetString("StaffName", staffName);
                        _httpContextAccessor.HttpContext.Session.SetString("Email", email);
                        _httpContextAccessor.HttpContext.Session.SetString("JobTitle", jobTitle);
                        _httpContextAccessor.HttpContext.Session.SetString("UserRole", staffMl.UserRole);

                        Console.WriteLine($"StaffName set in session: {staffName}");
                        Console.WriteLine($"Department set in session: {ldapPath}");

                        return true;
                    }
                    else
                    {
                        Console.WriteLine($"User    {StaffNo} authentication failed: No user found");
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


        public static readonly HttpClient client = new HttpClient();

        public StaffML GetRole(StaffML staffMl)
        {
            try
            {
                string url = _configuration["AppSecSettings:AppSecService"].ToString();
                string AppID = _configuration["AppSecSettings:AppId"].ToString();

                using (HttpClient client = new HttpClient())
                {
                    var requestData = new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>("USERNAME", staffMl.StaffNo),
                        new KeyValuePair<string, string>("PASSWORD", staffMl.StaffPassword),
                        new KeyValuePair<string, string>("APPSECAPPID", AppID)
                    };

                    var content = new FormUrlEncodedContent(requestData);
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

                    HttpResponseMessage response = client.PostAsync(url, content).GetAwaiter().GetResult();
                    response.EnsureSuccessStatusCode();

                    string jsonResponse =  response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    JArray responseData = JArray.Parse(jsonResponse);

                    if (responseData.Count > 0)
                    {
                        var item = responseData[0];

                        Console.WriteLine("PATH: " + item["PATH"]);
                        Console.WriteLine("USERID: " + item["USERID"]);
                        Console.WriteLine("DISPLAYNAME: " + item["DISPLAYNAME"]);
                        Console.WriteLine("GRADE: " + item["GRADE"]);
                        Console.WriteLine("PERMISSIONLEVEL: " + item["PERMISSIONLEVEL"]);
                        Console.WriteLine("RESPONSE_CODE: " + item["RESPONSE_CODE"]);
                        Console.WriteLine("RESPONSE_MESSAGE: " + item["RESPONSE_MESSAGE"]);
                        Console.WriteLine();

                        string ldapPath = item["PATH"]?.ToString();

                        if (!string.IsNullOrEmpty(ldapPath))
                        {
                            var parts = ldapPath.Split(',');
                            int ouCount = 0;
                            foreach (var part in parts)
                            {
                                if (part.Trim().StartsWith("OU="))
                                {
                                    ouCount++;
                                    if (ouCount == 2)
                                    {
                                        _httpContextAccessor.HttpContext.Session.SetString("Department", part.Trim().Substring(3));
                                        break;
                                    }
                                }
                            }
                        }

                        staffMl.UserRole = item["PERMISSIONLEVEL"]?.ToString() ?? "AEVT-Staff";
                        staffMl.StaffName = item["DISPLAYNAME"]?.ToString() ?? "Unknown User";

                        if (staffMl.UserRole == "NA")
                        {
                            staffMl.UserRole = "AEVT-Staff";
                        }

                        _httpContextAccessor.HttpContext.Session.SetString("UserRole", staffMl.UserRole);
                    }
                    else
                    {
                        staffMl.UserRole = "AEVT-Staff";
                    }
                }

                if (string.IsNullOrEmpty(_httpContextAccessor.HttpContext.Session.GetString("StaffName")))
                {
                    _httpContextAccessor.HttpContext.Session.SetString("StaffName", staffMl.StaffName);
                }

                return staffMl;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return null;
            }
        }

        //public StaffML GetNameAndEmail(StaffML staffNo)
        //{
        //    StaffML emailMl = new StaffML();

        //    try
        //    {
        //        var updateDe = new DirectoryEntry();
        //        var dirSearcher = new DirectorySearcher(updateDe)
        //        {
        //            Filter = "(&(objectCategory=Person)(objectClass=user)(SAMAccountName=" + staffNo.StaffNo + "))",
        //            SearchScope = SearchScope.Subtree
        //        };
        //        var searchResults = dirSearcher.FindOne();

        //        if (searchResults != null)
        //        {
        //            var directoryEntry = searchResults.GetDirectoryEntry();
        //            if (directoryEntry.Properties["displayName"].Value != null)
        //            {
        //                emailMl.StaffName = directoryEntry.Properties["displayName"].Value.ToString();
        //            }

        //            if (directoryEntry.Properties["mail"].Value != null)
        //            {
        //                emailMl.EmailAddress = directoryEntry.Properties["mail"].Value.ToString();
        //            }
        //        }
        //        else
        //        {
        //            Console.WriteLine($"No results found for {staffNo.StaffNo}");
        //        }

        //        return emailMl;
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error retrieving name and email: {ex}");
        //        return null;
        //    }
        //}
    }
}