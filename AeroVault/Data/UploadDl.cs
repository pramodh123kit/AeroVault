﻿using AeroVault.Models;
using Oracle.ManagedDataAccess.Client;
using Microsoft.Extensions.Configuration;

namespace AeroVault.Data
{
    public class UploadDl
    { 
        private readonly string _connectionString;
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
                                IsDeleted = 0 
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
            WHERE sd.DEPARTMENTID = :departmentId AND s.IS_DELETED = 0";

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
                                IsDeleted = 0 
                            });
                        }
                    }
                }
            }
            return systems;
        }

        public List<FileModel> GetAllFiles()
        {
            var files = new List<FileModel>();
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
        SELECT 
            f.FileID, 
            f.SystemID, 
            f.FileName, 
            f.FileType, 
            f.FileCategory, 
            f.Added_Date,
            f.UniqueFileIdentifier,
            s.SystemName,
            LISTAGG(d.DepartmentName, ', ') WITHIN GROUP (ORDER BY d.DepartmentName) AS DepartmentNames,
            COUNT(DISTINCT d.DepartmentID) AS DepartmentCount
        FROM 
            Files f
        JOIN 
            Systems s ON f.SystemID = s.SystemID
        LEFT JOIN 
            System_Departments sd ON s.SystemID = sd.SystemID
        LEFT JOIN 
            Departments d ON sd.DepartmentID = d.DepartmentID AND d.IS_DELETED = 0
        WHERE 
            s.IS_DELETED = 0 
            AND f.IS_DELETED = 0
            AND EXISTS (
                SELECT 1 
                FROM System_Departments sd
                JOIN Departments d ON sd.DepartmentID = d.DepartmentID
                WHERE sd.SystemID = s.SystemID AND d.IS_DELETED = 0
            )
        GROUP BY 
            f.FileID, 
            f.SystemID, 
            f.FileName, 
            f.FileType, 
            f.FileCategory, 
            f.Added_Date, 
            f.UniqueFileIdentifier,
            s.SystemName
        ORDER BY 
            f.Added_Date DESC";

                using (var command = new OracleCommand(query, connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var fileModel = new FileModel
                            {
                                FileID = Convert.ToInt32(reader["FileID"]),
                                SystemID = Convert.ToInt32(reader["SystemID"]),
                                FileName = reader["FileName"].ToString(),
                                FileType = reader["FileType"] != DBNull.Value ? reader["FileType"].ToString() : string.Empty,
                                FileCategory = reader["FileCategory"] != DBNull.Value ? reader["FileCategory"].ToString() : string.Empty,
                                AddedDate = reader["Added_Date"] != DBNull.Value ? Convert.ToDateTime(reader["Added_Date"]) : (DateTime?)null,
                                UniqueFileIdentifier = reader["UniqueFileIdentifier"] != DBNull.Value ? reader["UniqueFileIdentifier"].ToString() : null,
                                System = new SystemModel
                                {
                                    SystemID = Convert.ToInt32(reader["SystemID"]),
                                    SystemName = reader["SystemName"].ToString()
                                },
                                DepartmentNames = reader["DepartmentNames"].ToString()
                            };

                            fileModel.DepartmentName = Convert.ToInt32(reader["DepartmentCount"]) > 1 ? "Multi-Departmental" : fileModel.DepartmentNames;
                            files.Add(fileModel);
                        }
                    }
                }
            }
            return files;
        }
        public List<FileModel> GetFilesByType(string fileType, DateTime? fromDate = null)
        {
            var files = new List<FileModel>();
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var query = @"
        SELECT 
            f.FileID, 
            f.SystemID, 
            f.FileName, 
            f.FileType, 
            f.FileCategory,
            f.Added_Date,
            s.SystemName,
            LISTAGG(d.DepartmentName, ', ') WITHIN GROUP (ORDER BY d.DepartmentName) AS DepartmentNames,
            COUNT(d.DepartmentID) AS DepartmentCount
        FROM 
            Files f
        JOIN 
            Systems s ON f.SystemID = s.SystemID
        LEFT JOIN 
            System_Departments sd ON s.SystemID = sd.SystemID
        LEFT JOIN 
            Departments d ON sd.DepartmentID = d.DepartmentID AND d.IS_DELETED = 0
        WHERE 
            s.IS_DELETED = 0 
            AND f.IS_DELETED = 0
            AND f.FileType = :fileType
            AND EXISTS (
                SELECT 1 
                FROM System_Departments sd
                JOIN Departments d ON sd.DepartmentID = d.DEPARTMENTID
                WHERE sd.SystemID = s.SystemID AND d.IS_DELETED = 0
            )";

                if (fromDate.HasValue)
                {
                    query += " AND f.Added_Date >= :fromDate";
                }

                query += @"
        GROUP BY 
            f.FileID, f.SystemID, f.FileName, f.FileType, f.FileCategory, f.Added_Date, s.SystemName
        ORDER BY 
            f.Added_Date DESC";

                using (var command = new OracleCommand(query, connection))
                {
                    command.Parameters.Add(new OracleParameter("fileType", fileType));
                    if (fromDate.HasValue)
                    {
                        command.Parameters.Add(new OracleParameter("fromDate", fromDate.Value));
                    }

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var fileModel = new FileModel
                            {
                                FileID = Convert.ToInt32(reader["FileID"]),
                                SystemID = Convert.ToInt32(reader["SystemID"]),
                                FileName = reader["FileName"].ToString(),
                                FileType = reader["FileType"] != DBNull.Value ? reader["FileType"].ToString() : string.Empty,
                                FileCategory = reader["FileCategory"] != DBNull.Value ? reader["FileCategory"].ToString() : string.Empty,
                                AddedDate = reader["Added_Date"] != DBNull.Value ? Convert.ToDateTime(reader["Added_Date"]) : (DateTime?)null,
                                System = new SystemModel
                                {
                                    SystemID = Convert.ToInt32(reader["SystemID"]),
                                    SystemName = reader["SystemName"].ToString()
                                },
                                DepartmentNames = reader["DepartmentNames"].ToString()
                            };

                            fileModel.DepartmentName = Convert.ToInt32(reader["DepartmentCount"]) > 1 ? "Multi-Departmental" : fileModel.DepartmentNames;
                            files.Add(fileModel);
                        }
                    }
                }
            }
            return files;
        }

        public void SaveFileRecords(List<FileModel> fileRecords)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();

                foreach (var file in fileRecords)
                {
                    var query = @"
                    INSERT INTO Files (
                        FileID, 
                        SystemID, 
                        FileName, 
                        FileType, 
                        FileCategory, 
                        Added_Date, 
                        Added_Time, 
                        IS_DELETED,
                        UniqueFileIdentifier
                    ) VALUES (
                        FILES_SEQ.NEXTVAL, 
                        :SystemID, 
                        :FileName, 
                        :FileType, 
                        :FileCategory, 
                        :Added_Date, 
                        :Added_Time, 
                        :IS_DELETED,
                        :UniqueFileIdentifier
                    )";

                    using (var command = new OracleCommand(query, connection))
                    {
                        command.Parameters.Add(new OracleParameter("SystemID", file.SystemID));
                        command.Parameters.Add(new OracleParameter("FileName", file.FileName));
                        command.Parameters.Add(new OracleParameter("FileType", file.FileType));
                        command.Parameters.Add(new OracleParameter("FileCategory", file.FileCategory));
                        command.Parameters.Add(new OracleParameter("Added_Date", file.AddedDate));
                        command.Parameters.Add(new OracleParameter("Added_Time", file.AddedTime));
                        command.Parameters.Add(new OracleParameter("IS_DELETED", file.IsDeleted));
                        command.Parameters.Add(new OracleParameter("UniqueFileIdentifier", file.UniqueFileIdentifier));

                        command.ExecuteNonQuery();
                    }
                }
            }
        }
    }
}