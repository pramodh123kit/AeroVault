namespace AeroVault.Models
{
    public class FileWithViewDetailsModel
    {
        public FileModel File { get; set; }
        public int ViewedCount { get; set; }
        public List<ViewedFileModel> Viewers { get; set; }
    }
}
