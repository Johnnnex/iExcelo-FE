import { Icon } from "@iconify/react";

export default function Admin() {
  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage users, content, and platform performance from one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon icon="hugeicons:user-01" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Admins</p>
            <p className="text-lg font-semibold text-gray-900">5</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Icon
              icon="hugeicons:users-group-rounded"
              className="w-5 h-5 text-green-600"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Students</p>
            <p className="text-lg font-semibold text-gray-900">1,240</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Icon
              icon="hugeicons:chart-column-01"
              className="w-5 h-5 text-orange-500"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Exams</p>
            <p className="text-lg font-semibold text-gray-900">18</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Platform Overview
        </h2>
        <p className="text-sm text-gray-500">
          Placeholder layout – we&apos;ll plug in your admin charts, tables, and
          quick actions according to the Figma design.
        </p>
      </div>
    </section>
  );
}
