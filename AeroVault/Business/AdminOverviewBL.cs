using AeroVault.Data;
using AeroVault.Models;

namespace AeroVault.Business
{
    public class AdminOverviewBl
    {
        private readonly SystemDl _systemDl;

        public AdminOverviewBl(SystemDl systemDl)
        {
            _systemDl = systemDl ?? throw new ArgumentNullException(nameof(systemDl));
        }

        public async Task<List<SystemModel>> GetSystems(DateTime? fromDate = null)
        {
            if (fromDate.HasValue)
            {
                return await _systemDl.GetSystemsAddedAfterAsync(fromDate.Value);
            }
            return await _systemDl.GetAllSystemsAsync(); // Return all if no date is provided
        }
    }
}
