import { useUserStats } from '../../hooks/identity/useUsers';
import { useTokenManagement } from '../../hooks/identity/useUserManagement';

/**
 * Admin Dashboard Component
 * Displays statistics and system management tools
 */
const AdminDashboard = () => {
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useUserStats();
  const { stats: tokenStats, fetchTokenStats, cleanup, isLoading: tokenLoading } = useTokenManagement();

  const handleCleanupTokens = async () => {
    if (!confirm('Are you sure you want to cleanup expired tokens?')) {
      return;
    }

    try {
      await cleanup();
      await fetchTokenStats();
      alert('Tokens cleaned up successfully!');
    } catch (err) {
      console.error('Failed to cleanup tokens:', err);
      alert('Failed to cleanup tokens');
    }
  };

  const handleLoadTokenStats = async () => {
    try {
      await fetchTokenStats();
    } catch (err) {
      console.error('Failed to load token stats:', err);
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* User Statistics */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Statistics</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {stats ? (
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-gray-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalUsers || 0}
                  </dd>
                </div>
                <div className="bg-green-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-green-800">Active Users</dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-900">
                    {stats.activeUsers || 0}
                  </dd>
                </div>
                <div className="bg-red-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-red-800">Suspended Users</dt>
                  <dd className="mt-1 text-3xl font-semibold text-red-900">
                    {stats.suspendedUsers || 0}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">No statistics available</p>
            )}
          </div>
        </div>

        {/* Token Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Token Management</h3>
            <div className="space-x-2">
              <button
                onClick={handleLoadTokenStats}
                disabled={tokenLoading}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {tokenLoading ? 'Loading...' : 'Load Stats'}
              </button>
              <button
                onClick={handleCleanupTokens}
                disabled={tokenLoading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                Cleanup Expired Tokens
              </button>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {tokenStats ? (
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-gray-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Total Tokens</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {tokenStats.totalTokens || 0}
                  </dd>
                </div>
                <div className="bg-blue-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-blue-800">Active Tokens</dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-900">
                    {tokenStats.activeTokens || 0}
                  </dd>
                </div>
                <div className="bg-yellow-50 px-4 py-5 rounded-lg">
                  <dt className="text-sm font-medium text-yellow-800">Expired Tokens</dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-900">
                    {tokenStats.expiredTokens || 0}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">Click &quot;Load Stats&quot; to view token statistics</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
