import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Project } from "./types";

// Sample project data
export const sampleProjects: Project[] = [
  {
    id: "1",
    name: "City Center Redevelopment",
    description:
      "A major urban renewal project focusing on revitalizing the downtown area with mixed-use buildings, public spaces, and improved infrastructure.",
    status: "In Progress",
    progress: 65,
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "Manhattan, New York, NY",
    },
    budget: 12500000,
    startDate: "2023-03-15",
    endDate: "2025-07-30",
    manager: "Sarah Johnson",
    team: ["Alex Wong", "Maria Garcia", "John Smith", "Emily Davis"],
    tags: ["Urban Renewal", "Commercial", "Residential"],
    images: [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
      "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg",
      "https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg",
    ],
    videos: [
      {
        title: "Project Overview",
        url: "https://example.com/videos/city-center-overview.mp4",
        thumbnail:
          "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg",
      },
      {
        title: "Construction Progress - Q2 2023",
        url: "https://example.com/videos/city-center-q2-2023.mp4",
        thumbnail:
          "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
      },
    ],
    monthlyProgress: [
      { month: "Jan", progress: 10 },
      { month: "Feb", progress: 20 },
      { month: "Mar", progress: 30 },
      { month: "Apr", progress: 40 },
      { month: "May", progress: 50 },
      { month: "Jun", progress: 65 },
    ],
  },
  {
    id: "2",
    name: "Riverside Park Extension",
    description:
      "Expansion of the existing riverside park to include new recreational facilities, walking trails, and ecological restoration areas.",
    status: "Planning",
    progress: 25,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "Los Angeles, CA",
    },
    budget: 4750000,
    startDate: "2023-08-10",
    endDate: "2024-09-15",
    manager: "Michael Chen",
    team: ["Lisa Park", "Robert Johnson", "Anita Patel"],
    tags: ["Parks", "Recreation", "Environmental"],
    images: [
      "https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg",
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
      "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg",
    ],
    videos: [
      {
        title: "Riverside Vision",
        url: "https://example.com/videos/riverside-vision.mp4",
        thumbnail:
          "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg",
      },
    ],
    monthlyProgress: [
      { month: "Apr", progress: 5 },
      { month: "May", progress: 15 },
      { month: "Jun", progress: 25 },
    ],
  },
  {
    id: "3",
    name: "Metropolitan Transit Hub",
    description:
      "Construction of a new centralized transit hub connecting multiple transportation systems including subway, bus, and regional rail lines.",
    status: "Approved",
    progress: 10,
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: "Chicago, IL",
    },
    budget: 18900000,
    startDate: "2023-11-01",
    endDate: "2026-12-31",
    manager: "David Wilson",
    team: [
      "Jennifer Adams",
      "Carlos Rodriguez",
      "Samantha Lee",
      "Thomas Brown",
      "Michelle Kim",
    ],
    tags: ["Transportation", "Infrastructure", "Public Works"],
    images: [
      "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
      "https://images.unsplash.com/photo-1680097950597-4337f3f3588a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.pexels.com/photos/2589646/pexels-photo-2589646.jpeg",
    ],
    videos: [
      {
        title: "Transit Hub Design Unveiling",
        url: "https://example.com/videos/transit-hub-design.mp4",
        thumbnail:
          "https://images.pexels.com/photos/745243/pexels-photo-745243.jpeg",
      },
      {
        title: "Community Meeting Highlights",
        url: "https://example.com/videos/transit-community-meeting.mp4",
        thumbnail:
          "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg",
      },
    ],
    monthlyProgress: [
      { month: "May", progress: 5 },
      { month: "Jun", progress: 10 },
    ],
  },
  {
    id: "4",
    name: "Bhendi Bazaar Redevelopment",
    description:
      "A comprehensive urban renewal project aiming to transform the congested Bhendi Bazaar area into a modern, sustainable living space with improved infrastructure and amenities.",
    status: "In Progress",
    progress: 50,
    location: {
      lat: 18.9618,
      lng: 72.8311,
      address: "Bhendi Bazaar, Mumbai, Maharashtra, India",
    },
    budget: 2000000000,
    startDate: "2016-04-01",
    endDate: "2025-12-31",
    manager: "Saifee Burhani Upliftment Trust",
    team: ["Architect Hafeez Contractor", "Larsen & Toubro", "SBUT Engineers"],
    tags: ["Urban Renewal", "Sustainability", "Residential", "Commercial"],
    images: [
      "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1601074231509-dce351c05199?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1558524845-736893ef7dd6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    videos: [
      {
        title: "Bhendi Bazaar Transformation Overview",
        url: "https://example.com/videos/bhendi-bazaar-overview.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1630683924997-fe27050a0416?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "Sustainable Practices in Bhendi Bazaar Redevelopment",
        url: "https://example.com/videos/bhendi-bazaar-sustainability.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    monthlyProgress: [
      { month: "Jan", progress: 45 },
      { month: "Feb", progress: 47 },
      { month: "Mar", progress: 50 },
    ],
  },
];

// ? set all projects into firebase db:-
const addSampleProjects = async () => {
  const projectsCollection = collection(db, "projects");

  for (const project of sampleProjects) {
    const projectRef = doc(projectsCollection, project.id);
    try {
      await setDoc(projectRef, project);
    } catch (error) {
      console.error(`Error adding project ${project.id}:`, error);
    }
  }
};
addSampleProjects();

// ? Function to get all projects (in a real app, this would fetch from Firestore)
export async function getProjects() {
  try {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return projects;
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return []; // Return an empty array or handle the error as needed
  }
}

//? Function to get a single project by ID
export async function getProjectById(id: string) {
  // In a real app, this would be:
  const projectRef = doc(db, "projects", id);
  const projectSnapshot = await getDoc(projectRef);
  if (projectSnapshot.exists()) {
    return { id: projectSnapshot.id, ...projectSnapshot.data() };
  }

  // fallback to sampleProjects if not found in Firestore
  return (
    sampleProjects.find((project) => project.id.toString() === id.toString()) ||
    null
  );
}

// ? Function to search projects by name
export async function searchProjects(searchTerm: string) {
  if (!searchTerm) {
    return await getProjects();
  }

  try {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    );
    const projectsSnapshot = await getDocs(q);
    const results = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // If Firestore returns empty, fallback to sampleProjects
    if (results.length === 0) {
      const searchTermLower = searchTerm.toLowerCase();
      return sampleProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTermLower)
      );
    }

    return results;
  } catch (error) {
    console.error("Error searching projects from Firestore:", error);
    // fallback to sampleProjects
    const searchTermLower = searchTerm.toLowerCase();
    return sampleProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTermLower)
    );
  }
}
