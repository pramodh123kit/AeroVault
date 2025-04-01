using System.Collections.Generic;
using System.Threading.Tasks;
using AeroVault.Data;
using AeroVault.Models;

namespace AeroVault.Business
{
    public class AdminOverviewBl
    {
        private readonly SystemDl _systemDl;
        private readonly AdminOverviewDl _adminOverviewDl; 

        public AdminOverviewBl(SystemDl systemDl, AdminOverviewDl adminOverviewDl)
        {
            _systemDl = systemDl ?? throw new ArgumentNullException(nameof(systemDl));
            _adminOverviewDl = adminOverviewDl ?? throw new ArgumentNullException(nameof(adminOverviewDl)); 
        }

        public async Task<List<SystemModel>> GetSystems(DateTime? fromDate = null)
        {
            if (fromDate.HasValue)
            {
                return await _systemDl.GetSystemsAddedAfterAsync(fromDate.Value);
            }
            return await _systemDl.GetAllSystemsAsync(); 
        }

        public async Task<List<StaffLogin>> GetStaffLoginTimesAsync()
        {
            return await _adminOverviewDl.GetStaffLoginTimesAsync();
        }
    }
}