/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Asset paths from generated images
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
  { id: 1, title: "The Onyx Suite", category: "Modern", img: IMAGES.modern },
  { id: 2, title: "Silent Corridors", category: "Minimalist", img: IMAGES.minimalist },
  { id: 3, title: "Oslo Morning", category: "Scandinavian", img: IMAGES.scandinavian },
  { id: 4, title: "Grand Atrium", category: "Luxury", img: IMAGES.luxury },
  { id: 5, title: "The Chef's Canvas", category: "Contemporary", img: IMAGES.contemporary },
  { id: 6, title: "Visions of Void", category: "Minimalist", img: IMAGES.texture }, // Reusing texture for extra masonry item
  { id: 7, title: "Echoes of Gold", category: "Luxury", img: IMAGES.dining },
  { id: 8, title: "Spatial Blueprint", category: "Contemporary", img: IMAGES.planning },
];

const CATEGORIES = ["All", "Modern", "Minimalist", "Scandinavian", "Luxury", "Contemporary"];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"visitor" | "admin">("visitor");
  const [adminSection, setAdminSection] = useState("overview");

  const filteredPortfolio = activeCategory === "All" 
    ? PORTFOLIO 
    : PORTFOLIO.filter(item => item.category === activeCategory);

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
        section={adminSection} 
        setSection={setAdminSection} 
        exitAdmin={() => setView("visitor")} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-gold selection:text-white overflow-x-hidden relative">
      {/* Search side label */}
      <div className="fixed left-6 bottom-12 origin-bottom-left -rotate-90 z-40 hidden lg:block">
        <span className="text-vertical-label">
          Established &bull; MMXXIV &bull; Interior Excellence
        </span>
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 sm:px-12 py-8 flex justify-between items-center bg-brand-beige ${
          scrolled ? "py-4 shadow-sm border-b border-brand-black/5" : "border-b border-brand-black/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-serif tracking-widest uppercase italic text-brand-black"
          >
            BLURBY
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {["Collections", "Services", "Portfolio", "Journal"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:opacity-50 transition-opacity"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden sm:block text-[10px] uppercase tracking-widest border-b border-brand-black pb-1 cursor-pointer">
            Cart (0)
          </div>
          <button 
            className="md:hidden text-brand-black"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
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
            className="fixed inset-0 z-[60] bg-brand-black text-white p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="text-2xl font-serif italic">BLURBY</div>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {["Collections", "Services", "Portfolio", "Journal"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif italic hover:text-brand-gold transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex gap-6">
              <Instagram size={24} />
              <Facebook size={24} />
              <Twitter size={24} />
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
              <div className="w-12 h-[1px] bg-brand-gold" />
              <span className="text-brand-gold font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Curated Atmosphere</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[64px] sm:text-[84px] leading-[0.9] font-serif font-light mb-8 italic"
            >
              The Art of <br /> <span className="not-italic font-medium text-brand-black">Living</span> <br /> Silently.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="font-sans text-sm leading-relaxed text-brand-black/70 mb-10 max-w-sm"
            >
              Exceptional interior spaces designed with a focus on natural textures, warm lighting, and the luxury of quiet simplicity.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-8"
            >
              <button className="px-8 py-4 bg-brand-black text-brand-beige text-[10px] uppercase tracking-[0.2em] hover:bg-brand-gold transition-colors">
                Explore Collection
              </button>
              <a href="#philosophy" className="text-[10px] uppercase tracking-[0.2em] border-b border-brand-black pb-1 font-sans">
                Our Process
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-7 relative h-full flex items-center justify-center py-12">
            {/* Large Main Canvas Area (Pill Shape) */}
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full max-h-[600px] aspect-[4/5] bg-brand-oak rounded-[240px] shadow-2xl relative overflow-hidden group"
            >
              <img 
                src={IMAGES.hero} 
                alt="Luxury Interior" 
                className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-12 left-12 right-12 text-brand-white z-20">
                <p className="text-[10px] uppercase tracking-widest mb-2 opacity-80 font-sans font-bold">Current Showcase</p>
                <h3 className="text-4xl italic font-serif">The Oak & Linen Study</h3>
              </div>
            </motion.div>

            {/* Overlapping Floating Element */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute top-1/4 -right-4 md:right-0 w-[240px] h-[320px] floating-card-accent z-30 hidden sm:flex flex-col"
            >
              <div className="text-[48px] font-serif leading-none mb-4 opacity-10">01</div>
              <h4 className="text-[10px] uppercase tracking-widest font-sans font-bold mb-4 text-brand-gold">Materials</h4>
              <p className="text-xs leading-relaxed opacity-60 font-sans italic">
                "We believe in materials that age with grace. Sustainable oak, hand-woven linen, and brushed gold accents."
              </p>
              <div className="mt-auto flex gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-oak"></div>
                <div className="w-3 h-3 rounded-full bg-brand-taupe"></div>
                <div className="w-3 h-3 rounded-full bg-brand-black"></div>
                <div className="w-3 h-3 rounded-full bg-brand-gold"></div>
              </div>
            </motion.div>

            {/* Decorative Element (Circle) */}
            <div className="absolute bottom-20 -left-10 w-32 h-32 border border-brand-gold/30 rounded-full flex items-center justify-center pointer-events-none hidden lg:flex">
              <div className="w-24 h-24 border border-brand-gold/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-5"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-brand-gold"></div>
              <span className="text-brand-gold font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Our Ethos</span>
            </div>
            <h2 className="text-[48px] sm:text-[64px] font-serif mb-8 leading-tight italic">
              Quietly <span className="not-italic text-brand-black">Confident,</span> <br /> 
              Boldly Minimal.
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-10 max-w-sm">
              Luxury isn't about excess; it's about the perfect alignment of form, light, and materiality. Every space we craft is a dialogue between architectural precision and human comfort.
            </p>
            <div className="flex items-center gap-4 group cursor-pointer">
              <span className="text-[10px] uppercase tracking-[0.2em] group-hover:text-brand-gold transition-colors font-sans font-bold">Our Philosophy</span>
              <div className="h-[1px] w-12 bg-brand-black/30 group-hover:w-20 group-hover:bg-brand-gold transition-all duration-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="lg:col-span-7 aspect-[4/3] rounded-[100px] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-brand-oak/20 mix-blend-multiply z-10 pointer-events-none" />
            <img 
              src={IMAGES.texture} 
              alt="Luxury Materials" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 ease-in-out"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section id="collections" className="py-32 bg-brand-black text-brand-beige">
        <div className="px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Curated Spaces</span>
              </div>
              <h2 className="text-5xl md:text-[84px] font-serif leading-tight italic">Seasonal <span className="not-italic">Series</span></h2>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="px-8 py-3 border border-brand-beige/20 hover:border-brand-gold hover:text-brand-gold transition-all duration-500 text-[10px] uppercase tracking-[0.2em] font-sans font-bold flex items-center gap-3"
            >
              View All <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: "02", title: "Maison Living", img: IMAGES.living, desc: "Architectural purity meet textures." },
              { id: "03", title: "Ethereal Sleep", img: IMAGES.bedroom, desc: "Serenity in every fiber." },
              { id: "04", title: "Grand Atrium", img: IMAGES.dining, desc: "Where gatherings become art." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * i, duration: 0.8 }}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-8 shadow-xl">
                  <div className="absolute top-8 left-8 z-20 overflow-hidden">
                    <motion.span 
                      initial={{ y: "100%" }}
                      whileInView={{ y: 0 }}
                      transition={{ delay: 0.5 + (0.1 * i), duration: 0.5 }}
                      className="block text-[48px] font-serif leading-none italic text-brand-gold opacity-40 group-hover:opacity-100 transition-opacity"
                    >
                      {item.id}
                    </motion.span>
                  </div>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-taupe/20 mix-blend-multiply opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
                <hgroup>
                  <h3 className="text-3xl font-serif mb-3 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                  <p className="text-brand-beige/40 text-xs font-sans tracking-wide uppercase italic">{item.desc}</p>
                </hgroup>
                <div className="mt-8 w-8 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-brand-gold"></div>
                <span className="text-brand-gold font-sans text-[10px] uppercase tracking-[0.3em] font-bold">What we do</span>
              </div>
              <h2 className="text-5xl font-serif italic mb-8">Atmospheric <br /> <span className="not-italic">Expertise</span></h2>
              <p className="font-sans text-sm text-brand-black/60 leading-relaxed mb-10 max-w-xs">
                We provide a comprehensive suite of interior design services, each grounded in our commitment to silence, light, and materiality.
              </p>
              <button className="px-8 py-4 border border-brand-black/10 hover:border-brand-gold hover:text-brand-gold transition-all duration-500 text-[10px] uppercase tracking-[0.2em] font-sans font-bold">
                Bespoke Consultation
              </button>
            </motion.div>

            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group p-8 floating-card-accent border-transparent hover:border-brand-gold transition-all duration-700 h-full flex flex-col items-start"
              >
                <span className="text-[48px] font-serif italic text-brand-gold/20 group-hover:text-brand-gold/100 transition-colors duration-700 leading-none mb-6">
                  {service.icon}
                </span>
                <h3 className="text-2xl font-serif mb-4">{service.title}</h3>
                <p className="font-sans text-sm text-brand-black/50 leading-relaxed group-hover:text-brand-black/70 transition-colors">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio / Gallery Section */}
      <section id="portfolio" className="py-32 px-6 sm:px-12 bg-brand-beige">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col gap-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-brand-gold"></div>
                  <span className="text-brand-gold font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Bespoke Works</span>
                </div>
                <h2 className="text-6xl font-serif italic">Our <span className="not-italic">Narrative</span></h2>
              </motion.div>
              
              <div className="flex flex-wrap gap-6 md:gap-10">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold transition-all border-b pb-1 ${
                      activeCategory === cat ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-black/40 hover:text-brand-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="break-inside-avoid relative overflow-hidden group shadow-xl rounded-sm"
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex flex-col justify-center items-center text-center p-8">
                    <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-sans font-bold mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-serif text-brand-beige mb-6">{item.title}</h3>
                    <button className="p-3 border border-brand-beige/20 text-brand-beige rounded-full hover:bg-brand-beige hover:text-brand-black transition-all">
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Featured Quote / Mid-section */}
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-brand-white">
        {/* Decorative Circle Accent */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-gold/5 rounded-full pointer-events-none" />
        
        <div className="max-w-4xl text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            className="mb-12 origin-top"
          >
            <div className="w-[1px] h-24 bg-brand-gold mx-auto" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-[1.3] italic"
          >
            "A home should be a collection of what <br /> you love, told through the <span className="text-brand-gold not-italic font-medium">lens of luxury.</span>"
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-[10px] uppercase tracking-[0.3em] text-brand-black font-sans font-bold flex flex-col items-center gap-4"
          >
            <div className="w-8 h-[1px] bg-brand-black"></div>
            Blurby Interior Studio
          </motion.div>
        </div>
      </section>

      {/* Journal / Blog Grid */}
      <section id="journal" className="py-32 px-6 sm:px-12 bg-white border-t border-brand-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 className="text-[64px] font-serif leading-none italic">The <span className="not-italic">Journal</span></h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-brand-black/40">Insights & Inspiration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-10"
            >
              <div className="aspect-video overflow-hidden shadow-2xl rounded-sm group relative">
                <div className="absolute inset-0 bg-brand-gold/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={IMAGES.living} 
                  alt="Journal Post" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] font-sans">Sustainability</span>
                <h4 className="text-3xl font-serif mt-4 mb-6 italic">Ethical Sourcing in High-End Décor</h4>
                <p className="font-sans text-sm leading-relaxed text-brand-black/60 mb-8 max-w-md">
                  How we select our timbers and textiles to ensure beauty that lasts a lifetime.
                </p>
                <button className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">Read Narrative</button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-10"
            >
              <div className="aspect-video overflow-hidden shadow-2xl rounded-sm group relative">
                <div className="absolute inset-0 bg-brand-gold/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={IMAGES.dining} 
                  alt="Journal Post" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.3em] font-sans">Lighting</span>
                <h4 className="text-3xl font-serif mt-4 mb-6 italic">The Sculptural Power of Illumination</h4>
                <p className="font-sans text-sm leading-relaxed text-brand-black/60 mb-8 max-w-md">
                  Exploring our latest hand-crafted chandelier series and its impact on space.
                </p>
                <button className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">Read Narrative</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-beige text-brand-black py-24 px-6 sm:px-12 overflow-hidden relative border-t border-brand-black/10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-serif mb-8 italic">Blurby Interior</div>
              <p className="font-sans text-sm text-brand-black/60 max-w-sm leading-relaxed mb-10">
                Milan &bull; Paris &bull; New York <br />
                Exceptional interior spaces designed with a legacy of craftsmanship and a vision for contemporary silence.
              </p>
              <div className="flex gap-8">
                <Instagram size={20} className="hover:text-brand-gold cursor-pointer transition-colors" />
                <Facebook size={20} className="hover:text-brand-gold cursor-pointer transition-colors" />
                <Twitter size={20} className="hover:text-brand-gold cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-brand-gold mb-8">Creative Studio</h5>
              <div className="flex flex-col gap-4 text-sm font-sans text-brand-black/60">
                <a href="#collections" className="hover:text-brand-black transition-colors underline decoration-brand-black/10 underline-offset-4">Collections</a>
                <a href="#philosophy" className="hover:text-brand-black transition-colors underline decoration-brand-black/10 underline-offset-4">Philosophy</a>
                <a href="#bespoke" className="hover:text-brand-black transition-colors underline decoration-brand-black/10 underline-offset-4">Bespoke Spaces</a>
                <a href="#journal" className="hover:text-brand-black transition-colors underline decoration-brand-black/10 underline-offset-4">Narratives</a>
              </div>
            </div>

            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-brand-gold mb-8">Join the Pulse</h5>
              <p className="text-xs text-brand-black/50 mb-6 italic font-sans leading-relaxed">Early access to limited sculptures and seasonal reveals.</p>
              <div className="flex border-b border-brand-black pb-2 group">
                <input 
                  type="email" 
                  placeholder="Private Address" 
                  className="bg-transparent border-none outline-none text-brand-black w-full text-xs placeholder:text-brand-black/30 font-sans"
                />
                <button className="text-brand-black group-hover:text-brand-gold transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
              <button 
                onClick={() => setView("admin")}
                className="mt-8 text-[10px] uppercase tracking-widest text-brand-black/20 hover:text-brand-gold transition-colors font-sans"
              >
                Admin Portal
              </button>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-black/30">
              &copy; 2024 Blurby Interior Design Studio
            </p>
            <div className="flex gap-10 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-black/30">
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

function AdminDashboard({ section, setSection, exitAdmin }: { section: string, setSection: (s: string) => void, exitAdmin: () => void }) {
  const MENU_ITEMS = [
    { id: "overview", label: "Overview", icon: <Maximize2 size={18} /> },
    { id: "projects", label: "Projects", icon: <ArrowRight size={18} /> },
    { id: "gallery", label: "Gallery", icon: <Instagram size={18} /> },
    { id: "bookings", label: "Bookings", icon: <ChevronRight size={18} /> },
    { id: "inquiries", label: "Inquiries", icon: <X size={18} /> },
    { id: "blog", label: "Journal", icon: <Menu size={18} /> },
    { id: "designers", label: "Designers", icon: <ChevronRight size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-brand-beige overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-black text-white flex flex-col p-8 z-20">
        <div className="text-2xl font-serif italic mb-16 px-4">BLURBY <span className="text-brand-gold text-xs not-italic uppercase tracking-widest block">Admin</span></div>
        
        <nav className="flex-1 space-y-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-sans transition-all ${
                section === item.id ? "bg-brand-gold text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={exitAdmin}
          className="mt-auto flex items-center gap-4 px-4 py-3 text-white/40 hover:text-brand-gold text-[10px] uppercase tracking-[0.2em] font-sans transition-all"
        >
          <Minimize2 size={18} />
          Exit Portal
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <header className="flex justify-between items-center mb-16">
          <h2 className="text-3xl font-serif italic capitalize">{section}</h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-sans font-bold">Studio Director</p>
              <p className="text-brand-black/40 text-[10px] lowercase font-sans italic">director@blurby.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-serif">A</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {section === "overview" && <OverviewGrid />}
            {section === "projects" && <ManagementList title="Project Portfolio" items={PORTFOLIO} />}
            {section === "gallery" && <ManagementList title="Image Gallery" items={PORTFOLIO.slice(0, 4)} />}
            {section === "bookings" && <BookingList />}
            {section === "inquiries" && <InquiryList />}
            {section === "blog" && <ManagementList title="Journal Submissions" items={[]} />}
            {section === "designers" && <DesignerList />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function OverviewGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { label: "Active Project Phases", value: "12", trend: "+2 this month" },
        { label: "Pending Consulations", value: "08", trend: "High priority" },
        { label: "Materials Inventoried", value: "42", trend: "Stock status: Good" },
      ].map((stat) => (
        <div key={stat.label} className="p-8 bg-white shadow-sm border-t-2 border-brand-gold rounded-sm">
          <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-brand-black/40 mb-4">{stat.label}</p>
          <p className="text-5xl font-serif mb-4 italic">{stat.value}</p>
          <p className="text-[10px] font-sans text-brand-gold italic">{stat.trend}</p>
        </div>
      ))}

      <div className="md:col-span-3 mt-8 p-12 bg-brand-black text-white rounded-sm overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-4xl font-serif italic mb-6 leading-tight">Spatial Flow Analysis <br /> <span className="text-brand-gold not-italic">Summer 2026</span></h3>
          <p className="text-white/40 font-sans text-sm max-w-md leading-relaxed">Our digital inquiries have increased by 24% following the "Oslo Morning" collection reveal. Primary interest focused on natural textures and minimal kitchen systems.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] border border-brand-gold/10 rounded-full" />
      </div>
    </div>
  );
}

function ManagementList({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="bg-white p-8 shadow-sm rounded-sm">
      <div className="flex justify-between items-center mb-8 pb-8 border-b border-brand-black/5">
        <h3 className="text-lg font-serif italic">{title}</h3>
        <button className="px-6 py-2 bg-brand-black text-white text-[10px] uppercase tracking-widest font-sans hover:bg-brand-gold transition-colors">Add Submission</button>
      </div>
      
      <div className="space-y-4">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-brand-black/5 hover:border-brand-gold/30 transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-beige overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold uppercase tracking-widest">{item.title}</h4>
                <p className="text-[10px] text-brand-black/40 font-sans italic">{item.category}</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] uppercase tracking-widest text-brand-black font-sans hover:text-brand-gold transition-colors">Edit</button>
              <button className="text-[10px] uppercase tracking-widest text-red-500 font-sans hover:text-red-700 transition-colors">Archive</button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-brand-black/5">
            <p className="text-brand-black/20 italic text-[10px] uppercase tracking-widest font-bold">No submissions found in this archive</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingList() {
  const BOOKINGS = [
    { id: "B102", client: "Elena Rossi", space: "Residential Lounge", date: "June 12, 2026", status: "Confimed" },
    { id: "B105", client: "Marcus Thorne", space: "Penthouse Study", date: "June 15, 2026", status: "Pending" },
    { id: "B108", client: "Studio A8", space: "Artisan Workshop", date: "June 18, 2026", status: "Consultation" },
  ];

  return (
    <div className="bg-white p-8 shadow-sm rounded-sm">
      <h3 className="text-lg font-serif italic mb-8 pb-8 border-b border-brand-black/5">Active Consulations</h3>
      <table className="w-full text-left font-sans">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest font-bold text-brand-black/40">
            <th className="pb-6">ID</th>
            <th className="pb-6">Client</th>
            <th className="pb-6">Requirement</th>
            <th className="pb-6">Date</th>
            <th className="pb-6">Status</th>
            <th className="pb-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-brand-black/5">
          {BOOKINGS.map((b) => (
            <tr key={b.id} className="group">
              <td className="py-6 font-bold">{b.id}</td>
              <td className="py-6">{b.client}</td>
              <td className="py-6 italic text-brand-black/60">{b.space}</td>
              <td className="py-6">{b.date}</td>
              <td className="py-6">
                <span className={`text-[10px] uppercase px-3 py-1 rounded-full ${
                  b.status === "Confimed" ? "bg-green-100 text-green-700" : "bg-brand-gold/10 text-brand-gold"
                }`}>
                  {b.status}
                </span>
              </td>
              <td className="py-6 text-right">
                <button className="text-brand-gold hover:underline">Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InquiryList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { from: "Julian V.", subject: "Maison Living Inquiry", text: "I'm interested in the sustainable oak flooring seen in your Maison Living series...", time: "2h ago" },
        { from: "Sophie L.", subject: "Bespoke Lighting", text: "Looking for a custom sculptural piece for a high-ceiling atrium project...", time: "5h ago" },
      ].map((msg) => (
        <div key={msg.from} className="p-8 bg-white border border-brand-black/5 rounded-sm hover:border-brand-gold transition-colors group">
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-sm font-sans font-bold uppercase tracking-widest">{msg.from}</h4>
            <span className="text-[10px] italic text-brand-black/40">{msg.time}</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-4">{msg.subject}</p>
          <p className="font-sans text-sm leading-relaxed text-brand-black/60 mb-6 italic">{msg.text}</p>
          <div className="flex gap-4">
            <button className="text-[10px] uppercase font-bold tracking-widest text-brand-black border-b border-brand-black">Reply</button>
            <button className="text-[10px] uppercase font-bold tracking-widest text-brand-black/40">Archive</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesignerList() {
  const DESIGNERS = [
    { name: "Adrian Blurby", role: "Principal Architect", location: "Milan" },
    { name: "Elena Solst", role: "Senior Stylist", location: "Paris" },
    { name: "Thomas Cael", role: "Material Specialist", location: "New York" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {DESIGNERS.map((d) => (
        <div key={d.name} className="bg-white p-8 rounded-sm shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-2xl font-serif italic mb-2">{d.name}</h4>
            <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-brand-black/40 mb-8">{d.role}</p>
            <div className="flex items-center gap-2 text-[10px] tracking-widest text-brand-gold">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              {d.location} Studio
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ChevronRight size={120} />
          </div>
        </div>
      ))}
    </div>
  );
}
