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

        public (int SystemCount, int DocumentCount, int VideoCount) GetDepartmentCounts(string departmentName)
        {
            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                try
                {
                    connection.Open();

                    string query = @"
            SELECT 
                (SELECT COUNT(DISTINCT S.SYSTEMID) 
                 FROM SYSTEMS S
                 JOIN SYSTEM_DEPARTMENTS SD ON S.SYSTEMID = SD.SYSTEMID
                 JOIN DEPARTMENTS D ON SD.DEPARTMENTID = D.DEPARTMENTID
                 WHERE D.DEPARTMENTNAME = :DepartmentName AND S.IS_DELETED = 0) AS SystemCount,
                 
                (SELECT COUNT(*) 
                 FROM FILES F
                 JOIN SYSTEMS S ON F.SYSTEMID = S.SYSTEMID
                 JOIN SYSTEM_DEPARTMENTS SD ON S.SYSTEMID = SD.SYSTEMID
                 JOIN DEPARTMENTS D ON SD.DEPARTMENTID = D.DEPARTMENTID
                 WHERE D.DEPARTMENTNAME = :DepartmentName 
                 AND F.IS_DELETED = 0 
                 AND S.IS_DELETED = 0 
                 AND (F.FileType = 'Document' OR F.FileType = 'pdf')) AS DocumentCount,
                 
                (SELECT COUNT(*) 
                 FROM FILES F
                 JOIN SYSTEMS S ON F.SYSTEMID = S.SYSTEMID
                 JOIN SYSTEM_DEPARTMENTS SD ON S.SYSTEMID = SD.SYSTEMID
                 JOIN DEPARTMENTS D ON SD.DEPARTMENTID = D.DEPARTMENTID
                 WHERE D.DEPARTMENTNAME = :DepartmentName 
                 AND F.IS_DELETED = 0 
                 AND S.IS_DELETED = 0 
                 AND F.FileType = 'Video') AS VideoCount
            FROM DUAL";

                    using (OracleCommand command = new OracleCommand(query, connection))
                    {
                        command.Parameters.Add(":DepartmentName", OracleDbType.Varchar2).Value = departmentName;

                        using (OracleDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return (
                                    SystemCount: reader.GetInt32(0),
                                    DocumentCount: reader.GetInt32(1),
                                    VideoCount: reader.GetInt32(2)
                                );
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
            }

            return (0, 0, 0);
        }

        public List<FileModel> GetRecentFilesByDepartment(string departmentName, int count = 10)
        {
            List<FileModel> recentFiles = new List<FileModel>();

            using (OracleConnection connection = new OracleConnection(_connectionString))
            {
                try
                {
                    connection.Open();

                    string query = @"
            SELECT 
                F.FileID,
                F.FileName,
                F.FileType,
                F.Added_Date,
                S.SystemName,
                F.UniqueFileIdentifier
            FROM 
                FILES F
            JOIN 
                SYSTEMS S ON F.SystemID = S.SystemID
            JOIN 
                SYSTEM_DEPARTMENTS SD ON S.SystemID = SD.SystemID
            JOIN 
                DEPARTMENTS D ON SD.DepartmentID = D.DepartmentID
            WHERE 
                D.DepartmentName = :DepartmentName 
                AND F.IS_DELETED = 0
            ORDER BY 
                F.Added_Date DESC, 
                F.Added_Time DESC
            FETCH FIRST :Count ROWS ONLY";

                    using (OracleCommand command = new OracleCommand(query, connection))
                    {
                        command.Parameters.Add(":DepartmentName", OracleDbType.Varchar2).Value = departmentName;
                        command.Parameters.Add(":Count", OracleDbType.Int32).Value = count;

                        using (OracleDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                recentFiles.Add(new FileModel
                                {
                                    FileID = reader.GetInt32(reader.GetOrdinal("FileID")),
                                    FileName = reader.GetString(reader.GetOrdinal("FileName")),
                                    FileType = reader.GetString(reader.GetOrdinal("FileType")),
                                    AddedDate = reader.GetDateTime(reader.GetOrdinal("Added_Date")),
                                    DepartmentName = departmentName, // From input parameter
                                    UniqueFileIdentifier = reader.IsDBNull(reader.GetOrdinal("UniqueFileIdentifier"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("UniqueFileIdentifier")),
                                    System = new SystemModel
                                    {
                                        SystemName = reader.GetString(reader.GetOrdinal("SystemName"))
                                    }
                                });
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
            }

            return recentFiles;
        }
    }
}

