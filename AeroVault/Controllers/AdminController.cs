using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;

namespace AeroVault.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult HumanR()
        {
            return View();
        }

        public async Task<IActionResult> LoadView(string viewName)
        {
            switch (viewName)
            {
                case "_Upload":
                    return PartialView("_Upload");
                case "_Systems":
                    var systems = await GetAllSystemsAsync();
                    return PartialView("_Systems", systems);
                case "_Departments":
                    return PartialView("_Departments");
                case "_Divisions":
                    var divisions = await GetAllDivisionsAsync();
                    return PartialView("_Divisions", divisions);
                case "_Review":
                    return PartialView("_Review");
                default:
                    return PartialView("_Overview");
            }
        }

        // SYSTEM CONTROLLERS

        // method to read the systems
        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            return await _context.Set<SystemModel>().FromSqlRaw("SELECT * FROM C##AEROVAULT.SYSTEMS").ToListAsync();
        }



        // DIVISION CONTROLLERS

        // method to add a division
        [HttpPost]

        public async Task<IActionResult> AddDivision(string divisionName)
        {
            if (string.IsNullOrEmpty(divisionName))
            {
                return BadRequest("Division name cannot be empty."); 
            }

            string sql = "INSERT INTO Divisions (DivisionName) VALUES (:DivisionName)";

            var parameter = new OracleParameter(":DivisionName", divisionName);
            await _context.Database.ExecuteSqlRawAsync(sql, parameter);
            return Ok(new { Message = "Division added successfully!" });
        }



        // Methods to read divisions
        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _context.Set<DivisionModel>().FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS").ToListAsync();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDivisions()
        {
            var divisions = await GetAllDivisionsAsync();
            return Json(divisions); 
        }

    }
}