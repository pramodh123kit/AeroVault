using System.Collections.Generic;
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
        public List<DepartmentModel> GetNonDeletedDepartments()
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var command = new OracleCommand("SELECT * FROM DEPARTMENTS WHERE IS_DELETED = 0", connection);
                var reader = command.ExecuteReader();

                var departments = new List<DepartmentModel>();
                while (reader.Read())
                {
                    departments.Add(new DepartmentModel
                    {
                        DepartmentID = reader.GetInt32(0),
                        DepartmentName = reader.GetString(1),
                        DivisionID = reader.GetInt32(2),
                        IsDeleted = reader.GetInt32(3)
                    });
                }
                return departments;
            }
        }
        public List<SystemModel> GetNonDeletedSystemsByDepartment(int departmentId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var command = new OracleCommand(@"
            SELECT s.SYSTEMID, 
                   s.SYSTEMNAME, 
                   s.DESCRIPTION, 
                   s.IS_DELETED,
                   (SELECT COUNT(*) FROM Files f WHERE f.SystemID = s.SYSTEMID AND f.IS_DELETED = 0 AND f.FileType = 'Video') AS VideoCount,
                   (SELECT COUNT(*) FROM Files f WHERE f.SystemID = s.SYSTEMID AND f.IS_DELETED = 0 AND f.FileType = 'Document') AS DocCount
            FROM SYSTEMS s 
            JOIN SYSTEM_DEPARTMENTS sd ON s.SYSTEMID = sd.SYSTEMID 
            WHERE sd.DEPARTMENTID = :departmentId AND s.IS_DELETED = 0", connection);
                command.Parameters.Add(new OracleParameter("departmentId", departmentId));
                var reader = command.ExecuteReader();

                var systems = new List<SystemModel>();
                while (reader.Read())
                {
                    systems.Add(new SystemModel
                    {
                        SystemID = reader.GetInt32(0),
                        SystemName = reader.GetString(1),
                        Description = reader.GetString(2),
                        IsDeleted = reader.GetInt32(3),
                        VideoCount = reader.GetInt32(4), 
                        DocCount = reader.GetInt32(5) 
                    });
                }
                return systems;
            }
        }


        public List<FileModel> GetDocumentsBySystem(int systemId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var command = new OracleCommand("SELECT * FROM Files WHERE SystemID = :systemId AND FileType = 'Document' AND IS_DELETED = 0", connection);
                command.Parameters.Add(new OracleParameter("systemId", systemId));
                var reader = command.ExecuteReader();

                var documents = new List<FileModel>();
                while (reader.Read())
                {
                    documents.Add(new FileModel
                    {
                        FileID = reader.GetInt32(0),
                        SystemID = reader.GetInt32(1),
                        FileName = reader.GetString(2),
                        FileType = reader.GetString(3),
                        FileCategory = reader.GetString(4),
                        // Correctly retrieve the date
                        AddedDate = reader.IsDBNull(5) ? (DateTime?)null : reader.GetOracleDate(5).Value,
                        // Add other properties as needed
                    });
                }
                return documents;
            }
        }

        public List<FileModel> GetVideosBySystem(int systemId)
        {
            using (var connection = new OracleConnection(_connectionString))
            {
                connection.Open();
                var command = new OracleCommand("SELECT * FROM Files WHERE SystemID = :systemId AND FileType = 'Video' AND IS_DELETED = 0", connection);
                command.Parameters.Add(new OracleParameter("systemId", systemId));
                var reader = command.ExecuteReader();

                var videos = new List<FileModel>();
                while (reader.Read())
                {
                    videos.Add(new FileModel
                    {
                        FileID = reader.GetInt32(0),
                        SystemID = reader.GetInt32(1),
                        FileName = reader.GetString(2), // Ensure this is the correct column for the file name
                        FileType = reader.GetString(3), // Ensure this is the correct column for the file type
                        FileCategory = reader.GetString(4), // Ensure this is the correct column for the file category
                        AddedDate = reader.IsDBNull(5) ? (DateTime?)null : reader.GetOracleDate(5).Value,
                        // Add other properties as needed
                    });
                }
                return videos;
            }
        }
    }
}