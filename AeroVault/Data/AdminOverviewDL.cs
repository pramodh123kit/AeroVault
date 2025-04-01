using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AeroVault.Data
{
    public class AdminOverviewDl
    {
        private readonly string _connectionString;

        public AdminOverviewDl(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<StaffLogin>> GetStaffLoginTimesAsync()
        {
            var staffLogins = new List<StaffLogin>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand("SELECT TIMEOFLOGGINGIN FROM STAFF", connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            staffLogins.Add(new StaffLogin
                            {
                                TimeOfLoggingIn = reader.GetDateTime(0)
                            });
                        }
                    }
                }
            }

            return staffLogins;
        }
    }
}