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
        private readonly ApplicationDbContext _context;
        private readonly string _connectionString = "User Id=c##aerovault;Password=123;Data Source=localhost:1521/xe;";

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
                    var departments = await GetAllDepartmentsAsync();
                    var divisions = await GetAllDivisionsAsync(); 
                    ViewData["Divisions"] = divisions; 
                    var viewModel = new DepartmentViewModel
                    {
                        Departments = departments,
                        Divisions = divisions
                    };
                    return PartialView("_Departments", viewModel); 
                case "_Divisions":
                    var divisionsList = await GetAllDivisionsAsync();
                    return PartialView("_Divisions", divisionsList);
                case "_Review":
                    return PartialView("_Review");
                default:
                    return PartialView("_Overview");
            }
        }




        // DIVISION CONTROLLERS


        // Methods to read divisions
        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            return await _context.Set<DivisionModel>()
                .FromSqlRaw("SELECT * FROM C##AEROVAULT.DIVISIONS")
                .ToListAsync();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDivisions()
        {
            var divisions = await GetAllDivisionsAsync();
            return Json(divisions);
        }

        // Method to add a division
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




        // SYSTEMS CONTROLLERS

        // method to read the systems
        public async Task<List<SystemModel>> GetAllSystemsAsync()
        {
            return await _context.Set<SystemModel>().FromSqlRaw("SELECT * FROM C##AEROVAULT.SYSTEMS").ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CheckSystemExists([FromBody] SystemExistsRequest request)
        {
            try
            {
                string sql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SystemName) = LOWER(:SystemName)";
                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(sql, connection))
                    {
                        command.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                        int count = Convert.ToInt32(await command.ExecuteScalarAsync());
                        bool exists = count > 0;
                        return Json(new { exists });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error: " + ex.Message });
            }
        }

        // DTO for the request
        public class SystemExistsRequest
        {
            public string SystemName { get; set; }
        }


        // DTO for creating a system
        public class CreateSystemRequest
        {
            public string SystemName { get; set; }
            public string Description { get; set; }
            public List<int> DepartmentIds { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateSystem([FromBody] CreateSystemRequest request)
        {
            // Validate input
            if (request == null)
            {
                return BadRequest(new { message = "Invalid system data" });
            }

            // Validate system name
            if (string.IsNullOrWhiteSpace(request.SystemName))
            {
                return BadRequest(new { message = "System name is required" });
            }

            // Validate description
            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            // Validate department IDs
            if (request.DepartmentIds == null || !request.DepartmentIds.Any())
            {
                return BadRequest(new { message = "At least one department must be selected" });
            }

            OracleConnection connection = null;
            OracleTransaction transaction = null;

            try
            {
                connection = new OracleConnection(_connectionString);
                await connection.OpenAsync();

                // Start a transaction
                transaction = connection.BeginTransaction();

                try
                {
                    // Check if system name already exists
                    string checkSql = "SELECT COUNT(*) FROM C##AEROVAULT.SYSTEMS WHERE LOWER(SYSTEMNAME) = LOWER(:SystemName)";
                    using (var checkCommand = new OracleCommand(checkSql, connection))

                    {

                        // Set the transaction after creating the command

                        checkCommand.Transaction = transaction;

                        checkCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));

                        int count = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());

                        if (count > 0)

                        {

                            return Conflict(new { message = "A system with this name already exists" });

                        }

                    }

                    // Create new system 
                    int newSystemId;
                    string insertSql = @"
                    INSERT INTO C##AEROVAULT.SYSTEMS (SYSTEMID, SYSTEMNAME, DESCRIPTION) 
                    VALUES (C##AEROVAULT.SYSTEMS_SEQ.NEXTVAL, :SystemName, :Description)
                    RETURNING SYSTEMID INTO :NewSystemID";

                    using (var insertCommand = new OracleCommand(insertSql, connection))
                    {
                        insertCommand.Transaction = transaction;
                        // Add input parameters
                        insertCommand.Parameters.Add(new OracleParameter(":SystemName", request.SystemName));
                        insertCommand.Parameters.Add(new OracleParameter(":Description", request.Description));

                        // Output parameter for the new system ID
                        var systemIdParam = new OracleParameter(":NewSystemID", OracleDbType.Int32)
                        {
                            Direction = System.Data.ParameterDirection.Output
                        };
                        insertCommand.Parameters.Add(systemIdParam);

                        // Execute the insert
                        await insertCommand.ExecuteNonQueryAsync();

                        // Safely get the new system ID
                        newSystemId = ConvertOracleDecimal(systemIdParam.Value);
                    }

                    // Insert system-department associations
                    string insertAssociationSql = @"
                    INSERT INTO C##AEROVAULT.SYSTEM_DEPARTMENTS (SYSTEMID, DEPARTMENTID) 
                    VALUES (:SystemID, :DepartmentID)";

                    foreach (var departmentId in request.DepartmentIds)
                    {
                        using (var associationCommand = new OracleCommand(insertAssociationSql, connection))

                        {

                            // Set the transaction after creating the command

                            associationCommand.Transaction = transaction;

                            associationCommand.Parameters.Add(new OracleParameter(":SystemID", newSystemId));

                            associationCommand.Parameters.Add(new OracleParameter(":DepartmentID", departmentId));

                            await associationCommand.ExecuteNonQueryAsync();

                        }
                    }

                    // Commit the transaction
                    transaction.Commit();

                    // Prepare and return the response
                    return Ok(new
                    {
                        systemId = newSystemId,
                        systemName = request.SystemName,
                        description = request.Description,
                        departments = request.DepartmentIds
                    });
                }
                catch (OracleException ex)
                {
                    // Rollback the transaction
                    transaction?.Rollback();

                    // Log the full exception details
                    Console.WriteLine($"Oracle Exception: {ex}");
                    Console.WriteLine($"Error Code: {ex.ErrorCode}");
                    Console.WriteLine($"Exception Message: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    return StatusCode(500, new
                    {
                        message = "An error occurred while creating the system",
                        details = ex.Message,
                        errorCode = ex.ErrorCode
                    });
                }
                catch (Exception ex)
                {
                    // Rollback the transaction
                    transaction?.Rollback();

                    // Log the full exception details
                    Console.WriteLine($"Outer Exception: {ex}");
                    Console.WriteLine($"Exception Type: {ex.GetType().FullName}");
                    Console.WriteLine($"Exception Message: {ex.Message}");
                    Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                    return StatusCode(500, new
                    {
                        message = "An unexpected error occurred",
                        details = ex.Message,
                        exceptionType = ex.GetType().FullName
                    });
                }
            }
            finally
            {
                // Ensure proper disposal of resources
                transaction?.Dispose();
                connection?.Close();
                connection?.Dispose();
            }
        }




        // Helper method to convert Oracle Decimal to int

        private int ConvertOracleDecimal(object value)
        {
            return value switch
            {
                Oracle.ManagedDataAccess.Types.OracleDecimal oracleDecimal => oracleDecimal.ToInt32(),
                int intValue => intValue,
                _ => Convert.ToInt32(value)
            };
        }












































































































        // DEPARTMENTS CONTROLLERS 

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


        // Add this method to your AdminController
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
                            // Handle different possible types
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

                    // Return the new department details with camelCase for JavaScript
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
                // Log the full exception details
                Console.WriteLine($"Full Exception: {ex}");
                Console.WriteLine($"Exception Type: {ex.GetType().FullName}");
                Console.WriteLine($"Exception Message: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    message = "Internal server error: " + ex.Message
                });
            }
        }


        //public class UpdateDepartmentRequest 

        //{

        //    public int DepartmentId { get; set; }

        //    public string DepartmentName { get; set; }

        //    public int DivisionId { get; set; }

        //}

        public class UpdateDepartmentRequest
        {
            [Required]
            [Range(1, int.MaxValue, ErrorMessage = "Invalid Department ID")]
            public int DepartmentId { get; set; }

            [Required]
            [StringLength(255, MinimumLength = 1, ErrorMessage = "Department name must be between 1 and 255 characters")]
            public string DepartmentName { get; set; }

            [Required]
            [Range(1, int.MaxValue, ErrorMessage = "Invalid Division ID")]
            public int DivisionId { get; set; }
        }



        [HttpPut]
        public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentRequest request)
        {
            // Extremely verbose logging
            Console.WriteLine("UpdateDepartment method called");

            // Log entire request object serialization
            try
            {
                var serializedRequest = System.Text.Json.JsonSerializer.Serialize(request);
                Console.WriteLine($"Received Request (Serialized): {serializedRequest}");
            }
            catch (Exception serializationEx)
            {
                Console.WriteLine($"Serialization Error: {serializationEx}");
            }

            // Detailed null and property checks
            Console.WriteLine($"Request is null: {request == null}");

            if (request != null)
            {
                Console.WriteLine($"DepartmentId: {request.DepartmentId}");
                Console.WriteLine($"DepartmentName: {request.DepartmentName}");
                Console.WriteLine($"DivisionId: {request.DivisionId}");
            }

            // Validate inputs with extreme detail
            if (request == null)
            {
                Console.WriteLine("Request is null - returning BadRequest");
                return BadRequest(new { Message = "Request cannot be null" });
            }

            // Null or whitespace check with detailed logging
            if (string.IsNullOrWhiteSpace(request.DepartmentName))
            {
                Console.WriteLine("Department name is null or empty");
                return BadRequest(new { Message = "Department name cannot be empty." });
            }

            try
            {
                // Prepare the SQL update statement
                string updateSql = "UPDATE C##AEROVAULT.Departments SET DepartmentName = :DepartmentName, DivisionID = :DivisionID WHERE DepartmentID = :DepartmentID";

                using (var connection = new OracleConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new OracleCommand(updateSql, connection))
                    {
                        // Add parameters with logging
                        Console.WriteLine($"Adding Parameter - DepartmentName: {request.DepartmentName}");
                        command.Parameters.Add(new OracleParameter(":DepartmentName", request.DepartmentName));

                        Console.WriteLine($"Adding Parameter - DivisionID: {request.DivisionId}");
                        command.Parameters.Add(new OracleParameter(":DivisionID", request.DivisionId));

                        Console.WriteLine($"Adding Parameter - DepartmentID: {request.DepartmentId}");
                        command.Parameters.Add(new OracleParameter(":DepartmentID", request.DepartmentId));

                        // Execute with logging
                        int rowsAffected = await command.ExecuteNonQueryAsync();

                        Console.WriteLine($"Rows affected: {rowsAffected}");

                        if (rowsAffected == 0)
                        {
                            Console.WriteLine("No rows were updated");
                            return NotFound(new { Message = "Department not found" });
                        }
                    }
                }

                return Ok(new { Message = "Department updated successfully!" });
            }
            catch (Exception ex)
            {
                // Extremely detailed exception logging
                Console.WriteLine($"Full Exception: {ex}");
                Console.WriteLine($"Exception Type: {ex.GetType().FullName}");
                Console.WriteLine($"Exception Message: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

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
                // Validate input
                if (model == null || model.DepartmentId <= 0)
                {
                    return BadRequest(new { message = "Invalid department ID" });
                }

                // Use raw SQL to update the is_deleted column
                string updateSql = "UPDATE C##AEROVAULT.  SET is_deleted = 1 WHERE DepartmentID = :DepartmentId";

                using (var connection = new OracleConnection(_connectionString))
                {
                    connection.Open();
                    using (var command = new OracleCommand(updateSql, connection))
                    {
                        // Add parameter
                        command.Parameters.Add(new OracleParameter(":DepartmentId", model.DepartmentId));

                        // Execute the update
                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected == 0)
                        {
                            // No rows were updated
                            return NotFound(new { message = "Department not found" });
                        }
                    }
                }

                // Return success response
                return Json(new
                {
                    success = true,
                    message = "Department soft deleted successfully",
                    departmentId = model.DepartmentId
                });
            }
            catch (Exception ex)
            {
                // Log the full exception
                Console.WriteLine($"Soft Delete Error: {ex.Message}");
                Console.WriteLine($"Full Exception: {ex}");

                // Return a more detailed error response
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred",
                    details = ex.Message,
                    exceptionType = ex.GetType().FullName
                });
            }
        }

        // Model to receive the department ID
        public class DepartmentDeleteModel
        {
            public int DepartmentId { get; set; }
        }




        //public List<DepartmentModel> GetActiveDepartments()
        //{
        //    return _context.Departments
        //        .Where(d => d.IsDeleted == 0)
        //        .Include(d => d.Division)
        //        .ToList();
        //}

        public async Task<List<DepartmentModel>> GetActiveDepartments()
        {
            return await _context.Departments
                .Where(d => d.IsDeleted == 0)
                .Include(d => d.Division)
                .ToListAsync();
        }


    }

    public class DepartmentViewModel
    {
        public List<DepartmentModel> Departments { get; set; }
        public List<DivisionModel> Divisions { get; set; }
    }
}