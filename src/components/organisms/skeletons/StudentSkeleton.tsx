export default function StudentSkeleton() {
  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6">
        <div>
          <div className="h-7 w-56 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-gray-100 rounded-md animate-pulse mt-2" />
        </div>
        <div className="mt-4 xl:mt-0 flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-28 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* CTA banner */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-2xl p-6 md:p-8 animate-pulse">
          <div className="h-6 w-64 bg-gray-300 rounded-lg mb-3" />
          <div className="h-4 w-80 max-w-full bg-gray-300 rounded mb-4" />
          <div className="h-10 w-40 bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl py-5 px-4 border border-[#D6D6D6] animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
            <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-7 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart + Exams grid */}
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-4 border border-[#D6D6D6] animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-8 w-28 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-[400px] bg-gray-100 rounded-lg" />
          </div>
        </div>
        <div>
          <div className="bg-white flex flex-col h-full rounded-xl p-4 border border-[#D6D6D6] animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="grid flex-1 grid-cols-2 gap-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="border border-[#D6D6D6] rounded-[1rem] p-4 h-full flex flex-col justify-center items-center gap-2"
                  >
                    <div className="h-5 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded-full" />
                  </div>
                ))}
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded mt-4 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
