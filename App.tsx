/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Zap, Shield, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Activity, Target, ArrowRight } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import ArtistCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import { Artist } from './types';
import { useMobile } from './hooks/useMobile';

// RHC Tournament Data
const DIVISIONS: Artist[] = [
  { 
    id: '1', 
    name: 'Tournament Details', 
    genre: 'Format & Rules', 
    day: 'APR 17-18', 
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=1000&auto=format&fit=crop',
    description: `The EHD Spring Tour offers a professional hockey experience for players of all levels. \n\nGAME FORMAT:\nEvery team is guaranteed 5 games. Games consist of 3 x 15-minute stop-time periods. Ice resurfacing takes place between every game. \n\nRULES:\nWe play by modified IIHF rules. No checking in adult recreational divisions. Slapshots are allowed. Fighting leads to immediate disqualification. \n\nDIVISIONS:\nWe offer skill levels ranging from former pros to recreational beer leaguers. We strictly police roster rules to ensure competitive balance. \n\nSCHEDULE:\nThe tournament begins Friday morning and concludes with championship games on Sunday afternoon. A full schedule is released 2 weeks prior to the event.`
  },
  { 
    id: '2', 
    name: 'Arenas', 
    genre: 'Venues', 
    day: 'APR 17-19', 
    image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?q=80&w=1000&auto=format&fit=crop',
    description: `Compete in Riga's finest ice hockey facilities. \n\nARENA RIGA:\nThe crown jewel of Latvian hockey. This 10,300-seat arena hosted the 2006 and 2021 IIHF World Championships. It features NHL-quality ice, professional locker rooms, and a massive jumbotron. \n\nVOLVO SPORTS CENTRE:\nThe premier practice facility in the city, featuring two regulation-sized rinks. Known for its fast ice and excellent spectator viewing areas. \n\nINBOX ICE HALL:\nA modern facility located in the suburbs, offering a perfect intimate setting for tournament play with an attached restaurant and bar overlooking the ice.`
  },
  { 
    id: '3', 
    name: 'Pricing', 
    genre: 'Packages', 
    day: 'APR 18-19', 
    image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1000&auto=format&fit=crop',
    description: `We offer comprehensive packages to make your trip seamless. \n\nINDIVIDUAL ENTRY ($195):\nIncludes minimum 4 games, jersey, socks, and access to all social events. Ideal for draft tournament players. \n\nTEAM ENTRY ($2500):\nRegister your full squad. Includes 15 player passes and 1 goalie pass. Does not include travel or accommodation. \n\nVIP TRAVEL PACKAGE ($1400/pp):\nIncludes 5 nights at a 4-star Hotel in Old Riga, airport transfers, daily breakfast, 3 team dinners, canal boat tour, and dedicated team guide. \n\n*Flights are not included in any package.`
  },
];

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const isMobile = useMobile();
  
  // Parallax for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Artist | null>(null);
  
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedDivision) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedDivision]);

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div 
      ref={containerRef} 
      className={`relative h-screen w-full overflow-y-scroll overflow-x-hidden bg-transparent text-white scroll-smooth ${!isMobile ? 'snap-y snap-mandatory' : ''}`}
    >
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 md:px-8 py-4 md:py-6 pointer-events-none">
        {/* Desktop Menu - Centered Pill */}
        <div className="hidden md:flex items-center gap-1 p-1.5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full pointer-events-auto shadow-2xl shadow-black/20 transform hover:scale-[1.02] transition-transform duration-300">
          {['Tournament', 'Experience', 'Register'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="relative px-6 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-transparent hover:border-white/5"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white absolute right-6 top-6 z-50 w-10 h-10 flex items-center justify-center pointer-events-auto bg-black/20 backdrop-blur-md rounded-full border border-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-[#1a1b3b] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Tournament', 'Experience', 'Register'].map((item) => (
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
              className="mt-8 border border-[#4fb7b3] px-10 py-4 text-sm font-bold tracking-widest uppercase bg-[#4fb7b3] text-black shadow-[0_0_20px_rgba(79,183,179,0.3)]"
            >
              Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className={`relative h-screen w-full shrink-0 flex flex-col items-center justify-center overflow-hidden px-4 ${!isMobile ? 'snap-start' : ''}`}>
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-7xl pb-16 md:pb-12"
        >
           {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] md:text-sm font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.2em] uppercase mb-6 bg-black/30 px-5 py-3 rounded-full backdrop-blur-md border border-white/5"
          >
            <span className="font-bold text-white">Riga, Latvia</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span className="text-center">Travel Dates Apr 13-20, 2026 | Tournament: Apr 17-19, 2026</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center px-2">
            <GradientText 
              text="Riga Hockey Cup 2026" 
              as="h1" 
              className="text-[12vw] md:text-[6.5vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
            <motion.div 
               className="absolute -z-20 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-white/5 blur-[40px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-4 md:mt-6 mb-8 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-2xl font-light max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-6 mb-10 md:mb-10"
          >
            The EHD Spring Tour presents the ultimate international showdown. Competing nations include USA, Canada, Sweden, Finland, Czechia, and Switzerland. Join elite teams for world-class competition in Latvia.
          </motion.p>
          
          {/* Main CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              opacity: { delay: 1, duration: 1 },
              y: { delay: 1, duration: 1 },
              scale: { duration: 0.2, ease: "easeInOut" }
            }}
            onClick={() => scrollToSection('register')}
            className="group relative px-8 md:px-12 py-4 md:py-6 bg-[#4fb7b3] text-black font-heading font-bold text-base md:text-2xl uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(79,183,179,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] flex items-center gap-4 overflow-hidden"
          >
            <span className="relative z-10">Register Your Interest</span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </motion.button>

        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-4 md:bottom-12 left-0 w-full py-2 md:py-4 bg-white text-black z-20 overflow-hidden border-y-2 md:border-y-4 border-black shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(2)].map((_, i) => (
                  <span key={i} className="text-sm md:text-3xl font-heading font-black px-4 md:px-6 flex items-center gap-3">
                    EHD Spring Tour x Riga Hockey Cup 2026 | Travel Date: April 13 to April 20 <span className="text-black text-xs md:text-3xl">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* DIVISIONS SECTION */}
      <section id="tournament" className={`relative min-h-screen w-full shrink-0 flex flex-col justify-center py-8 md:py-20 px-4 ${!isMobile ? 'snap-start' : ''}`}>
        <div className="max-w-[1400px] w-full mx-auto px-2 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-12 px-2">
             <h2 className="text-2xl md:text-5xl font-heading font-bold uppercase leading-[1.1] drop-shadow-lg break-words w-full md:w-auto">
              Experience the Class and Skill of <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Euro Hockey</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {DIVISIONS.map((division) => (
              <ArtistCard key={division.id} artist={division} onClick={() => setSelectedDivision(division)} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className={`relative min-h-screen w-full shrink-0 flex flex-col justify-center py-16 md:py-20 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden ${!isMobile ? 'snap-start' : ''}`}>
        <div className="absolute top-1/2 right-[-20%] w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-[#4fb7b3]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-6xl w-full mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-3xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Beyond <br/> <GradientText text="THE ICE" className="text-4xl md:text-7xl" />
              </h2>
              <p className="text-base md:text-lg text-gray-200 mb-8 font-light leading-relaxed drop-shadow-md">
                RHC isn't just a tournament; it's a celebration of hockey culture. We combine elite competition with a festival atmosphere.
              </p>
              
              <div className="space-y-6 md:space-y-6">
                {[
                  { icon: Shield, title: 'Pro Conditions', desc: 'NHL-regulation ice maintenance and facilities.' },
                  { icon: Users, title: 'Draft Party', desc: 'Friday night team selection and networking event.' },
                  { icon: Trophy, title: 'Championship Sunday', desc: 'Televised finals with trophy ceremony.' },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 font-heading">{feature.title}</h4>
                      <p className="text-xs text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[300px] md:h-[500px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-2xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-black/40">
                <img 
                  src="https://images.unsplash.com/photo-1563714272138-76c253b7c7b8?q=80&w=2000&auto=format&fit=crop" 
                  alt="Riga Skyline" 
                  className="h-full w-full object-cover object-center transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  style={{ opacity: 0, transition: 'opacity 0.5s ease-in-out' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* RHC Badge Overlay Simulation */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#1a1b3b]/90 backdrop-blur-xl border-2 border-[#4fb7b3] flex flex-col items-center justify-center p-2 shadow-[0_0_30px_rgba(79,183,179,0.3)]">
                    <div className="text-[8px] md:text-[10px] font-bold text-[#a8fbd3] uppercase text-center leading-tight mb-1">Europe's<br/>Largest</div>
                    <div className="text-lg md:text-2xl font-heading font-black text-white leading-none tracking-tighter">RHC</div>
                    <div className="text-[8px] md:text-[10px] font-bold text-[#a8fbd3] uppercase tracking-widest mt-1">2026</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <div className="text-base md:text-lg font-bold tracking-widest uppercase mt-1 text-white opacity-80">
                    26 Teams Competing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER SECTION */}
      <section id="register" className={`relative min-h-screen w-full shrink-0 flex flex-col justify-center py-16 md:py-20 px-6 bg-black/30 backdrop-blur-lg ${!isMobile ? 'snap-start' : ''}`}>
        <div className="max-w-6xl w-full mx-auto">
          <div className="text-center mb-10 md:mb-16">
             <h2 className="text-5xl md:text-8xl font-heading font-bold opacity-20 text-white">
               JOIN
             </h2>
             <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-4 md:-mt-6 relative z-10 text-xs md:text-sm">
               Secure your spot on the roster
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
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
                  whileHover={isDisabled || isMobile ? {} : { y: -10 }}
                  className={`relative p-8 md:p-8 border border-white/10 backdrop-blur-md flex flex-col min-h-[350px] md:min-h-[450px] transition-colors duration-300 ${ticket.accent} ${isDisabled && !isPurchased ? 'opacity-50 grayscale' : ''} will-change-transform`}
                  data-hover={!isDisabled}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white">{ticket.name}</h3>
                    <div className={`text-4xl md:text-5xl font-bold mb-8 tracking-tighter ${ticket.color === 'white' ? 'text-white' : ticket.color === 'teal' ? 'text-[#4fb7b3]' : 'text-[#637ab9]'}`}>
                      {ticket.price}
                    </div>
                    <ul className="space-y-4 text-sm text-gray-200">
                      <li className="flex items-center gap-3"><Activity className="w-4 h-4 text-gray-400" /> Minimum 4 Games</li>
                      <li className="flex items-center gap-3"><Target className="w-4 h-4 text-gray-400" /> Stats & Tracking</li>
                      {i > 0 && <li className="flex items-center gap-3 text-white"><Zap className={`w-4 h-4 text-[#a8fbd3]`} /> Custom Jerseys</li>}
                      {i > 1 && <li className="flex items-center gap-3 text-white"><Users className={`w-4 h-4 text-[#4fb7b3]`} /> Brand Activation</li>}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(i)}
                    disabled={isDisabled}
                    className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] border border-white/20 transition-all duration-300 mt-8 group overflow-hidden relative 
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
                      className="text-[10px] text-center mt-2 text-white/40 font-mono"
                    >
                      Interest registered for www.rhc.com
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <footer className="w-full border-t border-white/10 py-12 md:py-12 bg-black/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div>
               <div className="font-heading text-2xl md:text-3xl font-bold tracking-tighter mb-2 text-white">RHC INVITE</div>
               <div className="flex gap-2 text-[10px] font-mono text-gray-400">
                 <span>Official Registration Portal</span>
               </div>
            </div>
            
            <div className="flex gap-8 flex-wrap">
              <a href="https://x.com/GoogleAIStudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer" data-hover="true">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer" data-hover="true">
                Rules
              </a>
               <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer" data-hover="true">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </section>


      {/* Division Detail Modal */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDivision(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-lg cursor-auto"
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:w-[95vw] h-full md:h-[90vh] bg-[#1a1b3b] border-t md:border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#4fb7b3]/10 group/modal rounded-t-[2rem] md:rounded-xl"
            >
              {/* Close Button - Fixed to Corner */}
              <button
                onClick={() => setSelectedDivision(null)}
                className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Side - Fixed on Desktop */}
              <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedDivision.id}
                    src={selectedDivision.image} 
                    alt={selectedDivision.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r md:from-[#1a1b3b]/80" />
                
                {/* Mobile Title Overlay */}
                <div className="absolute bottom-4 left-6 md:hidden">
                    <h3 className="text-3xl font-heading font-bold uppercase leading-none text-white drop-shadow-md">
                        {selectedDivision.name}
                    </h3>
                </div>
              </div>

              {/* Content Side - Scrollable */}
              <div className="w-full md:w-1/2 h-full overflow-y-auto bg-[#1a1b3b] relative custom-scrollbar">
                 <div className="absolute bottom-6 right-6 z-20 flex gap-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigateDivision('prev'); }}
                        className="p-3.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm pointer-events-auto"
                        data-hover="true"
                        aria-label="Previous Division"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateDivision('next'); }}
                        className="p-3.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm pointer-events-auto"
                        data-hover="true"
                        aria-label="Next Division"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                 </div>

                <div className="p-8 md:p-16 flex flex-col min-h-full pb-32">
                  <motion.div
                    key={selectedDivision.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className="hidden md:flex items-center gap-2 text-[#4fb7b3] mb-6">
                       <Calendar className="w-4 h-4" />
                       <span className="font-mono text-sm tracking-widest uppercase">{selectedDivision.day}</span>
                    </div>
                    
                    <h3 className="hidden md:block text-5xl lg:text-7xl font-heading font-bold uppercase leading-[0.9] mb-4 text-white">
                      {selectedDivision.name}
                    </h3>
                    
                    <p className="text-lg text-[#a8fbd3] font-medium tracking-widest uppercase mb-8">
                      {selectedDivision.genre}
                    </p>
                    
                    <div className="h-px w-24 bg-white/20 mb-10" />
                    
                    <div className="space-y-6">
                         {selectedDivision.description.split('\n\n').map((paragraph, i) => (
                             <motion.p 
                                key={i} 
                                className={`text-gray-300 leading-relaxed text-base md:text-lg font-light ${paragraph.includes(':') ? 'text-white font-bold' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                             >
                               {paragraph}
                             </motion.p>
                         ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;