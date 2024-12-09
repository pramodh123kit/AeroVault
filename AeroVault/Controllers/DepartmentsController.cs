using AeroVault.Controllers;
using AeroVault.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AeroVault.Models
{

    public class DepartmentsController : BaseAdminController

    {
        private readonly string _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";

        public DepartmentsController(ApplicationDbContext context) : base(context) { }


        public async Task<IActionResult> Index()

        {

            var departments = await GetAllDepartmentsAsync();

            var divisions = await GetAllDivisionsAsync();


            // Explicitly set ViewData to match the previous implementation

            ViewData["Divisions"] = divisions;


            var viewModel = new DepartmentViewModel

            {

                Departments = departments,

                Divisions = divisions

            };


            return View("~/Views/Admin/_Departments.cshtml", viewModel);

        }

        // Method to read departments
        public async Task<List<DepartmentModel>> GetAllDepartmentsAsync()
        {
            var departments = await _context.Set<DepartmentModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DEPARTMENTS WHERE is_deleted = 0")
                .ToListAsync();

            Console.WriteLine($"Number of Departments fetched: {departments.Count}");
            return departments;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            var departments = await GetAllDepartmentsAsync();
            return Json(departments);
        }

        // Method to read divisions
        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _context.Set<DivisionModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS")
                .ToListAsync();
        }

        [HttpGet]
        public async Task<IActionResult> GetDivisions()
        {
            try
            {
                var divisions = new List<DivisionModel>();
                string sql = "SELECT DivisionID, DivisionName FROM C##AEROVAULT.DIVISIONS";
                using (var connection = new OracleConnection(_context.Database.GetConnectionString()))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(sql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                divisions.Add(new DivisionModel
                                {
                                    DivisionID = reader.GetInt32(0),
                                    DivisionName = reader.GetString(1)
                                });
                            }
                        }
                    }
                }

                return Json(divisions);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDivisionsForPopup()
        {
            try
            {
                var divisions = new List<object>();

                // Fetch divisions
                string divisionsSql = "SELECT DivisionID, DivisionName FROM C##AEROVAULT.DIVISIONS";

                using (var connection = new OracleConnection(_context.Database.GetConnectionString()))
                {
                    await connection.OpenAsync();

                    // Fetch divisions
                    var divisionList = new List<DivisionModel>();
                    using (var command = new OracleCommand(divisionsSql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                divisionList.Add(new DivisionModel
                                {
                                    DivisionID = reader.GetInt32(0),
                                    DivisionName = reader.GetString(1)
                                });
                            }
                        }
                    }

                    // Fetch departments
                    string departmentsSql = @"
                SELECT DepartmentID, DepartmentName, DivisionID 
                FROM C##AEROVAULT.DEPARTMENTS 
                WHERE is_deleted = 0";

                    var departmentList = new List<DepartmentModel>();
                    using (var command = new OracleCommand(departmentsSql, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                departmentList.Add(new DepartmentModel
                                {
                                    DepartmentID = reader.GetInt32(0),
                                    DepartmentName = reader.GetString(1),
                                    DivisionID = reader.GetInt32(2)
                                });
                            }
                        }
                    }

                    // Group departments by division
                    foreach (var division in divisionList)
                    {
                        divisions.Add(new
                        {
                            divisionName = division.DivisionName,
                            departments = departmentList
                                .Where(d => d.DivisionID == division.DivisionID)
                                .Select(d => new
                                {
                                    departmentID = d.DepartmentID,
                                    departmentName = d.DepartmentName
                                })
                                .ToList()
                        });
                    }
                }

                return Json(divisions);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment(string departmentName, int divisionId)
        {
            // Validate inputs
            if (string.IsNullOrWhiteSpace(departmentName))
            {
                return BadRequest("Department name cannot be empty.");
            }

            try
            {
                // Check if the department already exists (case insensitive)
                string checkSql = "SELECT COUNT(*) FROM C##AEROVAULT.Departments WHERE LOWER(DepartmentName) = LOWER(:DepartmentName) AND DivisionID = :DivisionID";

                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(checkSql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                        command.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                        int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                        if (count > 0)
                        {
                            return BadRequest("A department with this name already exists in the selected division.");
                        }
                    }

                    // Prepare the SQL insert statement
                    string insertSql = @"
                INSERT INTO C##AEROVAULT.Departments (DepartmentName, DivisionID) 
                VALUES (:DepartmentName, :DivisionID)
                RETURNING DepartmentID INTO :NewDepartmentID";

                    int newDepartmentId = 0;
                    using (var insertCommand = new OracleCommand(insertSql, connection))
                    {
                        insertCommand.Parameters.Add(new OracleParameter(":DepartmentName", departmentName));
                        insertCommand.Parameters.Add(new OracleParameter(":DivisionID", divisionId));

                        // Output parameter to get the new department ID
                        var newDepartmentIdParam = new OracleParameter(":NewDepartmentID", OracleDbType.Int32)
                        {
                            Direction = System.Data.ParameterDirection.Output
                        };
                        insertCommand.Parameters.Add(newDepartmentIdParam);

                        await insertCommand.ExecuteNonQueryAsync();

                        // Safely get the new department ID
                        if (newDepartmentIdParam.Value != null)
                        {
                            newDepartmentId = newDepartmentIdParam.Value switch
                            {
                                Oracle.ManagedDataAccess.Types.OracleDecimal oracleDecimal => oracleDecimal.ToInt32(),
                                int intValue => intValue,
                                _ => Convert.ToInt32(newDepartmentIdParam.Value)
                            };
                        }
                    }

                    // Fetch the division name to return with the department
                    string divisionNameSql = "SELECT DivisionName FROM C##AEROVAULT.Divisions WHERE DivisionID = :DivisionID";
                    string divisionName = "";
                    using (var divisionCommand = new OracleCommand(divisionNameSql, connection))
                    {
                        divisionCommand.Parameters.Add(new OracleParameter(":DivisionID", divisionId));
                        divisionName = (await divisionCommand.ExecuteScalarAsync())?.ToString();
                    }

                    return Ok(new
                    {
                        departmentId = newDepartmentId,
                        departmentName = departmentName,
                        divisionId = divisionId,
                        divisionName = divisionName
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Full Exception: {ex}");
                return StatusCode(500, new
                {
                    message = "Internal server error: " + ex.Message
                });
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.DepartmentName))
            {
                return BadRequest(new { Message = "Invalid department data" });
            }

            try
            {
                string updateSql = "UPDATE C##AEROVAULT.Departments SET DepartmentName = :DepartmentName, DivisionID = :DivisionID WHERE DepartmentID = :DepartmentID";

                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(updateSql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":DepartmentName", request.DepartmentName));
                        command.Parameters.Add(new OracleParameter(":DivisionID", request.DivisionId));
                        command.Parameters.Add(new OracleParameter(":DepartmentID", request.DepartmentId));

                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        if (rowsAffected == 0)
                        {
                            return NotFound(new { Message = "Department not found" });
                        }
                    }
                }

                return Ok(new { Message = "Department updated successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Full Exception: {ex}");
                return StatusCode(500, new
                {
                    Message = "Internal server error",
                    ExceptionType = ex.GetType().FullName,
                    ExceptionMessage = ex.Message
                });
            }
        }

        [HttpPut]
        public IActionResult SoftDeleteDepartment([FromBody] DepartmentDeleteModel model)
        {
            try
            {
                if (model == null || model.DepartmentId <= 0)
                {
                    return BadRequest(new { message = "Invalid department ID" });
                }

                string updateSql = "UPDATE C##AEROVAULT.DEPARTMENTS SET is_deleted = 1 WHERE DepartmentID = :DepartmentId";

                using (var connection = new OracleConnection(_connectionString))
                {
                    connection.Open();
                    using (var command = new OracleCommand(updateSql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":DepartmentId", model.DepartmentId));

                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected == 0)
                        {
                            return NotFound(new { message = "Department not found" });
                        }
                    }
                }

                return Json(new
                {
                    success = true,
                    message = "Department soft deleted successfully",
                    departmentId = model.DepartmentId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Soft Delete Error: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred",
                    details = ex.Message,
                    exceptionType = ex.GetType().FullName
                });
            }
        }

        public class UpdateDepartmentRequest
        {
            public int DepartmentId { get; set; }
            public string DepartmentName { get; set; }
            public int DivisionId { get; set; }
        }

        public class DepartmentDeleteModel
        {
            public int DepartmentId { get; set; }
        }
    }
}