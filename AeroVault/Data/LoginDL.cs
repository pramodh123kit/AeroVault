using System;
using System.Data;
using AeroVault.Models;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;

namespace AeroVault.Business
{
    public class LoginDL
    {
        private readonly string _connectionString;

        // Update constructor to remove IConfiguration parameter
        public LoginDL(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SLA_AUTH_ConnectionString");
        }

        public bool GetPermissionRoles(StaffML staffMl)
        {
            try
            {
                using (var connection = new OracleConnection(_connectionString))
                {
                    connection.Open();

                    using (var command = new OracleCommand())
                    {
                        command.Connection = connection;
                        command.CommandText = @"
                            SELECT COUNT(*) 
                            FROM SLA_AUTH_TABLE 
                            WHERE STAFF_NO = :StaffNo 
                            AND APPLICATION_CODE = 'ALTS'";

                        command.Parameters.Add(":StaffNo", OracleDbType.Varchar2).Value = staffMl.StaffNo;

                        var result = Convert.ToInt32(command.ExecuteScalar());
                        return result > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPermissionRoles: {ex.Message}");
                return false;
            }
        }
    }
}