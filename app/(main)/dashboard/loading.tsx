export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Key Metrics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stock Levels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="h-48 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
