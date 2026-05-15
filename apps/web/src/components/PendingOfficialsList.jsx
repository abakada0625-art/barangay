// Admin component to manage pending official approvals
// Add this to the AdminView component in /apps/web/src/app/page.jsx

export function PendingOfficialsList({ pendingOfficials, onApprove, onReject, loading }) {
  if (pendingOfficials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <p className="text-gray-500">No pending official approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingOfficials.map((official) => (
        <div
          key={official.id}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{official.name}</h3>
            <p className="text-sm text-gray-500">{official.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Applied: {new Date(official.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(official.id)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(official.id)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
