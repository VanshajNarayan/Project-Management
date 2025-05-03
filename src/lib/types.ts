export interface Project {
  id: string;
  name: string;
  description: string;
  status: "In Progress" | "Planning" | "Completed" | "On Hold" | "Approved";
  progress: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  budget: number;
  startDate: string;
  endDate: string;
  manager: string;
  team: string[];
  tags: string[];
  images: string[];
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  monthlyProgress: {
    month: string;
    progress: number;
  }[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
