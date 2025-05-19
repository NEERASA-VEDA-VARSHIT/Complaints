import { useState, useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";
import { FaThumbsUp, FaUserCircle, FaEdit, FaSave } from "react-icons/fa";

export default function ComplaintDetail({ complaint: initialComplaint, onClose }) {
  const { complaints, setComplaints } = useContext(ComplaintContext);
  const [complaint, setComplaint] = useState(initialComplaint);
  const [isEditing, setIsEditing] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [editForm, setEditForm] = useState({
    status: complaint?.status || "OPEN",
    department: complaint?.department || "",
    assignedTo: complaint?.assignedTo || "",
    level: complaint?.level || "1",
  });

  if (!complaint) {
    return (
      <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 text-center">
        <p>Loading complaint details...</p>
      </div>
    );
  }

  const handleUpvote = () => {
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
    setComplaint(updated.find((c) => c.id === complaint.id));
  };

  const handleAddComment = () => {
    if (commentInput.trim() === "") return;
    const updatedComplaints = complaints.map((c) => {
      if (c.id === complaint.id) {
        return {
          ...c,
          comments: [...(c.comments || []), {
            text: commentInput,
            author: "Current User",
            createdAt: new Date(),
          }],
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);
    setComplaint(updatedComplaints.find((c) => c.id === complaint.id));
    setCommentInput("");
  };

  const handleAddProgressNote = () => {
    if (progressNote.trim() === "") return;
    const updatedComplaints = complaints.map((c) => {
      if (c.id === complaint.id) {
        return {
          ...c,
          progressNotes: [...(c.progressNotes || []), {
            note: progressNote,
            author: "Current User",
            createdAt: new Date(),
          }],
        };
      }
      return c;
    });
    setComplaints(updatedComplaints);
    setComplaint(updatedComplaints.find((c) => c.id === complaint.id));
    setProgressNote("");
  };

  const handleSaveChanges = () => {
    const updatedComplaints = complaints.map((c) => 
      c.id === complaint.id ? { ...c, ...editForm } : c
    );
    setComplaints(updatedComplaints);
    setComplaint({ ...complaint, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold
              ${complaint.status === 'RESOLVED' ? 'bg-green-600' :
                complaint.status === 'ESCALATED' ? 'bg-orange-500' :
                complaint.status === 'IN PROGRESS' ? 'bg-yellow-500' :
                'bg-blue-600'}`}>
              {complaint.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold
              ${complaint.urgency === 'High' ? 'bg-red-600' :
                complaint.urgency === 'Medium' ? 'bg-yellow-400' :
                'bg-green-400'}`}>
              {complaint.urgency}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FaEdit /> Edit
          </button>
        ) : (
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSave /> Save
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full bg-gray-700 rounded p-2"
            >
              <option>OPEN</option>
              <option>IN PROGRESS</option>
              <option>RESOLVED</option>
              <option>ESCALATED</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              className="w-full bg-gray-700 rounded p-2"
            >
              <option>IT Services</option>
              <option>Maintenance</option>
              <option>Academic Affairs</option>
              <option>Student Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assigned To</label>
            <input
              type="text"
              value={editForm.assignedTo}
              onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
              className="w-full bg-gray-700 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              value={editForm.level}
              onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
              className="w-full bg-gray-700 rounded p-2"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        </div>
      ) : null}

      <p className="text-gray-300 mb-4">{complaint.description}</p>

      <div className="text-sm text-gray-400 mb-4">
        <span>{complaint.category} · </span>
        <span>{complaint.department} · </span>
        <span>{complaint.daysAgo} days ago</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <FaUserCircle className="text-gray-400" />
        <span>{complaint.anonymous ? "Anonymous" : complaint.name}</span>
      </div>

      <button
        onClick={handleUpvote}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          complaint.likedByMe ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <FaThumbsUp /> {complaint.upvotes} Upvotes
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Progress Notes</h2>
        <div className="space-y-4 mb-4 max-h-40 overflow-y-auto">
          {complaint.progressNotes && complaint.progressNotes.length > 0 ? (
            complaint.progressNotes.map((note, idx) => (
              <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <FaUserCircle />
                  <span>{note.author}</span>
                  <span>·</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{note.note}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No progress notes yet.</p>
          )}
        </div>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={progressNote}
            onChange={(e) => setProgressNote(e.target.value)}
            placeholder="Add a progress note..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleAddProgressNote}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Add Note
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
          {complaint.comments && complaint.comments.length > 0 ? (
            complaint.comments.map((comment, idx) => (
              <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <FaUserCircle />
                  <span>{comment.author}</span>
                  <span>·</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No comments yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
}