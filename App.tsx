/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Zap, Shield, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Activity, Target } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import { Artist } from './types';

// RHC Tournament Data
const DIVISIONS: Artist[] = [
  { 
    id: '1', 
    name: 'Pro Elite', 
    genre: 'Premier Tier', 
    day: 'FEB 14', 
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=1000&auto=format&fit=crop',
    description: 'The pinnacle of the tournament. Current and former pros battling for the RHC Cup. High speed, full contact, pure skill.'
  },
  { 
    id: '2', 
    name: 'Open Div', 
    genre: 'Competitive', 
    day: 'FEB 14', 
    image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=1000&auto=format&fit=crop',
    description: 'For competitive club players and college alumni. Fast-paced action with full stats tracking and live commentary.'
  },
  { 
    id: '3', 
    name: '35+ Legends', 
    genre: 'Veterans', 
    day: 'FEB 15', 
    image: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1000&auto=format&fit=crop',
    description: 'Experience meets grit. The Legends division features seasoned veterans who still have hands of gold and ice in their veins.'
  },
  { 
    id: '4', 
    name: 'Draft Tourney', 
    genre: 'Individual Entry', 
    day: 'FEB 15', 
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1000&auto=format&fit=crop',
    description: 'No team? No problem. Enter the draft, get drafted by a captain, and bond with new teammates over a weekend of glory.'
  },
  { 
    id: '5', 
    name: 'Women\'s Elite', 
    genre: 'Showcase', 
    day: 'FEB 16', 
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=1000&auto=format&fit=crop',
    description: 'Top-tier women\'s hockey featuring national team talent and collegiate stars competing for the Empress Trophy.'
  },
  { 
    id: '6', 
    name: 'Skills Comp', 
    genre: 'All-Star Event', 
    day: 'FEB 16', 
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000&auto=format&fit=crop',
    description: 'Fastest skater, hardest shot, and shootout showdown. The Sunday morning spectacle that crowns the individual kings of the ice.'
  },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Artist | null>(null);
  
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDivision) return;
      if (e.key === 'ArrowLeft') navigateDivision('prev');
      if (e.key === 'ArrowRight') navigateDivision('next');
      if (e.key === 'Escape') setSelectedDivision(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDivision]);

  const handlePurchase = (index: number) => {
    setPurchasingIndex(index);
    setTimeout(() => {
      setPurchasingIndex(null);
      setPurchasedIndex(index);
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateDivision = (direction: 'next' | 'prev') => {
    if (!selectedDivision) return;
    const currentIndex = DIVISIONS.findIndex(a => a.id === selectedDivision.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % DIVISIONS.length;
    } else {
      nextIndex = (currentIndex - 1 + DIVISIONS.length) % DIVISIONS.length;
    }
    setSelectedDivision(DIVISIONS[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">RHC</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {['Divisions', 'Experience', 'Register'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#a8fbd3] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => scrollToSection('register')}
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Sign Up
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#31326f]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Divisions', 'Experience', 'Register'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-4xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('register')}
              className="mt-8 border border-white px-10 py-4 text-sm font-bold tracking-widest uppercase bg-white text-black"
            >
              Join Now
            </button>
            
            <div className="absolute bottom-10 flex gap-6">
               <a href="https://x.com/GoogleAIStudio" className="text-white/50 hover:text-white transition-colors">Twitter</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
           {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>RHC Arena</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>Feb 14-16, 2025</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="RHC INVITE" 
              as="h1" 
              className="text-[15vw] md:text-[14vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
            {/* Optimized Orb */}
            <motion.div 
               className="absolute -z-20 w-[50vw] h-[50vw] bg-white/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-4"
          >
            The Ultimate Hockey Experience
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Duplicate content for seamless loop */}
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    RHC 2025 <span className="text-black text-2xl md:text-4xl">●</span> 
                    PURE SKILL <span className="text-black text-2xl md:text-4xl">●</span> 
                    ICE COLD <span className="text-black text-2xl md:text-4xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* DIVISIONS SECTION */}
      <section id="divisions" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg break-words w-full md:w-auto">
              Featured <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Divisions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {DIVISIONS.map((division) => (
              <ArtistCard key={division.id} artist={division} onClick={() => setSelectedDivision(division)} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="relative z-10 py-20 md:py-32 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-[#4fb7b3]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Beyond <br/> <GradientText text="THE ICE" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-md">
                RHC isn't just a tournament; it's a celebration of hockey culture. We combine elite competition with a festival atmosphere, creating unforgettable moments on and off the rink.
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: Shield, title: 'Pro Conditions', desc: 'NHL-regulation ice maintenance and facilities.' },
                  { icon: Users, title: 'Draft Party', desc: 'Friday night team selection and networking event.' },
                  { icon: Trophy, title: 'Championship Sunday', desc: 'Televised finals with trophy ceremony.' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000&auto=format&fit=crop" 
                  alt="RHC Arena" 
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    24
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    Teams Competing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER SECTION */}
      <section id="register" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white">
               JOIN
             </h2>
             <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
               Secure your spot on the roster
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free Agent', price: '$150', color: 'white', accent: 'bg-white/5' },
              { name: 'Team Entry', price: '$2500', color: 'teal', accent: 'bg-[#4fb7b3]/10 border-[#4fb7b3]/50' },
              { name: 'Corporate', price: 'Partner', color: 'periwinkle', accent: 'bg-[#637ab9]/10 border-[#637ab9]/50' },
            ].map((ticket, i) => {
              const isPurchasing = purchasingIndex === i;
              const isPurchased = purchasedIndex === i;
              const isDisabled = (purchasingIndex !== null) || (purchasedIndex !== null);

              return (
                <motion.div
                  key={i}
                  whileHover={isDisabled ? {} : { y: -20 }}
                  className={`relative p-8 md:p-10 border border-white/10 backdrop-blur-md flex flex-col min-h-[450px] md:min-h-[550px] transition-colors duration-300 ${ticket.accent} ${isDisabled && !isPurchased ? 'opacity-50 grayscale' : ''} will-change-transform`}
                  data-hover={!isDisabled}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white">{ticket.name}</h3>
                    <div className={`text-5xl md:text-6xl font-bold mb-8 md:mb-10 tracking-tighter ${ticket.color === 'white' ? 'text-white' : ticket.color === 'teal' ? 'text-[#4fb7b3]' : 'text-[#637ab9]'}`}>
                      {ticket.price}
                    </div>
                    <ul className="space-y-4 md:space-y-6 text-sm text-gray-200">
                      <li className="flex items-center gap-3"><Activity className="w-5 h-5 text-gray-400" /> Minimum 4 Games</li>
                      <li className="flex items-center gap-3"><Target className="w-5 h-5 text-gray-400" /> Stats & Tracking</li>
                      {i > 0 && <li className="flex items-center gap-3 text-white"><Zap className={`w-5 h-5 text-[#a8fbd3]`} /> Custom Jerseys</li>}
                      {i > 1 && <li className="flex items-center gap-3 text-white"><Users className={`w-5 h-5 text-[#4fb7b3]`} /> Brand Activation</li>}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(i)}
                    disabled={isDisabled}
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border border-white/20 transition-all duration-300 mt-8 group overflow-hidden relative 
                      ${isPurchased 
                        ? 'bg-[#a8fbd3] text-black border-[#a8fbd3] cursor-default' 
                        : isPurchasing 
                          ? 'bg-white/20 text-white cursor-wait'
                          : isDisabled 
                            ? 'cursor-not-allowed opacity-50' 
                            : 'text-white cursor-pointer hover:bg-white hover:text-black'
                      }`}
                  >
                    <span className="relative z-10">
                      {isPurchasing ? 'Processing...' : isPurchased ? 'Registered' : 'Register Interest'}
                    </span>
                    {!isDisabled && !isPurchased && !isPurchasing && (
                      <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
                    )}
                  </button>
                  
                  {isPurchased && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-center mt-3 text-white/40 font-mono"
                    >
                      Interest registered for www.rhc.com
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">RHC INVITE</div>
             <div className="flex gap-2 text-xs font-mono text-gray-400">
               <span>Official Registration Portal</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="https://x.com/GoogleAIStudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Rules
            </a>
             <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Division Detail Modal */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDivision(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#1a1b3b] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#4fb7b3]/10 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDivision(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateDivision('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm"
                data-hover="true"
                aria-label="Previous Division"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateDivision('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8"
                data-hover="true"
                aria-label="Next Division"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedDivision.id}
                    src={selectedDivision.image} 
                    alt={selectedDivision.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedDivision.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-[#4fb7b3] mb-4">
                     <Calendar className="w-4 h-4" />
                     <span className="font-mono text-sm tracking-widest uppercase">{selectedDivision.day}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-2 text-white">
                    {selectedDivision.name}
                  </h3>
                  
                  <p className="text-lg text-[#a8fbd3] font-medium tracking-widest uppercase mb-6">
                    {selectedDivision.genre}
                  </p>
                  
                  <div className="h-px w-20 bg-white/20 mb-6" />
                  
                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">
                    {selectedDivision.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;