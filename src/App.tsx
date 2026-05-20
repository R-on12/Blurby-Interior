import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Calendar,
  MessageSquare,
  Sparkles,
  LogOut,
  Send,
  Lock
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  getDocFromServer,
  serverTimestamp 
} from "firebase/firestore";

import { db, auth, OperationType, handleFirestoreError } from "./firebase";
import AdminDashboard from "./components/AdminDashboard";

// Base asset paths (elegant static fallbacks)
const IMAGES = {
  hero: "/src/assets/images/hero_interior_1779113551456.png",
  living: "/src/assets/images/living_room_luxury_1779113572069.png",
  bedroom: "/src/assets/images/bedroom_minimalist_1779113588109.png",
  texture: "/src/assets/images/decor_texture_1779113605166.png",
  dining: "/src/assets/images/dining_high_end_1779113622210.png",
  modern: "/src/assets/images/modern_interior_project_1779114456512.png",
  minimalist: "/src/assets/images/minimalist_hallway_project_1779114476470.png",
  scandinavian: "/src/assets/images/scandinavian_living_project_1779114492169.png",
  luxury: "/src/assets/images/luxury_foyer_project_1779114507957.png",
  contemporary: "/src/assets/images/contemporary_kitchen_project_1779114523300.png",
  planning: "/src/assets/images/space_planning_3d_1779114539721.png",
};

const SERVICES = [
  {
    title: "Residential Interior Design",
    description: "Tailored living spaces that reflect your personal narrative through curated materials and architectural precision.",
    icon: "01"
  },
  {
    title: "Office & Workspace Design",
    description: "Productivity met with silence. We design workspaces that inspire focus and creative clarity.",
    icon: "02"
  },
  {
    title: "Luxury Bedroom Styling",
    description: "Sanctuaries of rest. Focused on soft textures, atmospheric lighting, and high-end comfort.",
    icon: "03"
  },
  {
    title: "Kitchen & Dining Concepts",
    description: "The heart of the home, reimagined as a sculptural center for gathering and culinary art.",
    icon: "04"
  },
  {
    title: "Lighting & Furniture Selection",
    description: "Curated pieces and bespoke lighting plans that define the mood and volume of your space.",
    icon: "05"
  },
  {
    title: "3D Visualization & Planning",
    description: "Bringing your vision to life through high-fidelity artistic renderings and precise spatial strategy.",
    icon: "06"
  }
];

const PORTFOLIO = [
  { id: "p1", title: "The Onyx Suite", category: "Modern", img: IMAGES.modern },
  { id: "p2", title: "Silent Corridors", category: "Minimalist", img: IMAGES.minimalist },
  { id: "p3", title: "Oslo Morning", category: "Scandinavian", img: IMAGES.scandinavian },
  { id: "p4", title: "Grand Atrium", category: "Luxury", img: IMAGES.luxury },
  { id: "p5", title: "The Chef's Canvas", category: "Contemporary", img: IMAGES.contemporary },
  { id: "p6", title: "Visions of Void", category: "Minimalist", img: IMAGES.texture },
  { id: "p7", title: "Echoes of Gold", category: "Luxury", img: IMAGES.dining },
  { id: "p8", title: "Spatial Blueprint", category: "Contemporary", img: IMAGES.planning },
];

const CATEGORIES = ["All", "Modern", "Minimalist", "Scandinavian", "Luxury", "Contemporary"];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"visitor" | "admin">("visitor");
  const [adminSection, setAdminSection] = useState("overview");

  // Firebase auth & collection state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Firestore retrieved datasets
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [designersList, setDesignersList] = useState<any[]>([]);

  // Modals & form overlays states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Client scheduler states
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingSpace, setBookingSpace] = useState("Residential Interior Design");
  const [bookingDate, setBookingDate] = useState("");

  // Client message inquiries states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquirySubject, setInquirySubject] = useState("Maison Living Inquiry");
  const [inquiryText, setInquiryText] = useState("");

  // Feedback notifications (replaces browser alerts for luxury feel)
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [prepopulating, setPrepopulating] = useState(false);

  const triggerToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Connection testing
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("offline")) {
          console.warn("Firestore connection check detected offline state. Standard fallback active.");
        }
      }
    }
    testConnection();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setBookingEmail(user.email || "");
        setBookingName(user.displayName || "");
        setInInquiryEmail(user.email || "");
        setInquiryName(user.displayName || "");
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const setInInquiryEmail = (val: string) => {
    setInquiryEmail(val);
  };

  // Load datasets dynamically with snapshot updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjectsList(projs);
    }, (err) => {
      console.warn("Projects read query fallback:", err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleryList(imgs);
    }, (err) => {
      console.warn("Gallery loading fallback:", err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setBookingsList([]);
      return;
    }
    const isMasterAdmin = currentUser.email === "coopedill@gmail.com";
    const q = isMasterAdmin 
      ? collection(db, "bookings")
      : query(collection(db, "bookings"), where("clientEmail", "==", currentUser.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookingsList(list);
    }, (err) => {
      console.warn("User consultations fetch restriction:", err);
    });
    return () => unsubscribe();
  }, [currentUser?.email]);

  useEffect(() => {
    if (!currentUser || currentUser.email !== "coopedill@gmail.com") {
      setInquiriesList([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, "inquiries"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiriesList(list);
    }, (err) => {
      console.warn("Inquiries snapshot read restriction:", err);
    });
    return () => unsubscribe();
  }, [currentUser?.email]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "blog"), (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogList(posts);
    }, (err) => {
      console.warn("Blog loading fallback:", err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "designers"), (snapshot) => {
      const devs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDesignersList(devs);
    }, (err) => {
      console.warn("Designers loading database error:", err);
    });
    return () => unsubscribe();
  }, []);

  // Google OAuth triggers
  const executeGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      triggerToast("Access Granted: Signed in with Google.");
    } catch (err: any) {
      console.error("Sign in aborted:", err);
      triggerToast(err.message || "Failed authentication.", "error");
    }
  };

  const executeSignOut = async () => {
    try {
      await signOut(auth);
      setView("visitor");
      triggerToast("Signed out. Return soon.");
    } catch (err: any) {
      triggerToast("Error signing out.", "error");
    }
  };

  // Dynamic Pre-population (1-click starter template injection)
  const handlePrepopulateData = async () => {
    if (!currentUser || currentUser.email !== "coopedill@gmail.com") {
      triggerToast("Write Blocked: Pre-populating requires master admin authorization.", "error");
      return;
    }
    try {
      setPrepopulating(true);
      // Staging Projects
      for (const item of PORTFOLIO) {
        const docId = `proj-${item.id}`;
        await setDoc(doc(db, "projects", docId), {
          id: docId,
          title: item.title,
          category: item.category,
          img: item.img,
          createdAt: serverTimestamp()
        });
      }
      // Staging Gallery
      for (const item of PORTFOLIO.slice(0, 4)) {
        const docId = `gal-${item.id}`;
        await setDoc(doc(db, "gallery", docId), {
          id: docId,
          title: item.title,
          category: item.category,
          img: item.img,
          createdAt: serverTimestamp()
        });
      }
      // Staging Team Designers
      const startupDesigners = [
        { id: "des-1", name: "Adrian Blurby", role: "Principal Architect", location: "Milan" },
        { id: "des-2", name: "Elena Solst", role: "Senior Stylist", location: "Paris" },
        { id: "des-3", name: "Thomas Cael", role: "Material Specialist", location: "New York" },
      ];
      for (const d of startupDesigners) {
        await setDoc(doc(db, "designers", d.id), {
          id: d.id,
          name: d.name,
          role: d.role,
          location: d.location,
          createdAt: serverTimestamp()
        });
      }
      triggerToast("Successfully staging starter designers & portfolio details!");
    } catch (err: any) {
      console.error("Database staging error:", err);
      triggerToast("Write Exception: check permissions on rules.", "error");
    } finally {
      setPrepopulating(false);
    }
  };

  // Operations callbacks mapping to security rules
  const publishProject = async (title: string, cat: string, img: string) => {
    const id = "proj-" + Math.floor(1000 + Math.random() * 9000);
    const path = `projects/${id}`;
    try {
      await setDoc(doc(db, "projects", id), {
        id,
        title,
        category: cat,
        img,
        createdAt: serverTimestamp()
      });
      triggerToast(`Added project "${title}" to records.`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeProject = async (id: string) => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, "projects", id));
      triggerToast("Removed project.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const publishGalleryImage = async (title: string, cat: string, img: string) => {
    const id = "gal-" + Math.floor(1000 + Math.random() * 9000);
    const path = `gallery/${id}`;
    try {
      await setDoc(doc(db, "gallery", id), {
        id,
        title,
        category: cat,
        img,
        createdAt: serverTimestamp()
      });
      triggerToast("Added visual showcase detail.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeGalleryImage = async (id: string) => {
    const path = `gallery/${id}`;
    try {
      await deleteDoc(doc(db, "gallery", id));
      triggerToast("Removed image catalog asset.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const scheduleBookingForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Verification Required: Sign in first to schedule consultations.", "error");
      return;
    }
    if (!bookingName || !bookingEmail || !bookingDate) {
      triggerToast("Input Error: Missing scheduled parameters.", "error");
      return;
    }
    const id = "B" + Math.floor(100 + Math.random() * 900);
    const path = `bookings/${id}`;
    try {
      await setDoc(doc(db, "bookings", id), {
        id,
        clientName: bookingName,
        clientEmail: bookingEmail,
        space: bookingSpace,
        date: bookingDate,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      triggerToast("Consultation Scheduled: Your pending phase remains active.");
      setIsBookingOpen(false);
      setBookingDate("");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateBookingState = async (id: string, newStatus: any) => {
    const path = `bookings/${id}`;
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      triggerToast(`Booking status set to "${newStatus}"`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const removeBooking = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await deleteDoc(doc(db, "bookings", id));
      triggerToast("Removed booking archive.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("Verification Required: Sign in to submit luxury specifications.", "error");
      return;
    }
    if (!inquiryName || !inquiryEmail || !inquiryText) {
      triggerToast("Input Error: Clear parameters required.", "error");
      return;
    }
    const id = "inq-" + Math.floor(1000 + Math.random() * 9000);
    const path = `inquiries/${id}`;
    try {
      await setDoc(doc(db, "inquiries", id), {
        id,
        clientName: inquiryName,
        clientEmail: inquiryEmail,
        subject: inquirySubject,
        messageText: inquiryText,
        status: "active",
        createdAt: serverTimestamp()
      });
      triggerToast("Inquiry Forwarded: Assigned code active.");
      setIsInquiryOpen(false);
      setInquiryText("");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateInquiryState = async (id: string, newStatus: string) => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      triggerToast(`Inquiry marked as ${newStatus}`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const removeInquiry = async (id: string) => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, "inquiries", id));
      triggerToast("Wiped inquiry record.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const publishBlogPost = async (title: string, cat: string, desc: string, bodyContent: string, img: string) => {
    const id = "blog-" + Math.floor(1000 + Math.random() * 9000);
    const path = `blog/${id}`;
    try {
      await setDoc(doc(db, "blog", id), {
        id,
        title,
        category: cat,
        desc,
        content: bodyContent,
        img,
        status: "published",
        createdAt: serverTimestamp()
      });
      triggerToast(`Journal insight "${title}" published.`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeBlogPost = async (id: string) => {
    const path = `blog/${id}`;
    try {
      await deleteDoc(doc(db, "blog", id));
      triggerToast("Deleted journal post.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const registerDesignerProfile = async (name: string, role: string, location: string) => {
    const id = "des-" + Math.floor(1000 + Math.random() * 9000);
    const path = `designers/${id}`;
    try {
      await setDoc(doc(db, "designers", id), {
        id,
        name,
        role,
        location,
        createdAt: serverTimestamp()
      });
      triggerToast(`Designer "${name}" added to design desk.`);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const removeDesignerProfile = async (id: string) => {
    const path = `designers/${id}`;
    try {
      await deleteDoc(doc(db, "designers", id));
      triggerToast("Wiped designer roster entry.");
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Dynamic portfolio selection based on category
  const dynamicPortfolio = projectsList.length > 0 ? projectsList : PORTFOLIO;
  const filteredPortfolioItems = activeCategory === "All" 
    ? dynamicPortfolio 
    : dynamicPortfolio.filter(item => item.category === activeCategory);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (view === "admin") {
    return (
      <AdminDashboard
        projects={projectsList}
        gallery={galleryList.length > 0 ? galleryList : PORTFOLIO.slice(0, 4)}
        bookings={bookingsList}
        inquiries={inquiriesList}
        blog={blogList}
        designers={designersList.length > 0 ? designersList : [
          { id: "des-1", name: "Adrian Blurby", role: "Principal Architect", location: "Milan" },
          { id: "des-2", name: "Elena Solst", role: "Senior Stylist", location: "Paris" },
          { id: "des-3", name: "Thomas Cael", role: "Material Specialist", location: "New York" },
        ]}
        currentUser={currentUser}
        onSignOut={executeSignOut}
        exitAdmin={() => setView("visitor")}
        onAddProject={publishProject}
        onDeleteProject={removeProject}
        onAddGallery={publishGalleryImage}
        onDeleteGallery={removeGalleryImage}
        onUpdateBookingStatus={updateBookingState}
        onDeleteBooking={removeBooking}
        onUpdateInquiryStatus={updateInquiryState}
        onDeleteInquiry={removeInquiry}
        onAddBlog={publishBlogPost}
        onDeleteBlog={removeBlogPost}
        onAddDesigner={registerDesignerProfile}
        onDeleteDesigner={removeDesignerProfile}
        prePopulate={handlePrepopulateData}
        prepopulating={prepopulating}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0] selection:bg-[#D4AF37] selection:text-white overflow-x-hidden relative text-[#1E1E1E]">
      
      {/* Search side label */}
      <div className="fixed left-6 bottom-12 origin-bottom-left -rotate-90 z-40 hidden lg:block pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.4em] text-black/30 font-sans font-bold">
          Established &bull; MMXXIV &bull; Interior Excellence
        </span>
      </div>

      {/* Floating interactive feedback toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-4 flex items-center gap-3 shadow-2xl border text-xs font-sans tracking-wider ${
              toast.type === "success" 
                ? "bg-black text-white border-white/10" 
                : "bg-red-950 text-red-50 border-red-900"
            }`}
          >
            <Sparkles size={14} className="text-[#D4AF37]" />
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 sm:px-12 py-8 flex justify-between items-center bg-[#F6F4F0]/95 backdrop-blur-[4px] ${
          scrolled ? "py-4 shadow-sm border-b border-black/5" : "border-b border-black/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-serif tracking-widest uppercase italic text-black font-semibold"
          >
            BLURBY
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Collections", "Services", "Portfolio", "Journal"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:text-[#D4AF37] transition-all"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline text-[9px] uppercase tracking-wider font-bold text-black/60">
                {currentUser.displayName || currentUser.email}
              </span>
              <button 
                onClick={executeSignOut} 
                className="text-[9px] uppercase tracking-widest border-b border-black/20 hover:border-black transition-all font-bold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={executeGoogleSignIn}
              className="text-[9px] uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37]/35 hover:opacity-75 font-bold cursor-pointer"
            >
              Sign In with Google
            </button>
          )}

          <button 
            className="md:hidden text-black cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black text-white p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="text-2xl font-serif italic text-[#D4AF37]">BLURBY</div>
              <button className="cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {["Collections", "Services", "Portfolio", "Journal"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-serif italic hover:text-[#D4AF37] transition-all text-white/90"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="space-y-6 pt-6 border-t border-white/10">
              {currentUser ? (
                <div>
                  <p className="text-xs text-white/50 lowercase italic">{currentUser.email}</p>
                  <button onClick={() => { executeSignOut(); setIsMenuOpen(false); }} className="text-sm border-b border-white mt-2 block font-serif italic text-[#D4AF37]">Sign Out</button>
                </div>
              ) : (
                <button onClick={() => { executeGoogleSignIn(); setIsMenuOpen(false); }} className="text-sm border-b border-white block font-serif italic text-[#D4AF37]">Sign In with Google</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Split Layout Pattern */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pr-12 z-10 py-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-[#D4AF37]" />
              <span className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Curated Atmosphere</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[60px] sm:text-[76px] leading-[0.9] font-serif font-light mb-8 italic"
            >
              The Art of <br /> <span className="not-italic font-medium text-black">Living</span> <br /> Silently.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-sans text-sm leading-relaxed text-black/70 mb-10 max-w-sm"
            >
              Exceptional interior spaces designed with a focus on natural textures, warm lighting, and the luxury of quiet simplicity.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-8"
            >
              <a href="#portfolio" className="px-8 py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all font-bold">
                Explore Collection
              </a>
              <a href="#philosophy" className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 font-sans font-bold">
                Our Process
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-7 relative h-full flex items-center justify-center py-12">
            <motion.div 
              initial={{ scale: 1.05, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="w-full h-full max-h-[580px] aspect-[4/5] bg-[#D4AF37]/5 rounded-[220px] shadow-2xl relative overflow-hidden group border border-black/5"
            >
              <img 
                src={IMAGES.hero} 
                alt="Luxury Interior" 
                className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-102 transition-transform duration-[2s]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-12 left-12 right-12 text-white z-20">
                <p className="text-[10px] uppercase tracking-widest mb-2 opacity-80 font-sans font-bold text-[#D4AF37]">Current Showcase</p>
                <h3 className="text-4xl italic font-serif leading-none">The Oak & Linen Study</h3>
              </div>
            </motion.div>

            {/* Floating details panel */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute top-1/4 right-4 w-[220px] bg-white p-6 shadow-xl border border-black/5 rounded-sm z-30 hidden xl:flex flex-col"
            >
              <div className="text-[36px] font-serif leading-none mb-4 text-[#D4AF37] opacity-65">01</div>
              <h4 className="text-[9px] uppercase tracking-widest font-sans font-bold mb-3 text-black">Materials Catalog</h4>
              <p className="text-xs leading-relaxed text-black/60 font-sans italic">
                "We believe in materials that age with grace. Sustainable oak, hand-woven linen, and brushed gold accents."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              <span className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Our Ethos</span>
            </div>
            <h2 className="text-[44px] sm:text-[56px] font-serif mb-8 leading-tight italic">
              Quietly <span className="not-italic text-black">Confident,</span> <br /> 
              Boldly Minimal.
            </h2>
            <p className="font-sans text-sm leading-relaxed text-black/70 mb-10 max-w-sm">
              Luxury isn't about excess; it's about the perfect alignment of form, light, and materiality. Every space we craft is a dialogue between architectural precision and human comfort.
            </p>
            <div className="flex items-center gap-4 group cursor-pointer">
              <a href="#services" className="text-[10px] uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors font-sans font-bold">Our Atmosphere Portfolio</a>
              <div className="h-[1px] w-12 bg-black/30 transition-all duration-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 aspect-[4/3] rounded-[80px] overflow-hidden shadow-2xl relative border border-black/5"
          >
            <img 
              src={IMAGES.texture} 
              alt="Luxury Materials" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Seasonal showcase Series */}
      <section id="collections" className="py-32 bg-black text-[#F6F4F0]">
        <div className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Curated Spaces</span>
              </div>
              <h2 className="text-4xl md:text-[64px] font-serif leading-tight italic">Seasonal <span className="not-italic text-white">Series</span></h2>
            </motion.div>
            <a
              href="#portfolio"
              className="px-8 py-3 bg-white/5 hover:bg-white/15 text-white border border-white/10 hover:border-[#D4AF37] transition-all text-[10px] uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-3"
            >
              View Full Portfolio <ArrowRight size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: "02", title: "Maison Living", img: IMAGES.living, desc: "Architectural purity meet textures." },
              { id: "03", title: "Ethereal Sleep", img: IMAGES.bedroom, desc: "Serenity in every fiber." },
              { id: "04", title: "Grand Atrium", img: IMAGES.dining, desc: "Where gatherings become art." },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-8 shadow-xl">
                  <div className="absolute top-8 left-8 z-20">
                    <span className="block text-[44px] font-serif leading-none italic text-[#D4AF37] opacity-50 group-hover:opacity-100 transition-opacity">
                      {item.id}
                    </span>
                  </div>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-serif mb-2 text-white group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                  <p className="text-white/40 text-[10px] font-sans tracking-wide uppercase italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section & Interactive Custom Booking Form */}
      <section id="services" className="py-32 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Atmosphere Service Desk</span>
              </div>
              <h2 className="text-4xl font-serif italic mb-6">Expertise of <br /> <span className="not-italic">Silence</span></h2>
              <p className="font-sans text-sm text-black/60 leading-relaxed mb-10 max-w-xs">
                We provide a comprehensive suite of interior design actions, each grounded in our commitment to silence, light, and materiality.
              </p>
              
              <button 
                onClick={() => {
                  if (!currentUser) {
                    triggerToast("Sign in with Google first to book active consultations.", "error");
                    return;
                  }
                  setIsBookingOpen(true);
                }}
                className="px-8 py-4 bg-black hover:bg-[#D4AF37] text-white transition-all text-[10px] uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-3 cursor-pointer"
              >
                <Calendar size={14} />
                Bespoke Consultation
              </button>
            </motion.div>

            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="group p-8 border border-black/5 hover:border-[#D4AF37] transition-all duration-500 h-full flex flex-col items-start bg-[#F6F4F0]/30 rounded-sm"
              >
                <span className="text-[36px] font-serif italic text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors duration-500 leading-none mb-6">
                  {service.icon}
                </span>
                <h3 className="text-xl font-serif mb-4 text-black">{service.title}</h3>
                <p className="font-sans text-xs text-black/60 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Portfolio Section */}
      <section id="portfolio" className="py-32 px-6 sm:px-12 bg-[#F6F4F0] border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col gap-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                  <span className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Bespoke Works</span>
                </div>
                <h2 className="text-5xl font-serif italic text-black">Master <span className="not-italic text-black/45">Registry</span></h2>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-8">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[9px] uppercase tracking-[0.2em] font-sans font-bold transition-all border-b pb-1 cursor-pointer ${
                      activeCategory === cat ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-black/40 hover:text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredPortfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid relative overflow-hidden group shadow-md rounded-sm bg-white"
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[1px] flex flex-col justify-end p-8">
                    <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-sans font-bold mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-serif text-[#F6F4F0]">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Dynamic Journal/Blog Narratives */}
      <section id="journal" className="py-32 px-6 sm:px-12 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-8">
            <h2 className="text-5xl font-serif leading-none italic">The <span className="not-italic text-black/45">Journal</span></h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-black/40">Insights & Inspiration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {(blogList.length > 0 ? blogList : [
              { id: "b1", title: "Ethical Sourcing in High-End Décor", category: "Sustainability", desc: "How we select our timbers and textiles to ensure beauty that lasts a lifetime.", img: IMAGES.living },
              { id: "b2", title: "The Sculptural Power of Illumination", category: "Lighting", desc: "Exploring our latest hand-crafted chandelier series and its impact on space.", img: IMAGES.dining }
            ]).map((post) => (
              <div key={post.id} className="flex flex-col gap-6">
                <div className="aspect-video overflow-hidden shadow-md rounded-sm group relative border border-black/5">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.3em] font-sans">{post.category}</span>
                  <h4 className="text-2xl font-serif mt-2 mb-4 italic text-black font-semibold leading-tight">{post.title}</h4>
                  <p className="font-sans text-xs leading-relaxed text-black/60 mb-6 max-w-md">
                    {post.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation scheduling popup modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-8 shadow-2xl border border-black/5 rounded-sm relative text-[#1E1E1E]"
            >
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-4 right-4 text-black hover:text-[#D4AF37] cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-4">
                <Calendar className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-serif italic text-black font-bold">Schedule Atmosphere Consultation</h3>
              </div>

              <form onSubmit={scheduleBookingForm} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    readOnly
                    value={bookingEmail}
                    className="w-full bg-black/5 border border-black/5 p-3 text-xs outline-none font-sans text-black/60"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Required Studio Focus</label>
                  <select
                    value={bookingSpace}
                    onChange={(e) => setBookingSpace(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans text-black"
                  >
                    <option value="Residential Interior Design">Residential Interior Design</option>
                    <option value="Office & Workspace Design">Office & Workspace Design</option>
                    <option value="Luxury Bedroom Styling">Luxury Bedroom Styling</option>
                    <option value="Kitchen & Dining Concepts">Kitchen & Dining Concepts</option>
                    <option value="Lighting & Furniture Selection">Lighting & Furniture Selection</option>
                    <option value="3D Visualization & Planning">3D Visualization & Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Preferred Date</label>
                  <input 
                    type="date" 
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans text-black"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-black text-white hover:bg-[#D4AF37] text-[10px] uppercase font-bold tracking-widest font-sans transition-all cursor-pointer mt-2"
                >
                  Schedule Initial Consultation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry details popup modal */}
      <AnimatePresence>
        {isInquiryOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-8 shadow-2xl border border-black/5 rounded-sm relative text-[#1E1E1E]"
            >
              <button 
                onClick={() => setIsInquiryOpen(false)}
                className="absolute top-4 right-4 text-black hover:text-[#D4AF37] cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-4">
                <MessageSquare className="text-[#D4AF37]" size={18} />
                <h3 className="text-lg font-serif italic text-black font-bold">Submit Private Inquiry</h3>
              </div>

              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Email Address</label>
                  <input 
                    type="email" 
                    required
                    readOnly
                    value={inquiryEmail}
                    className="w-full bg-black/5 border border-black/5 p-3 text-xs outline-none font-sans text-black/60"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Inquiry Subject</label>
                  <input 
                    type="text" 
                    required
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs uppercase outline-none focus:border-[#D4AF37] font-sans text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-black/50 mb-1 font-sans">Details / Inquiry Text</label>
                  <textarea 
                    rows={4}
                    required
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="Describe your project, timeline, or preferred materials..."
                    className="w-full bg-[#F6F4F0] border border-black/5 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans text-black"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-black text-white hover:bg-[#D4AF37] text-[10px] uppercase font-bold tracking-widest font-sans transition-all cursor-pointer mt-2"
                >
                  Forward Message
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#F6F4F0] text-black py-24 px-6 sm:px-12 overflow-hidden relative border-t border-black/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-serif mb-8 italic text-black font-semibold">Blurby Interior</div>
              <p className="font-sans text-sm text-black/65 max-w-sm leading-relaxed mb-10">
                Milan &bull; Paris &bull; New York <br />
                Exceptional interior spaces designed with a legacy of craftsmanship and a vision for contemporary silence.
              </p>
              <div className="flex gap-8">
                <Instagram size={18} className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
                <Facebook size={18} className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
                <Twitter size={18} className="hover:text-[#D4AF37] cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-[#D4AF37] mb-8 font-semibold">Creative Studio</h5>
              <div className="flex flex-col gap-4 text-xs font-sans text-black/60 font-medium">
                <a href="#collections" className="hover:text-black hover:underline transition-all">Collections</a>
                <a href="#philosophy" className="hover:text-black hover:underline transition-all">Philosophy</a>
                <a href="#portfolio" className="hover:text-black hover:underline transition-all">Bespoke Spaces</a>
                <a href="#journal" className="hover:text-black hover:underline transition-all">Narratives</a>
              </div>
            </div>

            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-[#D4AF37] mb-8 font-semibold">Join the Studio</h5>
              <p className="text-xs text-black/50 mb-6 italic font-sans leading-relaxed">Direct message line to the Principal architect or directors.</p>
              
              <button 
                onClick={() => {
                  if (!currentUser) {
                    triggerToast("Verification Required: Sign in first to submit private inquiries.", "error");
                    return;
                  }
                  setIsInquiryOpen(true);
                }}
                className="w-full py-3 border border-black/15 hover:border-[#D4AF37] hover:text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest font-sans transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={12} />
                Send Studio Inquiry
              </button>

              <button 
                onClick={() => setView("admin")}
                className="mt-8 text-[10px] uppercase tracking-widest text-black/30 hover:text-[#D4AF37] transition-colors font-sans flex items-center gap-2 cursor-pointer font-bold"
              >
                <Lock size={12} />
                Admin Portal
              </button>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-black/30">
              &copy; 2026 Blurby Interior Design Studio
            </p>
            <div className="flex gap-10 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-black/30">
              <a href="#" className="hover:text-brand-gold transition-colors">Privacy Directive</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Legal Terms</a>
              <a href="#" className="hover:text-brand-gold transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
