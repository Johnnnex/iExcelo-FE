const ReferralsSkeleton = () => {
  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Top row */}
      <div className="flex mb-6.5 gap-[1rem]">
        <div className="w-[70%] h-42.5 bg-gray-800/20 rounded-[.5rem] animate-pulse" />
        <div
          style={{
            boxShadow:
              "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
          }}
          className="w-[30%] h-42.5 rounded-[.5rem] animate-pulse p-5 flex flex-col justify-between"
        >
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid mb-6 grid-cols-3 gap-[1rem]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border rounded-[.75rem] p-[1.25rem_1rem] border-[#D6D6D6] animate-pulse flex flex-col gap-2"
          >
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-9 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
        }}
        className="rounded-[.625rem] overflow-hidden pt-4 animate-pulse"
      >
        <div className="px-4 pb-3 border-b border-gray-100 flex gap-2 items-center">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-8 bg-gray-100 rounded-full" />
        </div>
        <div className="p-4 space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between gap-4">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferralsSkeleton;
