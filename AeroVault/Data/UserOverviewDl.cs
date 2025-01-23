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
    }
}