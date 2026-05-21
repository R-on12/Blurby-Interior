import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Maximize2,
  ArrowRight,
  Instagram,
  ChevronRight,
  X,
  Menu,
  Minimize2,
  Trash2,
  Upload,
  User,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AdminDashboardProps {
  projects: any[];
  gallery: any[];
  bookings: any[];
  inquiries: any[];
  blog: any[];
  designers: any[];
  currentUser: any;
  onSignOut: () => void;
  exitAdmin: () => void;
  onAddProject: (title: string, cat: string, img: string) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onAddGallery: (title: string, cat: string, img: string) => Promise<void>;
  onDeleteGallery: (id: string) => Promise<void>;
  onUpdateBookingStatus: (id: string, stat: string) => Promise<void>;
  onDeleteBooking: (id: string) => Promise<void>;
  onUpdateInquiryStatus: (id: string, stat: string) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  onAddBlog: (title: string, cat: string, desc: string, content: string, img: string) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
  onAddDesigner: (name: string, role: string, location: string) => Promise<void>;
  onDeleteDesigner: (id: string) => Promise<void>;
  prePopulate: () => Promise<void>;
  prepopulating: boolean;
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const {
    projects,
    gallery,
    bookings,
    inquiries,
    blog,
    designers,
    currentUser,
    onSignOut,
    exitAdmin,
    prePopulate,
    prepopulating
  } = props;

  const [section, setSection] = useState("overview");

  const MENU_ITEMS = [
    { id: "overview", label: "Overview", icon: <Maximize2 size={16} /> },
    { id: "projects", label: "Projects", icon: <ArrowRight size={16} /> },
    { id: "gallery", label: "Gallery", icon: <Instagram size={16} /> },
    { id: "bookings", label: "Bookings", icon: <ChevronRight size={16} /> },
    { id: "inquiries", label: "Inquiries", icon: <X size={16} /> },
    { id: "blog", label: "Journal", icon: <Menu size={16} /> },
    { id: "designers", label: "Designers", icon: <ChevronRight size={16} /> },
  ];

  const getAdminStatusLabel = () => {
    if (currentUser?.email === "coopedill@gmail.com") {
      return "Studio Director (Master Admin)";
    }
    return "Staff Member (Limited Access)";
  };

  return (
    <div className="flex h-screen bg-[#F6F4F0] text-[#1E1E1E] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col p-8 z-20">
        <div className="text-2xl font-serif italic mb-12 px-4">
          BLURBY 
          <span className="text-brand-gold text-xs not-italic uppercase tracking-widest block mt-2 font-bold text-[#D4AF37]">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-sans transition-all cursor-pointer ${
                section === item.id 
                  ? "bg-[#D4AF37] text-white font-bold" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={exitAdmin}
            className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-sans transition-all cursor-pointer"
          >
            <Minimize2 size={16} />
            Exit Portal
          </button>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-500 text-[10px] uppercase tracking-[0.2em] font-sans transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-black/5 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Workspace</span>
            <h2 className="text-4xl font-serif italic capitalize mt-1 text-black">{section}</h2>
          </div>
          
          <div className="flex items-center gap-6 bg-white px-6 py-4 shadow-sm border border-black/5 rounded-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-black">{currentUser?.displayName || "Studio Guest"}</p>
              <p className="text-black/50 text-[10px] font-sans italic lowercase">{currentUser?.email}</p>
              <p className="text-[9px] font-sans font-bold text-[#D4AF37] mt-1">{getAdminStatusLabel()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-lg">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase() || "S"}
            </div>
          </div>
        </header>

        {/* Security / System status widget */}
        {currentUser?.email !== "coopedill@gmail.com" && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-sans font-bold uppercase tracking-wider text-amber-800">Demo Simulation Mode Active</p>
              <p className="text-xs mt-1 leading-relaxed">
                You are currently signed in as <strong className="font-semibold">{currentUser?.email}</strong>. 
                Our certified Firebase Security rules prevent non-admin emails from modifying core portfolio entries (Projects, Gallery, Designers, Blogs) in Firestore. 
                Log in as <strong className="underline">coopedill@gmail.com</strong> (the bootstrapped manager) to test full physical write operations, or explore consultation scheduling from the client view!
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {section === "overview" && (
              <OverviewGrid 
                projects={projects} 
                bookings={bookings} 
                inquiries={inquiries}
                prePopulate={prePopulate}
                prepopulating={prepopulating}
                currentUser={currentUser}
              />
            )}
            {section === "projects" && (
              <ProjectsManager 
                projects={projects} 
                onAdd={props.onAddProject} 
                onDelete={props.onDeleteProject} 
              />
            )}
            {section === "gallery" && (
              <GalleryManager 
                items={gallery} 
                onAdd={props.onAddGallery} 
                onDelete={props.onDeleteGallery} 
              />
            )}
            {section === "bookings" && (
              <BookingsManager 
                bookings={bookings} 
                onUpdateStatus={props.onUpdateBookingStatus} 
                onDelete={props.onDeleteBooking} 
              />
            )}
            {section === "inquiries" && (
              <InquiriesManager 
                inquiries={inquiries} 
                onUpdateStatus={props.onUpdateInquiryStatus} 
                onDelete={props.onDeleteInquiry} 
              />
            )}
            {section === "blog" && (
              <BlogManager 
                posts={blog} 
                onAdd={props.onAddBlog} 
                onDelete={props.onDeleteBlog} 
              />
            )}
            {section === "designers" && (
              <DesignersManager 
                designers={designers} 
                onAdd={props.onAddDesigner} 
                onDelete={props.onDeleteDesigner} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------- OVERVIEW GRID ---------------- //

function OverviewGrid({ projects, bookings, inquiries, prePopulate, prepopulating, currentUser }: any) {
  const pendingConsultationsCount = bookings.filter((b: any) => b.status === "Pending").length;
  const activeInquiriesCount = inquiries.filter((i: any) => i.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Project Phases", value: projects.length.toString().padStart(2, "0"), trend: "Real-time records" },
          { label: "Pending Consultations", value: pendingConsultationsCount.toString().padStart(2, "0"), trend: "High priority status" },
          { label: "General Inbox Queries", value: activeInquiriesCount.toString().padStart(2, "0"), trend: "Unresolved client inquiries" },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-white shadow-sm border-t-2 border-[#D4AF37] rounded-sm border border-black/5">
            <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-black/40 mb-4">{stat.label}</p>
            <p className="text-5xl font-serif mb-4 italic">{stat.value}</p>
            <p className="text-[10px] font-sans text-[#D4AF37] italic font-semibold">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Actions & Utilities card */}
        <div className="p-10 bg-white shadow-sm rounded-sm border border-black/5 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-serif italic mb-4">Studio Workspace Actions</h3>
            <p className="text-sm font-sans text-black/60 leading-relaxed mb-6">
              Establish a pristine staging database! If your Firestore collections are fresh or blank, use the utility below to pre-populate static assets into real database collections with one click.
            </p>
          </div>
          
          <div className="pt-4 border-t border-black/5 flex flex-wrap gap-4 items-center">
            <button
              onClick={prePopulate}
              disabled={prepopulating || currentUser?.email !== "coopedill@gmail.com"}
              className="px-6 py-3 bg-black hover:bg-[#D4AF37] text-white disabled:bg-black/20 disabled:text-black/40 text-[10px] uppercase font-bold tracking-widest font-sans transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className={prepopulating ? "animate-spin" : ""} />
              {prepopulating ? "Staged writing items..." : "Pre-populate Startup Assets"}
            </button>
            {currentUser?.email !== "coopedill@gmail.com" && (
              <span className="text-[9px] text-[#D4AF37] font-sans italic font-semibold">Requires master admin authorization</span>
            )}
          </div>
        </div>

        {/* Info card */}
        <div className="p-12 bg-black text-white rounded-sm overflow-hidden relative border border-black/10">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-3xl font-serif italic mb-6 leading-tight">
                Atmosphere Analysis <br /> 
                <span className="text-[#D4AF37] not-italic">Summer 2026</span>
              </h3>
              <p className="text-white/45 font-sans text-sm max-w-sm leading-relaxed">
                Connective queries and database actions are encrypted secure. Clients can post direct inquiries. You are connected to database instance <span className="text-slate-200 underline font-mono">active-firestore</span>.
              </p>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-[320px] h-[320px] border border-[#D4AF37]/15 rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

// ---------------- PROJECTS MANAGER ---------------- //

function ProjectsManager({ projects, onAdd, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Modern");
  const [imgUrl, setImgUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imgUrl) {
      setErrorMsg("Please fill in all file details.");
      return;
    }
    setErrorMsg("");
    setSaving(true);
    try {
      await onAdd(title, category, imgUrl);
      setTitle("");
      setImgUrl("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-sm rounded-sm border border-black/5">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
        <div>
          <h3 className="text-xl font-serif italic text-black">Upload Real-time Projects</h3>
          <p className="text-xs text-black/45 mt-1 font-sans">Shows real records parsed inside the projects channel</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-2 bg-black hover:bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-widest font-sans transition-all flex items-center gap-2 cursor-pointer"
        >
          {isOpen ? <X size={14} /> : <Plus size={14} />}
          {isOpen ? "Close Editor" : "Add Submission"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 bg-[#F6F4F0] border border-black/5 rounded-sm overflow-hidden"
          >
            <h4 className="text-sm uppercase tracking-widest font-bold text-black mb-4">Project Submission Layout</h4>
            {errorMsg && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 border border-red-100 font-sans">{errorMsg}</div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Project Title</label>
                <input
                  type="text"
                  placeholder="The Onyx Suite"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs uppercase tracking-widest outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Creative Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs uppercase tracking-wider outline-none focus:border-[#D4AF37] font-sans"
                >
                  {["Modern", "Minimalist", "Scandinavian", "Luxury", "Contemporary"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Demonstration Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. /src/assets/images/hero_interior_1779113551456.png"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 px-8 py-3 bg-[#D4AF37] text-white hover:bg-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:bg-slate-350"
            >
              {saving ? "Publishing submission..." : "Publish Project"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-black/5 hover:border-[#D4AF37]/30 transition-all group rounded-sm bg-slate-50/50"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#F6F4F0] overflow-hidden border border-black/5">
                  <img src={item.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold uppercase tracking-widest text-black">{item.title}</h4>
                  <span className="text-[10px] px-2.5 py-0.5 mt-1 bg-black/5 text-black rounded-sm font-sans uppercase tracking-wider inline-block">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                  title="Archive Asset"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-black/5 bg-[#F6F4F0]/40">
            <p className="text-black/30 italic text-[10px] uppercase tracking-widest font-bold">No projects uploaded. Click pre-populate back to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- GALLERY MANAGER ---------------- //

function GalleryManager({ items, onAdd, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Modern");
  const [imgUrl, setImgUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imgUrl) {
      setErrorMsg("Please provide all gallery item assets.");
      return;
    }
    setErrorMsg("");
    setSaving(true);
    try {
      await onAdd(title, category, imgUrl);
      setTitle("");
      setImgUrl("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to catalog image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-sm rounded-sm border border-black/5">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
        <div>
          <h3 className="text-xl font-serif italic text-black">Studio Image Gallery</h3>
          <p className="text-xs text-black/45 mt-1 font-sans">Dynamic image catalog displayed in visual archives</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-2 bg-black hover:bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-widest font-sans transition-all flex items-center gap-2 cursor-pointer"
        >
          {isOpen ? <X size={14} /> : <Plus size={14} />}
          {isOpen ? "Close Editor" : "Catalog Asset"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 bg-[#F6F4F0] border border-black/5 rounded-sm overflow-hidden"
          >
            <h4 className="text-sm uppercase tracking-widest font-bold text-black mb-4">New Gallery Item</h4>
            {errorMsg && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 border border-red-100 font-sans">{errorMsg}</div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Image Headline</label>
                <input
                  type="text"
                  placeholder="Oslo Study Area"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Category Theme</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs uppercase tracking-wider outline-none focus:border-[#D4AF37] font-sans"
                >
                  {["Modern", "Minimalist", "Scandinavian", "Luxury", "Contemporary"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Visual Image URL</label>
                <input
                  type="text"
                  placeholder="/src/assets/images/..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 px-8 py-3 bg-[#D4AF37] text-white hover:bg-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
            >
              {saving ? "Cataloging..." : "Submit to Gallery"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((item: any) => (
            <div key={item.id} className="bg-[#F6F4F0] border border-black/5 rounded-sm p-3 group relative overflow-hidden">
              <div className="aspect-[4/3] bg-white overflow-hidden rounded-sm relative border border-black/5 mb-3">
                <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
                <button
                  onClick={() => onDelete(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full text-red-500 shadow-sm transition-all cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider truncate text-black">{item.title}</h4>
              <p className="text-[9px] text-black/40 uppercase tracking-widest mt-1 italic">{item.category}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5 bg-[#F6F4F0]/40">
            <p className="text-black/30 italic text-[10px] uppercase tracking-widest font-bold">Staging collection has no records.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- BOOKINGS MANAGER ---------------- //

function BookingsManager({ bookings, onUpdateStatus, onDelete }: any) {
  return (
    <div className="bg-white p-8 shadow-sm rounded-sm border border-black/5 overflow-x-auto">
      <h3 className="text-xl font-serif italic mb-8 pb-6 border-b border-black/5">Active Consulations & Consultation Bookings</h3>
      
      <table className="w-full text-left font-sans min-w-[700px]">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest font-bold text-black/40">
            <th className="pb-6">ID</th>
            <th className="pb-6">Client</th>
            <th className="pb-6">Contact Channels</th>
            <th className="pb-6">Requirement Studio</th>
            <th className="pb-6">Requested Date</th>
            <th className="pb-6">Current Status</th>
            <th className="pb-6 text-right">Action Gateways</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-black/5">
          {bookings.length > 0 ? (
            bookings.map((b: any) => (
              <tr key={b.id} className="group hover:bg-slate-50/40">
                <td className="py-6 font-bold">{b.id}</td>
                <td className="py-6 font-semibold">{b.clientName}</td>
                <td className="py-6 text-xs text-black/60 italic font-mono truncate">{b.clientEmail}</td>
                <td className="py-6 italic text-[#D4AF37] font-medium">{b.space}</td>
                <td className="py-6">{b.date}</td>
                <td className="py-6">
                  <span className={`text-[9px] uppercase tracking-wider px-3 py-1 font-bold rounded-full ${
                    b.status === "Confirmed" 
                      ? "bg-green-100 text-green-700" 
                      : b.status === "Consultation"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-[#D4AF37]/10 text-[#D4AF37]"
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-2 items-center">
                    {b.status !== "Confirmed" && (
                      <button
                        onClick={() => onUpdateStatus(b.id, "Confirmed")}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-[9px] uppercase tracking-wider font-bold rounded-sm cursor-pointer"
                        title="Approve Booking"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== "Consultation" && (
                      <button
                        onClick={() => onUpdateStatus(b.id, "Consultation")}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] uppercase tracking-wider font-bold rounded-sm cursor-pointer"
                        title="Set to Active Consultation"
                      >
                        Consult
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(b.id)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-full transition-all cursor-pointer"
                      title="Archive Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-20 text-center text-black/30 italic text-[10px] uppercase tracking-widest font-bold">
                No bookings registered yet. Submit consultations from the principal view!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- INQUIRIES MANAGER ---------------- //

function InquiriesManager({ inquiries, onUpdateStatus, onDelete }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-black/5">
        <h3 className="text-xl font-serif italic text-black">Private Customer Inquiries Inbox</h3>
        <span className="text-xs text-black/40 font-semibold font-sans uppercase">Strict Isolated Admin Read</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {inquiries.length > 0 ? (
          inquiries.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-8 bg-white border rounded-sm transition-all relative ${
                msg.status === "active" 
                  ? "border-[#D4AF37]/45 shadow-sm" 
                  : "border-black/5 opacity-65"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-sm font-sans font-bold uppercase tracking-widest text-black">{msg.clientName}</h4>
                  <p className="text-[10px] text-black/50 font-mono lower-case">{msg.clientEmail}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm inline-block mb-1 ${
                    msg.status === "active" ? "bg-amber-100 text-amber-800" : "bg-slate-150 text-[#1E1E1E]"
                  }`}>
                    {msg.status}
                  </span>
                </div>
              </div>
              
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mb-3">{msg.subject}</p>
              <p className="font-sans text-sm leading-relaxed text-black/70 mb-6 italic bg-[#F6F4F0] p-4 rounded-sm border border-black/5">
                "{msg.messageText}"
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-black/5">
                <div className="flex gap-3">
                  {msg.status === "active" && (
                    <button
                      onClick={() => onUpdateStatus(msg.id, "replied")}
                      className="text-[9px] uppercase font-bold tracking-widest text-black bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 transition-all rounded-sm cursor-pointer"
                    >
                      Mark Replied
                    </button>
                  )}
                  {msg.status !== "archived" && (
                    <button
                      onClick={() => onUpdateStatus(msg.id, "archived")}
                      className="text-[9px] uppercase font-bold tracking-widest text-black/50 hover:text-black transition-all cursor-pointer"
                    >
                      Archive Inbox
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onDelete(msg.id)}
                  className="p-2 text-red-400 hover:text-red-600 rounded-full cursor-pointer"
                  title="Wipe record"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5 bg-white rounded-sm">
            <p className="text-black/30 italic text-[10px] uppercase tracking-widest font-bold">Inquiries inbox is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- BLOG/JOURNAL MANAGER ---------------- //

function BlogManager({ posts, onAdd, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sustainability");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !content || !img) {
      setErrorMsg("Please fill complete journal attributes.");
      return;
    }
    setErrorMsg("");
    setSaving(true);
    try {
      await onAdd(title, category, desc, content, img);
      setTitle("");
      setDesc("");
      setContent("");
      setImg("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish Blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-sm rounded-sm border border-black/5">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
        <div>
          <h3 className="text-xl font-serif italic text-black">The Journal Management</h3>
          <p className="text-xs text-black/45 mt-1 font-sans">Publish luxury narratives and seasonal spatial articles</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-2 bg-black hover:bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-widest font-sans transition-all flex items-center gap-2 cursor-pointer"
        >
          {isOpen ? <X size={14} /> : <Plus size={14} />}
          {isOpen ? "Close Editor" : "New Narrative"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 bg-[#F6F4F0] border border-black/5 rounded-sm overflow-hidden space-y-4"
          >
            <h4 className="text-sm uppercase tracking-widest font-bold text-black border-b pb-2">Create Design Insight</h4>
            {errorMsg && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 border border-red-100 font-sans">{errorMsg}</div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Headline Title</label>
                <input
                  type="text"
                  placeholder="The Sculptural Power of Illumination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Focus Channel</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                >
                  {["Sustainability", "Lighting", "Materials", "Aesthetics", "Inspiration"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Metadata Intro Summary</label>
                <input
                  type="text"
                  placeholder="A brief metadata overview of the narrative's central theme..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Insight Image Illustration URL</label>
                <input
                  type="text"
                  placeholder="e.g. /src/assets/images/decor_texture_1779113605166.png"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Full Narrative Body Content</label>
              <textarea
                rows={5}
                placeholder="Write detailed design paragraphs here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white border border-black/10 p-4 text-xs outline-none focus:border-[#D4AF37] font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#D4AF37] text-white hover:bg-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
            >
              {saving ? "Publishing insight..." : "Publish to Journal"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-black/5 hover:border-[#D4AF37]/30 transition-all group rounded-sm bg-slate-50/50"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-12 bg-white overflow-hidden rounded-sm border border-black/5">
                  <img src={item.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold uppercase tracking-widest text-black">{item.title}</h4>
                  <p className="text-[10px] text-black/40 font-sans italic truncate max-w-md">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-black/5 bg-[#F6F4F0]/40">
            <p className="text-black/30 italic text-[10px] uppercase tracking-widest font-bold">Journal submissions database is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- DESIGNERS MANAGER ---------------- //

function DesignersManager({ designers, onAdd, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("Accra");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      setErrorMsg("Please provide designer profile variables.");
      return;
    }
    setErrorMsg("");
    setSaving(true);
    try {
      await onAdd(name, role, location);
      setName("");
      setRole("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create designer entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-sm rounded-sm border border-black/5">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-black/5">
        <div>
          <h3 className="text-xl font-serif italic text-black">Studio Team Roster</h3>
          <p className="text-xs text-black/45 mt-1 font-sans">Active directors, architects, and stylists profiles</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-2 bg-black hover:bg-[#D4AF37] text-white text-[10px] uppercase font-bold tracking-widest font-sans transition-all flex items-center gap-2 cursor-pointer"
        >
          {isOpen ? <X size={14} /> : <Plus size={14} />}
          {isOpen ? "Close Editor" : "Add Profile"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-6 bg-[#F6F4F0] border border-black/5 rounded-sm overflow-hidden"
          >
            <h4 className="text-sm uppercase tracking-widest font-bold text-black mb-4">Designer Profile Properties</h4>
            {errorMsg && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 border border-red-100 font-sans">{errorMsg}</div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Designer Full Name</label>
                <input
                  type="text"
                  placeholder="Adrian Blurby"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Studio Focus / Role</label>
                <input
                  type="text"
                  placeholder="Principal Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs outline-none focus:border-[#D4AF37] font-sans"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-black/55 mb-2 font-sans">Design Hub / Studio Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-black/10 p-3 text-xs uppercase tracking-wider outline-none focus:border-[#D4AF37] font-sans"
                >
                  {["Accra", "Takoradi", "New York"].map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 px-8 py-3 bg-[#D4AF37] text-white hover:bg-black font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
            >
              {saving ? "Saving profile..." : "Save Designer Profile"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {designers.length > 0 ? (
          designers.map((d: any) => (
            <div key={d.id} className="bg-[#F6F4F0] p-8 rounded-sm shadow-sm relative overflow-hidden border border-black/5 group">
              <div className="relative z-10">
                <h4 className="text-2xl font-serif italic mb-2 text-black">{d.name}</h4>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-black/40 mb-8">{d.role}</p>
                <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#D4AF37] font-bold">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                  {d.location} Studio
                </div>
              </div>
              <div className="absolute bottom-4 right-4 z-25 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onDelete(d.id)}
                  className="p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all cursor-pointer shadow-sm"
                  title="Remove designer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-15 transition-opacity">
                <ChevronRight size={100} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-black/5 bg-[#F6F4F0]/40 rounded-sm">
            <p className="text-black/30 italic text-[10px] uppercase tracking-widest font-bold">Designer collection is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
