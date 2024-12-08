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
    }
}