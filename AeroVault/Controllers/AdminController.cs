using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace AeroVault.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Overview()
        {
            return PartialView("_Overview");
        }

        public IActionResult Upload()
        {
            return PartialView("_Upload");
        }

        public IActionResult Systems()
        {
            return PartialView("_Systems");
        }

        public IActionResult Departments()
        {
            return PartialView("_Departments");
        }

        public IActionResult Divisions()
        {
            return PartialView("_Divisions");
        }

        public IActionResult Review()
        {
            return PartialView("_Review");
        }
    }
}