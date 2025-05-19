import ComplaintForm from "../components/ComplaintForm";

export default function SubmitComplaint() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a Complaint</h1>
      <ComplaintForm />
    </div>
  );
}
