export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">

      {/* Category */}
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={filters.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Academics">Academics</option>
        <option value="Hostel Life">Hostel Life</option>
      </select>

      {/* Department */}
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={filters.department}
        onChange={(e) => onChange("department", e.target.value)}
      >
        <option value="All">All Departments</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mechanical">Mechanical</option>
      </select>

      {/* Status */}
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={filters.status}
        onChange={(e) => onChange("status", e.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="RESOLVED">Resolved</option>
        <option value="ESCALATED">Escalated</option>
      </select>

      {/* Search */}
      <input
        type="text"
        placeholder="Search complaints..."
        className="bg-gray-700 text-white p-2 rounded w-48"
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      {/* Sort */}
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={filters.sort}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="mostUpvoted">Most Upvoted</option>
        <option value="mostCommented">Most Commented</option>
      </select>

      {/* Levels */}
      <select
        className="bg-gray-700 text-white p-2 rounded"
        value={filters.level}
        onChange={(e) => onChange("level", e.target.value)}
      >
        <option value="All">All Levels</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
        <option value="4">Level 4</option>
      </select>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Reset
      </button>
      
    </div>
  );
}
