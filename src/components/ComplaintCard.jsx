import { FaComment, FaUserCircle, FaThumbsUp } from "react-icons/fa";
import { useComplaintContext } from "../context/ComplaintContext";
import { useNavigate } from "react-router-dom";

export default function ComplaintCard({ complaint }) {
  const { complaints, setComplaints } = useComplaintContext();
  const navigate = useNavigate();

  const statusColors = {
    RESOLVED: "bg-green-600",
    ESCALATED: "bg-orange-500",
    "IN PROGRESS": "bg-yellow-500",
    OPEN: "bg-blue-600",
  };

  const urgencyColors = {
    High: "bg-red-600",
    Medium: "bg-yellow-400",
    Low: "bg-green-400",
  };

  const handleUpvote = (e) => {
  e.stopPropagation();

  const updated = complaints.map((c) => {
    if (c.id === complaint.id) {
      const liked = !c.likedByMe;
      return {
        ...c,
        upvotes: c.upvotes + (liked ? 1 : -1),
        likedByMe: liked,
      };
    }
    return c;
  });

  setComplaints(updated);
  };


  return (
    <div
      onClick={() => navigate(`/complaint/${complaint.id}`)}
      className="bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold text-white px-2 py-1 rounded-full ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full text-white ${urgencyColors[complaint.urgency]}`}>
          {complaint.urgency}
        </span>
      </div>

      <h2 className="font-semibold text-lg">{complaint.title}</h2>
      <p className="text-gray-300 text-sm my-2 line-clamp-3">{complaint.description}</p>

      <div className="text-xs text-gray-400 mb-2">
        <span>{complaint.category} · </span>
        <span>{complaint.department} · </span>
        <span>{complaint.daysAgo} days ago</span>
      </div>

      <div className="flex items-center justify-between text-sm mt-4">
        <div className="flex items-center gap-2">
          <FaUserCircle />
          {complaint.anonymous ? "Anonymous" : complaint.name}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 cursor-pointer ${
              complaint.likedByMe ? "text-blue-400" : "text-white"
            }`}
          >
            <FaThumbsUp /> {complaint.upvotes}
          </button>
          <span className="flex items-center gap-1">
            <FaComment /> {complaint.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
