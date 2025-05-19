import { useContext, useState, useEffect } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import ComplaintCard from "../components/ComplaintCard";
import FilterBar from "../components/FilterBar";
import ComplaintDetail from "../components/ComplaintDetail";
import ComplaintForm from "../components/ComplaintForm";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  const { complaints } = useContext(ComplaintContext);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    department: "All",
    status: "All",
    search: "",
    sort: "newest",
    level: "All",
  });

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "All",
      department: "All",
      status: "All",
      search: "",
      sort: "newest",
      level: "All",
    });
  };

  let filtered = complaints.filter((c) => {
    const matchCategory = filters.category === "All" || c.category === filters.category;
    const matchDepartment = filters.department === "All" || c.department === filters.department;
    const matchStatus = filters.status === "All" || c.status === filters.status;
    const matchSearch =
      c.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      c.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchLevel = filters.level === "All" || c.level?.toString() === filters.level;

    return matchCategory && matchDepartment && matchStatus && matchSearch && matchLevel;
  });

  filtered.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "mostUpvoted":
        return b.upvotes - a.upvotes;
      case "mostCommented":
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-950 min-h-screen text-white px-8 py-6 relative">
      <div className={`transition-all duration-300 ${selectedComplaint || showForm ? 'blur-sm' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Complaints Dashboard</h1>
            <p className="text-gray-400">View and manage all complaint submissions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Submit Complaint
          </button>
        </div>

        <FilterBar filters={filters} onChange={handleFilterChange} onReset={resetFilters} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {filtered.map((complaint) => (
            <div
              key={complaint.id}
              onClick={() => setSelectedComplaint(complaint)}
              className="cursor-pointer transform hover:scale-102 transition-transform"
            >
              <ComplaintCard complaint={complaint} />
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 bg-gray-800 rounded-xl p-6">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Submit New Complaint</h2>
            <ComplaintForm onSubmit={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Close
            </button>
            <ComplaintDetail complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
          </div>
        </div>
      )}
    </div>
  );
}