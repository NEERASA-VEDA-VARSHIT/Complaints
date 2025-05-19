import { useContext, useState, useEffect } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import ComplaintDetail from "../components/ComplaintDetail";
import { FaChartBar, FaUsersCog, FaTags, FaFileExport } from "react-icons/fa";

export default function AdminDashboard() {
  const { complaints, setComplaints } = useContext(ComplaintContext);
  const [filter, setFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("complaints");
  const [stats, setStats] = useState({
    totalComplaints: 0,
    unresolvedOld: 0,
    topCategories: [],
    topAuthorities: []
  });

  useEffect(() => {
    // Calculate dashboard stats
    setStats({
      totalComplaints: complaints.length,
      unresolvedOld: complaints.filter(c => 
        c.status !== "RESOLVED" && c.daysAgo > 14
      ).length,
      topCategories: getTopCategories(),
      topAuthorities: getTopAuthorities()
    });
  }, [complaints]);

  const getTopCategories = () => {
    const categories = {};
    complaints.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getTopAuthorities = () => {
    const authorities = {};
    complaints.forEach(c => {
      if (c.assignedTo) {
        authorities[c.assignedTo] = (authorities[c.assignedTo] || 0) + 1;
      }
    });
    return Object.entries(authorities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const filtered = complaints.filter((c) =>
    filter === "All" ? true : c.status === filter
  );

  const handleStatusChange = (id, newStatus) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplaints(updated);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      complaints.map(c => 
        [c.id, c.title, c.status, c.category, c.department, c.daysAgo].join(",")
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "complaints.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen relative">
      <div className={selectedComplaint ? 'blur-sm' : ''}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("complaints")}
              className={`px-4 py-2 rounded ${
                activeTab === "complaints" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <FaUsersCog className="inline mr-2" />
              Complaints
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded ${
                activeTab === "stats" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <FaChartBar className="inline mr-2" />
              Statistics
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded ${
                activeTab === "settings" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <FaTags className="inline mr-2" />
              Settings
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              <FaFileExport className="inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {activeTab === "complaints" && (
          <>
            <div className="mb-4 flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="All">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            <div className="grid gap-4">
              {filtered.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{complaint.title}</h2>
                      <p className="text-gray-400 text-sm">{complaint.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          complaint.status === 'RESOLVED' ? 'bg-green-600' :
                          complaint.status === 'ESCALATED' ? 'bg-red-600' :
                          complaint.status === 'IN PROGRESS' ? 'bg-yellow-600' :
                          'bg-blue-600'
                        }`}>
                          {complaint.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          complaint.urgency === 'High' ? 'bg-red-600' :
                          complaint.urgency === 'Medium' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}>
                          {complaint.urgency}
                        </span>
                      </div>
                    </div>

                    <select
                      value={complaint.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(complaint.id, e.target.value);
                      }}
                      className="bg-gray-600 text-white px-3 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="ESCALATED">Escalated</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Total Complaints</p>
                  <p className="text-2xl font-bold">{stats.totalComplaints}</p>
                </div>
                <div>
                  <p className="text-gray-400">Unresolved >14 days</p>
                  <p className="text-2xl font-bold text-red-500">{stats.unresolvedOld}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
              <div className="space-y-2">
                {stats.topCategories.map(([category, count]) => (
                  <div key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Top Authorities</h2>
              <div className="space-y-2">
                {stats.topAuthorities.map(([authority, count]) => (
                  <div key={authority} className="flex justify-between">
                    <span>{authority}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Departments</h2>
              <div className="space-y-2">
                {/* Department management UI */}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {/* Category management UI */}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Escalation Rules</h2>
              <div className="space-y-2">
                {/* Escalation rules UI */}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Close
            </button>
            <ComplaintDetail
              complaint={selectedComplaint}
              onClose={() => setSelectedComplaint(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}