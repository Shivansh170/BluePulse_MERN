export default function AdminHero({ name }) {
  return (
    <>
      {/* Welcome Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-[#005c]">Welcome, {name}</h2>
        <p className="text-gray-600 text-lg">
          Here’s what’s happening in India's water bodies today.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#005c]">
          <h3 className="text-gray-500">Total Water Bodies</h3>
          <p className="text-3xl font-bold">42</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#24C6DC]">
          <h3 className="text-gray-500">Total Surveys</h3>
          <p className="text-3xl font-bold">230</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-[#363795]">
          <h3 className="text-gray-500">Active Surveyors</h3>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="bg-white shadow-xl p-6 rounded-xl border-l-4 border-red-500">
          <h3 className="text-gray-500">Critical Alerts</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>

      {/* Alerts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Alerts Box */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-[#363795] mb-4">
            Critical Alerts
          </h3>

          <ul className="space-y-3">
            <li className="bg-red-100 p-4 rounded-lg shadow">
              <strong>Yamuna Ghat:</strong> High turbidity (75 NTU)
            </li>
            <li className="bg-red-100 p-4 rounded-lg shadow">
              <strong>Naini Lake:</strong> Low pH (5.1)
            </li>
          </ul>
        </div>

        {/* Recent Surveys Box */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h3 className="text-2xl font-semibold text-[#24C6DC] mb-4">
            Recent Surveys
          </h3>

          <ul className="space-y-3">
            <li className="bg-blue-50 p-4 rounded-lg shadow">
              Rohan surveyed Hauz Khas – pH 7.1, Turbidity 12
            </li>
            <li className="bg-blue-50 p-4 rounded-lg shadow">
              Priya surveyed Bindapur – pH 6.3, Turbidity 33
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
