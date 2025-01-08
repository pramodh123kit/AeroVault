using System.Data;
using Oracle.ManagedDataAccess.Client;
using AeroVault.Models;
using Microsoft.Extensions.Configuration;

namespace AeroVault.Data
{
    public class FileRepositoryDl
    {
        private readonly string _connectionString;

        public FileRepositoryDl(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<DepartmentModel> GetActiveDepartments()
        {
            List<DepartmentModel> departments = new List<DepartmentModel>();

            using (OracleConnection conn = new OracleConnection(_connectionString))
            {
                conn.Open();

                //string query = "SELECT DEPARTMENTID, DEPARTMENTNAME FROM DEPARTMENTS WHERE IS_DELETED = 0 ORDER BY DEPARTMENTNAME";
                string query = "SELECT d.DepartmentID, d.DepartmentName, d.DivisionID, v.DivisionName, d.ADDED_DATE FROM c##aerovault.DEPARTMENTS d JOIN c##aerovault.DIVISIONS v ON d.DivisionID = v.DivisionID WHERE d.is_deleted = 0 AND v.IsDeleted = 0";



                using (OracleCommand cmd = new OracleCommand(query, conn))
                {
                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            departments.Add(new DepartmentModel
                            {
                                DepartmentID = reader.GetInt32(reader.GetOrdinal("DEPARTMENTID")),
                                DepartmentName = reader.GetString(reader.GetOrdinal("DEPARTMENTNAME"))
                            });
                        }
                    }
                }
            }

            return departments;
        }

        public List<SystemModel> GetSystemsByDepartment(int departmentId)
        {
            List<SystemModel> systems = new List<SystemModel>();

            using (OracleConnection conn = new OracleConnection(_connectionString))
            {
                conn.Open();

                string query = @"
            SELECT s.SystemID, s.SystemName, s.Description 
            FROM c##aerovault.SYSTEMS s
            JOIN c##aerovault.SYSTEM_DEPARTMENTS sd ON s.SystemID = sd.SystemID
            WHERE sd.DepartmentID = :DepartmentID AND s.IS_DELETED = 0";

                using (OracleCommand cmd = new OracleCommand(query, conn))
                {
                    cmd.Parameters.Add(":DepartmentID", OracleDbType.Int32).Value = departmentId;

                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            systems.Add(new SystemModel
                            {
                                SystemID = reader.GetInt32(reader.GetOrdinal("SystemID")),
                                SystemName = reader.GetString(reader.GetOrdinal("SystemName")),
                                Description = reader.GetString(reader.GetOrdinal("Description"))
                            });
                        }
                    }
                }
            }

            return systems;
        }
    }
}