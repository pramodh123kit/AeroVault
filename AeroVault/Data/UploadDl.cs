﻿using AeroVault.Models;

using Oracle.ManagedDataAccess.Client;

using Microsoft.Extensions.Configuration; // Make sure to include this namespace


namespace AeroVault.Data

{

    public class UploadDl

    {

        private readonly string _connectionString;


        // Update the constructor to accept IConfiguration

        public UploadDl(IConfiguration configuration)

        {

            _connectionString = configuration.GetConnectionString("DefaultConnection");

        }

        public List<DepartmentModel> GetActiveDepartments()
        {
            var departments = new List<DepartmentModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
            SELECT 
                d.DepartmentID, 
                d.DepartmentName, 
                d.DivisionID, 
                v.DivisionName, 
                d.ADDED_DATE 
            FROM 
                DEPARTMENTS d 
            JOIN 
                DIVISIONS v ON d.DivisionID = v.DivisionID 
            WHERE 
                d.is_deleted = 0 AND v.IsDeleted = 0
            ORDER BY 
                d.DepartmentName";

                using (var command = new OracleCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            departments.Add(new DepartmentModel
                            {
                                DepartmentID = Convert.ToInt32(reader["DepartmentID"]),
                                DepartmentName = reader["DepartmentName"].ToString(),
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                AddedDate = Convert.ToDateTime(reader["ADDED_DATE"]),
                                Division = new DivisionModel
                                {
                                    DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                    DivisionName = reader["DivisionName"].ToString()
                                }
                            });
                        }
                    }
                }
            }

            return departments;
        }


        public List<SystemModel> GetActiveSystems()
        {
            var systems = new List<SystemModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
        SELECT s.SYSTEMID, s.SYSTEMNAME, s.DESCRIPTION 
        FROM SYSTEMS s
        WHERE s.IS_DELETED = 0 
        AND EXISTS (
            SELECT 1 
            FROM SYSTEM_DEPARTMENTS sd
            JOIN DEPARTMENTS d ON sd.DEPARTMENTID = d.DEPARTMENTID
            WHERE sd.SYSTEMID = s.SYSTEMID AND d.IS_DELETED = 0
        )";

                using (var command = new OracleCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            systems.Add(new SystemModel
                            {
                                SystemID = Convert.ToInt32(reader["SYSTEMID"]),
                                SystemName = reader["SYSTEMNAME"].ToString(),
                                Description = reader["DESCRIPTION"].ToString(),
                                IsDeleted = 0 // Assuming you want to set this to 0 since you're fetching active systems
                            });
                        }
                    }
                }
            }

            return systems;
        }

        public List<DivisionModel> GetActiveDivisions()
        {
            var divisions = new List<DivisionModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
            SELECT DivisionID, DivisionName, ADDED_DATE 
            FROM DIVISIONS 
            WHERE IsDeleted = 0 
            ORDER BY DivisionName";

                using (var command = new OracleCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            divisions.Add(new DivisionModel
                            {
                                DivisionID = Convert.ToInt32(reader["DivisionID"]),
                                DivisionName = reader["DivisionName"].ToString(),
                                AddedDate = Convert.ToDateTime(reader["ADDED_DATE"]),
                                IsDeleted = 0
                            });
                        }
                    }
                }
            }

            return divisions;
        }


        public List<SystemModel> GetActiveSystemsByDepartment(int departmentId)
        {
            var systems = new List<SystemModel>();

            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
            SELECT s.SYSTEMID, s.SYSTEMNAME, s.DESCRIPTION 
            FROM SYSTEMS s
            JOIN SYSTEM_DEPARTMENTS sd ON s.SYSTEMID = sd.SYSTEMID
            WHERE sd.DEPARTMENTID = :departmentId AND s.IS_DELETED = 0"; // Ensure we only get non-deleted systems

                using (var command = new OracleCommand(query, connection))
                {
                    command.Parameters.Add(new OracleParameter("departmentId", departmentId));
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            systems.Add(new SystemModel
                            {
                                SystemID = Convert.ToInt32(reader["SYSTEMID"]),
                                SystemName = reader["SYSTEMNAME"].ToString(),
                                Description = reader["DESCRIPTION"].ToString(),
                                IsDeleted = 0 // Since we're fetching non-deleted systems
                            });
                        }
                    }
                }
            }

            return systems;
        }
    }
}