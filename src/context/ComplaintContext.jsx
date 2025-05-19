import { createContext, useContext, useState } from "react";

export const ComplaintContext = createContext();


export function useComplaintContext() {
  return useContext(ComplaintContext);
}

const initialComplaints = [
  {
    id: 1,
    title: "Water leakage in hostel washroom",
    description: "The washroom in Block C has a consistent water leak from the ceiling.",
    category: "Hostel Life",
    department: "Maintenance",
    status: "OPEN",
    urgency: "High",
    daysAgo: 2,
    anonymous: false,
    name: "Vikram M",
    upvotes: 12,
    likedByMe: false,
    comments: 3,
  },
  {
    id: 2,
    title: "No WiFi in 3rd floor classrooms",
    description: "WiFi is not accessible during lectures in the new building's top floor.",
    category: "Academics",
    department: "IT Services",
    status: "ESCALATED",
    urgency: "Medium",
    daysAgo: 8,
    anonymous: true,
    name: "",
    upvotes: 20,
    likedByMe: false,
    comments: 5,
  },
  {
    id: 3,
    title: "Mess food quality is deteriorating",
    description: "The food being served is not fresh, and there are hygiene concerns.",
    category: "Hostel Life",
    department: "Mess Committee",
    status: "IN PROGRESS",
    urgency: "High",
    daysAgo: 5,
    anonymous: false,
    name: "Ayesha R",
    upvotes: 32,
    likedByMe: false,
    comments: 10,
  },
  {
    id: 4,
    title: "Broken benches in seminar hall",
    description: "Several benches are broken and unusable in Hall B.",
    category: "Campus Infrastructure",
    department: "General Admin",
    status: "RESOLVED",
    urgency: "Low",
    daysAgo: 15,
    anonymous: true,
    name: "",
    upvotes: 7,
    likedByMe: false,
    comments: 1,
  },
];

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(initialComplaints);

  return (
    <ComplaintContext.Provider value={{ complaints, setComplaints }}>
      {children}
    </ComplaintContext.Provider>
  );
}
