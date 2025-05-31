import { useState } from "react";
import { useComplaintContext } from "../context/ComplaintContext";

const categories = ["Academics", "Micro Campus", "Hostel Life", "Placement"];

export default function ComplaintForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    tags: "",
    authority: "",
    urgency: "Medium",
    anonymous: false,
  });

  const { addComplaint } = useComplaintContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    addComplaint(form);
    alert("Complaint submitted!");
    setForm({ ...form, title: "", description: "", tags: "", authority: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* inputs... */}
      <input className="p-2 border w-full" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea className="p-2 border w-full" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select className="p-2 border w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input className="p-2 border w-full" placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
      <input className="p-2 border w-full" placeholder="Suggested Authority" value={form.authority} onChange={(e) => setForm({ ...form, authority: e.target.value })} />
      <div className="flex gap-4">
        <label>Urgency:</label>
        {["High", "Medium", "Low"].map((u) => (
          <label key={u}>
            <input type="radio" name="urgency" value={u} checked={form.urgency === u} onChange={(e) => setForm({ ...form, urgency: e.target.value })} /> {u}
          </label>
        ))}
      </div>
      <label>
        <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
        Submit Anonymously
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
