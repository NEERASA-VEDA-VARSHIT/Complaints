import ComplaintForm from "../components/ComplaintForm";

export default function SubmitComplaint() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Submit a Complaint</h1>
        <ComplaintForm />
      </div>
    </div>
  );
}