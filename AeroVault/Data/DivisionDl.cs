using AeroVault.Models;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace AeroVault.Data
{
    public class DivisionDl
    {
        private readonly string _connectionString;
        private readonly ApplicationDbContext _context;

        public DivisionDl(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<DivisionModel>> GetDivisionsAddedAfterAsync(DateTime fromDate)
        {
            var divisions = new List<DivisionModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                string sql = @"
            SELECT DivisionID, DivisionName, IsDeleted, ADDED_DATE
            FROM DIVISIONS
            WHERE IsDeleted = 0 AND ADDED_DATE >= :fromDate";

                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":fromDate", fromDate));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            divisions.Add(new DivisionModel
                            {
                                DivisionID = reader.GetInt32(0),
                                DivisionName = reader.GetString(1),
                                IsDeleted = reader.GetInt32(2),
                                AddedDate = reader["ADDED_DATE"] != DBNull.Value
                                    ? Convert.ToDateTime(reader["ADDED_DATE"])
                                    : (DateTime?)null
                            });
                        }
                    }
                }
            }
            return divisions;
        }


        // calling methord is totally wrong needs to calling from Business layer (Overview)

        public async Task<List<DivisionModel>> GetAllDivisionsAsync()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new OracleCommand(
                    "SELECT DivisionID, DivisionName, IsDeleted, ADDED_DATE " +
                    "FROM DIVISIONS " +
                    "WHERE IsDeleted = 0",
                    connection))
                {
                    var divisions = new List<DivisionModel>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            divisions.Add(new DivisionModel
                            {
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                DivisionName = reader["DivisionName"].ToString(),
                                IsDeleted = Convert.ToInt32(reader["IsDeleted"]),
                                AddedDate = reader["ADDED_DATE"] != DBNull.Value
                                    ? Convert.ToDateTime(reader["ADDED_DATE"])
                                    : (DateTime?)null
                            });
                        }
                    }
                    return divisions;
                }
            }
        }


      



        public bool updateDivisionByID(int DivisionID, string DivisionName)
        {
            string sql = @"
            UPDATE DIVISIONS 
            SET DIVISIONNAME = :DivisionName 
            WHERE DIVISIONID = :DivisionID";

            var parameters = new[]
            {
                new OracleParameter(":DivisionName", DivisionName),
                   new OracleParameter(":DivisionID", DivisionID)

            };

            int rowsAffected = _context.Database.ExecuteSqlRaw(sql, parameters);

            if (rowsAffected == 0)
            {
                throw new Exception("No rows were updated. Division may not exist.");
            }
            return true;
        }



        public bool AddDivision(string divisionName)
        {

            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();

                int newDivisionId;
                string getIdSql = "SELECT SEQ_DIVISIONID.NEXTVAL FROM DUAL";

                using (var idCommand = new OracleCommand(getIdSql, connection))
                {
                    newDivisionId = Convert.ToInt32(idCommand.ExecuteScalar());
                }

                string sql = "INSERT INTO DIVISIONS (DivisionID, DivisionName) VALUES (:DivisionID, :DivisionName)";
                using (var command = new OracleCommand(sql, connection))
                {
                    command.Parameters.Add(new OracleParameter(":DivisionID", newDivisionId));
                    command.Parameters.Add(new OracleParameter(":DivisionName", divisionName));

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        throw new Exception("No rows were inserted.");
                    }
                }
            }
            return true;
        }


        public bool enableDivision(int DivisionID)
        {
            string sql = @"
BEGIN
    UPDATE DEPARTMENTS 
    SET IS_DELETED = 0 
    WHERE DIVISIONID = :DivisionId;

    UPDATE DIVISIONS 
    SET ISDELETED = 0 
    WHERE DIVISIONID = :DivisionId;
END;";

            var parameters = new[]
            {

                  new OracleParameter(":DivisionID", DivisionID)

            };

            int rowsAffected = _context.Database.ExecuteSqlRaw(sql, parameters);

            if (rowsAffected == 0)
            {
                throw new Exception("No rows were updated. Division may not exist.");
            }
            return true;
        }


        public bool disableDivision(int DivisionID)
        {
            string sql = @"
BEGIN
    UPDATE DEPARTMENTS 
    SET IS_DELETED = 1 
    WHERE DIVISIONID = :DivisionId;

    UPDATE DIVISIONS 
    SET ISDELETED = 1 
    WHERE DIVISIONID = :DivisionId;
END;";

            var parameters = new[]
            {

                  new OracleParameter(":DivisionID", DivisionID)

            };

            int rowsAffected = _context.Database.ExecuteSqlRaw(sql, parameters);

            if (rowsAffected == 0)
            {
                throw new Exception("No rows were updated. Division may not exist.");
            }
            return true;
        }

        public List<DivisionModel> GetAllDivisions()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                using (var command = new OracleCommand(
                    "SELECT DivisionID, DivisionName, IsDeleted, ADDED_DATE " +
                    "FROM DIVISIONS ",
                    connection))
                {
                    var divisions = new List<DivisionModel>();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            divisions.Add(new DivisionModel
                            {
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                DivisionName = reader["DivisionName"].ToString(),
                                IsDeleted = Convert.ToInt32(reader["IsDeleted"]),
                                AddedDate = reader["ADDED_DATE"] != DBNull.Value
                                    ? Convert.ToDateTime(reader["ADDED_DATE"])
                                    : (DateTime?)null
                            });
                        }
                    }
                    return divisions;
                }
            }
        }
    }
}