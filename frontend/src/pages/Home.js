import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Star, Search, ArrowRight, Smile } from 'lucide-react';

// --- MOCK ASSETS (Replace these with your actual imports) ---
// In your real project, keep your imports:
// import img1 from '../assets/1.jpeg';
// import img2 from '../assets/2.jpeg';

const img1 = "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600";
const img2 = "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=600";
const img3 = "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600"; // Added a 3rd for better sliding effect

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [img1, img2, img3];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['All', 'Creamy', 'Popsicles', 'Sorbet', 'Vegan'];

  const popularFlavors = [
    { id: 1, name: "Berry Blast", price: "$4.50", color: "bg-pink-100", img: "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=300" },
    { id: 2, name: "Minty Fresh", price: "$5.00", color: "bg-teal-100", img: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d1?auto=format&fit=crop&q=80&w=300" },
    { id: 3, name: "Choco Dream", price: "$4.80", color: "bg-amber-100", img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=300" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-20 overflow-x-hidden">
      {/* Injecting Fonts & Custom Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;600;700&family=Quicksand:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Quicksand', sans-serif;
        }
        
        h1, h2, h3, .funky-text {
          font-family: 'Fredoka', sans-serif;
        }

        .blob-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 8s ease-in-out infinite;
        }
        
        @keyframes fade-in-slide {
          0% { opacity: 0; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fade-in-slide 0.8s ease-out forwards;
        }

        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        
        /* Hide scrollbar for horizontal scroll */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>

 

      {/* --- HERO BANNER (Typography & Slideshow) --- */}
      <div className="relative pt-28 pb-12 px-6 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-pink-300/30 blob-shape blur-3xl -z-10"></div>
        <div className="absolute top-[10%] right-[-20%] w-72 h-72 bg-yellow-200/40 blob-shape blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-56 h-56 bg-blue-200/30 blob-shape blur-3xl -z-10"></div>

        {/* Main Content */}
        <div className="flex flex-col items-center text-center z-10 relative">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-white backdrop-blur-sm text-pink-500 font-bold text-xs uppercase tracking-wider mb-4 shadow-sm animate-bounce">
            New Summer Flavors
          </span>
          
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2 text-gray-900 drop-shadow-sm">
            Taste the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">Magic</span>
          </h1>
          
          <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8">
            Premium scoops made with love and fresh ingredients.
          </p>

          {/* --- SLIDESHOW SECTION --- */}
          <div className="relative w-full max-w-md h-80 my-4 mx-auto perspective-1000">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-pink-200 to-yellow-100 rounded-full blur-md opacity-80"></div>
            
            {/* Funky Framed Slideshow */}
            <div className="absolute inset-0 transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="w-full h-full p-2 bg-white rounded-[2rem] shadow-2xl border-4 border-pink-50 overflow-hidden relative">
                  {/* Current Image */}
                  <img 
                    key={currentSlide} // Key forces re-render for animation
                    src={bannerImages[currentSlide]} 
                    alt="Delicious Ice Cream" 
                    className="w-full h-full object-cover rounded-[1.5rem] animate-fade-in"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-pink-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    #Yummy
                  </div>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-1.5 bg-black/20 backdrop-blur-sm rounded-full">
                    {bannerImages.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                        }`} 
                      />
                    ))}
                  </div>
               </div>
            </div>
            
            {/* Floating Decorative Elements */}
            <div className="absolute -bottom-2 -left-2 bg-yellow-400 text-white p-2.5 rounded-full shadow-lg animate-bounce">
                <Star fill="white" size={20} />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8 w-full justify-center">
            <button className="flex-1 max-w-[160px] bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 group">
              Order Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-14 h-14 bg-white text-pink-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all border border-pink-100">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* --- SEARCH & CATEGORIES --- */}
      <div className="px-6 mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search flavor..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- POPULAR SECTION --- */}
      <div className="px-6 pb-24">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Now</h2>
          <a href="#" className="text-pink-500 text-sm font-bold">See All</a>
        </div>

        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6">
          {popularFlavors.map((item) => (
            <div key={item.id} className="min-w-[220px] bg-white rounded-3xl p-3 shadow-sm border border-gray-50 relative group">
              <div className={`h-40 ${item.color} rounded-2xl mb-3 overflow-hidden relative`}>
                <img src={item.img} className="w-full h-full object-cover mix-blend-overlay opacity-80" alt={item.name} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <img src={item.img} className="w-32 h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl text-gray-900">{item.price}</span>
                  <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-pink-500 transition-colors">
                    <span className="text-lg pb-1">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     

    </div>
  );
};

export default function App() {
  return <Home />;
}