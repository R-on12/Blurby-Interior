export interface Project {
  id: string;
  title: string;
  category: string;
  img: string;
  createdAt: any;
  updatedAt?: any;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  img: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  space: string;
  date: string;
  status: "Confirmed" | "Pending" | "Consultation";
  createdAt: any;
}

export interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  messageText: string;
  status: "active" | "replied" | "archived";
  createdAt: any;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  desc: string;
  content: string;
  img: string;
  status: "draft" | "published";
  createdAt: any;
}

export interface Designer {
  id: string;
  name: string;
  role: string;
  location: string;
  createdAt: any;
}
