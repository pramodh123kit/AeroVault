using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;

namespace AeroVault.Data
{
    public class UserOverviewDl
    {
        private readonly string _connectionString;

        public UserOverviewDl(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<string> GetActiveSystems()
        {
            List<string> systems = new List<string>();

            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                try
                {
                    connection.Open();

                    string query = @"
                        SELECT SYSTEMNAME 
                        FROM SYSTEMS 
                        WHERE IS_DELETED = 0 
                        ORDER BY SYSTEMNAME";

                    using (OracleCommand command = new OracleCommand(query, connection))
                    {
                        using (OracleDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                systems.Add(reader.GetString(0));
                            }
                        }
                    }
                }
                catch (OracleException ex)
                {
                    // Log the exception
                    Console.WriteLine($"Database error: {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log other exceptions
                    Console.WriteLine($"Unexpected error: {ex.Message}");
                    throw;
                }
            }

            return systems;
        }

        public List<string> GetSystemsByDepartment(string departmentName)
        {
            List<string> systems = new List<string>();

            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                try
                {
                    connection.Open();

                    string query = @"
                SELECT DISTINCT S.SYSTEMNAME 
                FROM SYSTEMS S
                JOIN SYSTEM_DEPARTMENTS SD ON S.SYSTEMID = SD.SYSTEMID
                JOIN DEPARTMENTS D ON SD.DEPARTMENTID = D.DEPARTMENTID
                WHERE D.DEPARTMENTNAME = :DepartmentName 
                AND S.IS_DELETED = 0
                ORDER BY S.SYSTEMNAME";

                    using (OracleCommand command = new OracleCommand(query, connection))
                    {
                        command.Parameters.Add(":DepartmentName", OracleDbType.Varchar2).Value = departmentName;

                        using (OracleDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                systems.Add(reader.GetString(0));
                            }
                        }
                    }
                }
                catch (OracleException ex)
                {
                    // Log the exception
                    Console.WriteLine($"Database error: {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log other exceptions
                    Console.WriteLine($"Unexpected error: {ex.Message}");
                    throw;
                }
            }

            return systems;
        }

        public bool IsDepartmentActive(string departmentName)
        {
            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                try
                {
                    connection.Open();

                    string query = @"
                SELECT IS_DELETED 
                FROM DEPARTMENTS 
                WHERE DEPARTMENTNAME = :DepartmentName";

                    using (OracleCommand command = new OracleCommand(query, connection))
                    {
                        command.Parameters.Add(":DepartmentName", OracleDbType.Varchar2).Value = departmentName;

                        object result = command.ExecuteScalar();
                        if (result != null)
                        {
                            return Convert.ToInt32(result) == 0; // Return true if IS_DELETED is 0
                        }
                    }
                }
                catch (OracleException ex)
                {
                    // Log the exception
                    Console.WriteLine($"Database error: {ex.Message}");
                    throw;
                }
                catch (Exception ex)
                {
                    // Log other exceptions
                    Console.WriteLine($"Unexpected error: {ex.Message}");
                    throw;
                }
            }

            return false; // Default return if department not found
        }
    }
}

