export default function EarningsSkeleton() {
  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-96 max-w-full bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Top Cards */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg p-6 animate-pulse">
          <div className="h-5 w-32 bg-gray-600 rounded mb-2" />
          <div className="h-10 w-40 bg-gray-600 rounded mb-4" />
          <div className="h-12 w-full bg-gray-600 rounded-lg mb-2" />
          <div className="h-10 w-48 bg-gray-600 rounded-lg mx-auto" />
        </div>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl py-5 px-4 border border-[#D6D6D6] animate-pulse"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-lg mb-4" />
            <div className="h-3 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </section>

      {/* Chart */}
      <div className="bg-white rounded-xl p-4 border border-[#D6D6D6] mb-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-28 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-[400px] bg-gray-100 rounded-lg" />
      </div>

      {/* Bottom Row */}
      <section className="flex flex-col xl:flex-row mt-6 gap-6">
        <div className="xl:w-[59%] w-full bg-white rounded-lg p-6 border border-[#D6D6D6] animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="xl:w-[39%] w-full bg-white rounded-lg p-6 border border-[#D6D6D6] animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-56 bg-gray-200 rounded mb-6" />
          <div className="h-64 bg-gray-100 rounded-lg" />
        </div>
      </section>
    </section>
  );
}
