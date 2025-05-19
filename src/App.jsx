import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import SubmitComplaint from "./pages/SubmitComplaint";
import Dashboard from "./pages/Dashboard";
import ComplaintDetail from "./components/ComplaintDetail";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Import Admin Panel
import { ComplaintProvider } from "./context/ComplaintContext";

export default function App() {
  return (
    <ComplaintProvider>
      <Router>
        <nav className="bg-blue-600 text-white p-4 flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/submit">Submit Complaint</Link>
          <Link to="/admin">Admin Panel</Link> {/* ✅ Admin Link */}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaint/:id" element={<ComplaintDetail />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* ✅ Admin Route */}
        </Routes>
      </Router>
    </ComplaintProvider>
  );
}
