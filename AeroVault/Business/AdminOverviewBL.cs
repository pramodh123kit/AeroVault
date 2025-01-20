using AeroVault.Data;
using AeroVault.Models;

namespace AeroVault.Business
{
    public class AdminOverviewBL
    {
        private readonly SystemRepository _systemRepository;

        public AdminOverviewBL(SystemRepository systemRepository)
        {
            _systemRepository = systemRepository ?? throw new ArgumentNullException(nameof(systemRepository));
        }

        public async Task<List<SystemModel>> GetSystems(DateTime? fromDate = null)
        {
            if (fromDate.HasValue)
            {
                return await _systemRepository.GetSystemsAddedAfterAsync(fromDate.Value);
            }
            return await _systemRepository.GetAllSystemsAsync(); // Return all if no date is provided
        }
    }
}
