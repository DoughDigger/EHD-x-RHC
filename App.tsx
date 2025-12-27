/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Import Icons
// Import Icons
import { Trophy, Users, Zap, Shield, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Activity, Target, ArrowRight, Star, Plane, Utensils, MapPinned, Hotel, Bus, HelpCircle, Globe, Instagram, Youtube } from 'lucide-react';

// Import global styles
import './index.css';

import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import ArtistCard from './components/ArtistCard';
import CommitmentForm, { CommitmentFormData } from './components/CommitmentForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QuestionForm from './components/QuestionForm';
import { Artist } from './types';
import { useMobile } from './hooks/useMobile';
import { useDevice } from './hooks/useDevice';

// Custom Icons
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// RHC Tournament Data
const DIVISIONS: Artist[] = [
  {
    id: '1',
    name: 'Tournament Details',
    genre: 'Format & Rules',
    day: 'APR 17-19',
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=1000&auto=format&fit=crop',
    intro: `RIGA HOCKEY CUP is the largest youth ice hockey tournament in Europe, celebrating its 20th anniversary in 2026. The tournament fosters sportsmanship and the development of skills across multiple divisions in a competitive yet friendly environment.`,
    thrillSection: {
      title: '3 DAYS OF THRILL',
      items: [
        'Live player stats updated on official website www.rhc.com',
        'Active social media posts coverage',
        'Player of the game awards',
        'BAUER ALL STAR Team awards for each age group',
        'Sunday Finals and Awarding ceremony with all teams'
      ],
      videoLink: {
        text: 'Check out highlights from RHC 2025',
        url: 'https://www.youtube.com/watch?v=iPvC6G0_bdg'
      }
    },
    description: `GAME FORMAT:\nEvery team is guaranteed 7 games over 3 days. Games consist of 3 x 15-minute stop-time periods. Ice resurfacing takes place between every game. \n\nRULES:\nAll games are conducted in accordance with IIHF rules. Body checking is allowed primarily along the boards when there's a "clear intention of playing the puck or attempting to gain possession," following IIHF guidelines but with unique elements, meaning hits must be puck-focused (e.g. open ice hits are ruled as penalty). \n\nSCHEDULE:\nThe tournament begins Friday morning and concludes with championship games on Sunday afternoon. A full schedule is released 2 weeks prior to the event.`
  },
  {
    id: '2',
    name: 'Arenas',
    genre: 'Venues',
    day: 'APR 17-19',
    image: '/arena_riga_thumb.jpg',
    images: ['/arena_riga_thumb.jpg', '/arena_1.jpg', '/arena_2.jpg', '/arena_3.jpg', '/arena_4.jpg', '/arena_5.jpg', '/arena_6.jpg', '/arena_7.jpg'],
    description: `RIGA HOCKEY CUP tournament is held in 10 new and modern arenas in close proximity each other.`,
    listItems: [
      'Akropole Arena (located in the middle of Shopping Mall)',
      'Marupes Ledus Halle',
      'Inbox Ledus Halle',
      'Zemgales Ledus Halle',
      'OZO Ledus Halle',
      'Kurbads Ledus Halle',
      'Daugavas Ledus Halle',
      'Vidzemes Ledus Halle'
    ]
  },
  {
    id: '3',
    name: 'Pricing',
    genre: 'Packages',
    day: 'APR 18-19',
    image: '/pricing_tile_v2.jpg',
    description: '',
    thrillSection: {
      title: 'What\'s Included',
      items: [
        'Tournament Fee',
        'Jersey, socks, T-shirt and hat',
        '6 nights (Check in Apr 14, Check out Apr 20) stay at 4* Hotel in Downtown Riga (Radisson Blu Daugava) incl. breakfast for all guests',
        'Team bus transfers x8 (Airport transfers x2, Round trip transfer to games x6)',
        '2 Guided Group Sightseeing Tours (Timing: Pre-tournament start; Options to be provided once roster confirmed)',
        '3 lunches/ 2 dinners for Players only during Tournament days (Fri -Sat- Sun) at the Arenas',
        '2 Pre-Tournament Exhibition games with local teams or practices',
        '1 Group Dinner (Traditional Latvian cuisine)'
      ]
    },
    exclusions: {
      title: 'Not included',
      items: [
        'Airline tickets (Group ticket code will be provided for families to book flights. Standard airfare is approx. $1,000 - $1,100 per person (based on standard ticket offer with carry-on and 1 checked bag))',
        'Additional team bus transfers (can be arranged for a total fee of CAD 200 one way)',
        'Additional team dinners or other events',
        'Travel Insurance',
        'Game Livestreams (can be purchased for $25 CAD for full tournament)'
      ]
    },
    pricing: {
      title: 'CAD',
      packages: [
        { name: 'Fee based on 1 Player + 1 Parent (1 room) package:', price: '$ 3,400' },
        { name: 'Fee based on 1 Player + 2 Guests (1 room) package:', price: '$ 4,600' },
        { name: 'Fee based on 1 Player + 3 Guests (1 room) package:', price: '$ 5,900' }
      ],
      customText: 'Custom Packages are available on request',
      paymentTerms: 'Non-refundable deposit of 50% from total package price required by Feb 15, 2026, full payment by Mar 15, 2026'
    }
  },
];

const CAROUSEL_IMAGES = [
  '/riga_skyline.png',
  '/beyond_ice_1.jpg',
  '/beyond_ice_2.jpg',
  '/beyond_ice_3.jpg',
  '/beyond_ice_4.jpg',
  '/beyond_ice_5.jpg',
  '/beyond_ice_6.jpg',
  '/beyond_ice_7.jpg',
  '/beyond_ice_8.jpg',
  '/beyond_ice_9.jpg',
  '/beyond_ice_10.jpg'
];

const SOCIAL_LINKS = [
  { icon: Globe, url: 'https://www.rhc.lv/en/u14-aa4/teams', label: 'Website' },
  { icon: Instagram, url: 'https://www.instagram.com/riga_hockey_cup/', label: 'Instagram' },
  { icon: TikTokIcon, url: 'https://www.tiktok.com/@rigahockeycup?is_from_webapp=1&sender_device=pc', label: 'TikTok' },
  { icon: Youtube, url: 'https://www.youtube.com/@rigahockeycup4240', label: 'YouTube' }
];

// Trip Schedule Data
const TRIP_SCHEDULE = [
  {
    date: 'Monday, Apr 13',
    day: 'Mon',
    dayNum: '13',
    activities: [
      { time: '5pm', description: 'Departure from Pearson Airport (red-eye flight with 1 layover)', type: 'departure' }
    ]
  },
  {
    date: 'Tuesday, Apr 14',
    day: 'Tue',
    dayNum: '14',
    activities: [
      { time: '1pm', description: 'Arrival at Riga Airport', type: 'arrival' },
      { time: '', description: 'Transfer to hotel', type: 'transfer' },
      { time: '', description: 'No events for rest of the day', type: 'free' }
    ]
  },
  {
    date: 'Wednesday, Apr 15',
    day: 'Wed',
    dayNum: '15',
    activities: [
      { time: '7am', description: 'Breakfast', type: 'meal' },
      { time: '10am', description: 'Guided Tour', type: 'tour' },
      { time: '3:30pm', description: 'Transfer to Rink', type: 'transfer' },
      { time: '5pm', description: 'Game / Practice', type: 'game' },
      { time: '7pm', description: 'Transfer to Hotel', type: 'transfer' }
    ]
  },
  {
    date: 'Thursday, Apr 16',
    day: 'Thu',
    dayNum: '16',
    activities: [
      { time: '7am', description: 'Breakfast', type: 'meal' },
      { time: '10am', description: 'Guided Tour', type: 'tour' },
      { time: '3:30pm', description: 'Transfer to Rink', type: 'transfer' },
      { time: '5pm', description: 'Game / Practice', type: 'game' },
      { time: '7pm', description: 'Transfer to Hotel', type: 'transfer' }
    ]
  },
  {
    date: 'Friday, Apr 17',
    day: 'Fri',
    dayNum: '17',
    tournament: true,
    tournamentDay: 'Tournament Day 1',
    activities: [
      { time: '', description: 'Agenda for the Day TBD based on Tournament Schedule', type: 'tournament' },
      { time: '', description: '3 games expected', type: 'tournament' }
    ]
  },
  {
    date: 'Saturday, Apr 18',
    day: 'Sat',
    dayNum: '18',
    tournament: true,
    tournamentDay: 'Tournament Day 2',
    activities: [
      { time: '', description: 'Agenda for the Day TBD based on Tournament Schedule', type: 'tournament' },
      { time: '', description: '2/3 games expected', type: 'tournament' }
    ]
  },
  {
    date: 'Sunday, Apr 19',
    day: 'Sun',
    dayNum: '19',
    tournament: true,
    tournamentDay: 'Tournament Day 3 (Final)',
    activities: [
      { time: '', description: 'Agenda for the Day TBD based on Tournament Schedule', type: 'tournament' },
      { time: '', description: '2/3 games expected', type: 'tournament' },
      { time: '', description: 'Team Dinner - Latvian Traditional Cuisine', type: 'meal' }
    ]
  },
  {
    date: 'Monday, Apr 20',
    day: 'Mon',
    dayNum: '20',
    activities: [
      { time: '7am', description: 'Breakfast', type: 'meal' },
      { time: '9am', description: 'Transfer to Airport', type: 'transfer' },
      { time: '11:30am', description: 'Departure', type: 'departure' },
      { time: '4pm', description: 'Arrival in Toronto with 1 layover', type: 'arrival' }
    ]
  }
];

const App: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to get icon based on activity type and description
  const getIcon = (type: string, description: string) => {
    switch (type) {
      case 'departure':
      case 'arrival':
        return <Plane className="w-4 h-4 md:w-5 md:h-5" />;
      case 'transfer':
        // Check if it's airport transfer or local transfer
        if (description.toLowerCase().includes('airport')) {
          return <Plane className="w-4 h-4 md:w-5 md:h-5" />;
        } else {
          return <Bus className="w-4 h-4 md:w-5 md:h-5" />;
        }
      case 'game':
        return <Activity className="w-4 h-4 md:w-5 md:h-5" />;
      case 'meal':
        return <Utensils className="w-4 h-4 md:w-5 md:h-5" />;
      case 'tour':
        return <MapPinned className="w-4 h-4 md:w-5 md:h-5" />;
      case 'tournament':
        return <Trophy className="w-4 h-4 md:w-5 md:h-5" />;
      case 'free':
        return <Hotel className="w-4 h-4 md:w-5 md:h-5" />;
      default:
        return <Calendar className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const isMobile = useMobile();
  const device = useDevice();

  // Parallax for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Artist | null>(null);
  const [subCarouselIndex, setSubCarouselIndex] = useState(0);

  // Reset sub-carousel index when division changes
  useEffect(() => {
    setSubCarouselIndex(0);
  }, [selectedDivision?.id]);

  // Auto-cycle arena images
  useEffect(() => {
    if (!selectedDivision?.images || selectedDivision.images.length <= 1) return;

    const interval = setInterval(() => {
      setSubCarouselIndex((prev) => (prev + 1) % (selectedDivision.images?.length || 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedDivision]); // Fixed: removed subCarouselIndex from deps to prevent interval recreation

  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);
  // Registration State
  const [isRegistered, setIsRegistered] = useState(false);

  // Admin State
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState(0);

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminDashboardOpen(false);
  };

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
    // Pricing cards were replaced by inline form, so this is now a no-op 
    // or can be used for analytics in the future.
  };

  const handleCommitmentSubmit = (data: CommitmentFormData) => {
    // Backend call is already handled inside CommitmentForm
    setIsRegistered(true);
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

  const REGISTRATION_PACKAGES = [
    {
      name: "Free Agent",
      price: "$150",
      features: [
        "Individual Player Entry",
        "Full Tournament Access",
        "EHD Jersey Included",
        "Player Profile"
      ],
      accent: "from-white/20 to-white/5",
      textShadow: "shadow-white/20"
    },
    {
      name: "Team Entry",
      price: "$2500",
      features: [
        "Full Team Registration",
        "Up to 17 Players + 2 Coaches",
        "Priority Scheduling",
        "Team Media Package"
      ],
      accent: "from-[#4fb7b3]/20 to-[#4fb7b3]/5",
      textShadow: "shadow-[#4fb7b3]/20",
      popular: true
    },
    {
      name: "Corporate",
      price: "Custom",
      features: [
        "Brand Integration",
        "VIP Arena Lounge",
        "Sponsor Recognition",
        "B2B Networking"
      ],
      accent: "from-[#637ab9]/20 to-[#637ab9]/5",
      textShadow: "shadow-[#637ab9]/20"
    }
  ];



  return (
    <div
      ref={containerRef}
      className={`relative h-screen w-full overflow-y-scroll overflow-x-hidden bg-transparent text-white scroll-smooth custom-scrollbar ${device.isDesktop ? 'snap-y snap-mandatory' : ''}`}
    >
      <FluidBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 md:px-8 py-4 md:py-6 pointer-events-none">
        {/* Desktop Menu - Centered Pill - Show on tablet and up */}
        <div className="hidden lg:flex items-center gap-1 p-1.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full pointer-events-auto shadow-2xl shadow-black/20 transform hover:scale-[1.02] transition-transform duration-300">
          {['Tournament', 'Agenda', 'Experience', 'Register'].map((item) => (
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

        {/* Mobile Menu Toggle - Positioned to avoid logo overlap */}
        <button
          className="lg:hidden text-white fixed right-4 top-4 z-50 w-12 h-12 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg touch-target"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-[#1a1b3b] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {['Tournament', 'Agenda', 'Experience', 'Register'].map((item) => (
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
      <header className={`relative h-screen w-full shrink-0 flex flex-col items-center justify-center overflow-hidden px-4 md:px-4 bg-black/40 ${device.isDesktop ? 'snap-start' : ''}`}>
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-screen-2xl pb-36 md:pb-20 pt-16 md:pt-0"
        >
          {/* Logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="flex items-center gap-6 md:gap-8 lg:gap-16 mb-4 md:mb-3 mt-12"
          >
            <img src="/ehd_logo_user_v5.png" alt="EHD Logo" className="h-32 md:h-56 lg:h-96 object-contain drop-shadow-2xl" />

            {/* Animated crossed lines separator */}
            <motion.div
              className="relative w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center p-2"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
                filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="absolute w-full h-0.5 bg-[#4fb7b3] shadow-[0_0_10px_rgba(79,183,179,0.5)]"
                style={{ transform: 'rotate(45deg)' }}
              />
              <div
                className="absolute w-full h-0.5 bg-[#4fb7b3] shadow-[0_0_10px_rgba(79,183,179,0.5)]"
                style={{ transform: 'rotate(-45deg)' }}
              />
            </motion.div>

            <img src="/rhc_logo_latest.png" alt="RHC Logo" className="h-32 md:h-56 lg:h-96 object-contain drop-shadow-2xl mix-blend-screen" />
          </motion.div>

          {/* Social Icons (Desktop Position: Above Pill) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:flex items-center justify-center gap-6 mb-1"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:text-[#a8fbd3] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(79,183,179,0.3)] hover:scale-110 transition-all duration-300 group"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(168,251,211,0.5)]" />
              </a>
            ))}
          </motion.div>

          {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[10px] md:text-sm font-mono text-[#a8fbd3] tracking-[0.2em] md:tracking-[0.2em] uppercase mb-2 md:mb-2 bg-black/30 px-5 py-3 rounded-2xl md:rounded-full backdrop-blur-md border border-white/5"
          >
            {/* Mobile Layout */}
            <div className="flex flex-col items-center gap-1.5 md:hidden text-center">
              <span className="font-bold text-white leading-tight">Riga, Latvia <span className="text-[#4fb7b3]">|</span> U14 (born 2012) AA/AAA</span>
              <span className="leading-tight">Travel Dates Apr 13-20, 2026</span>
              <span className="leading-tight">Tournament: Apr 17-19, 2026</span>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:contents">
              <span className="font-bold text-white">Riga, Latvia</span>
              <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse" />
              <span className="text-center">U14 (born 2012) AA/AAA | Travel Dates Apr 13-20, 2026 | Tournament: Apr 17-19, 2026</span>
            </div>
          </motion.div>

          {/* Social Icons (Mobile Position: Below Pill) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex md:hidden items-center justify-between w-full max-w-[280px] gap-0 mb-3 px-4"
          >
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:text-[#a8fbd3] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(79,183,179,0.3)] hover:scale-110 transition-all duration-300 group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(168,251,211,0.5)]" />
              </a>
            ))}
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center px-2">
            <GradientText
              text="Riga Hockey Cup 2026"
              as="h1"
              className="text-[5vw] md:text-[5vw] leading-[0.9] font-black tracking-tighter text-center whitespace-nowrap"
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
            className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mt-3 md:mt-4 mb-4 md:mb-5"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-xl font-light max-w-screen-2xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-6 mb-3 md:mb-4"
          >
            Celebrate the 20th Anniversary of Europe’s largest youth ice hockey tournament! The EHD Spring Tour invites you to Riga, Latvia, for an elite competition featuring top talent from Europe's hockey powerhouses such as Sweden, Finland, Czechia, Switzerland amongst others. Join over 250 teams for world-class hockey and an unforgettable international experience in one of Europe’s most passionate hockey cities.
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
            className="group relative px-6 md:px-10 lg:px-12 py-3 md:py-5 lg:py-6 bg-[#4fb7b3] text-black font-heading font-bold text-sm md:text-xl lg:text-2xl uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(79,183,179,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] flex items-center gap-3 overflow-hidden touch-target mb-6 md:mb-0"
          >
            <span className="relative z-10">Register Your Interest</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </motion.button>

        </motion.div>

        {/* MARQUEE - positioned with enough space above for CTA button */}
        <div className="absolute bottom-0 left-0 w-full py-2 md:py-3 lg:py-4 bg-white text-black z-20 overflow-hidden border-y-2 md:border-y-4 border-black shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <motion.div
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(2)].map((_, i) => (
                  <span key={i} className="text-xs md:text-2xl lg:text-3xl font-heading font-black px-3 md:px-4 lg:px-6 flex items-center gap-2 md:gap-3">
                    EHD Spring Tour x Riga Hockey Cup 2026 | U14 (born 2012) AA/AAA | Travel Date: April 13 to April 20 <span className="text-black text-xs md:text-2xl lg:text-3xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* DIVISIONS SECTION */}
      <section id="tournament" className={`relative min-h-screen md:h-screen w-full shrink-0 flex flex-col pt-32 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-24 px-4 bg-black/40 ${device.isDesktop ? 'snap-start' : ''}`}>
        <div className="max-w-[1400px] w-full mx-auto px-2 md:px-6 flex flex-col h-full justify-center">
          {/* Section Header */}
          <div className="mb-6 md:mb-10 lg:mb-12 px-2 md:px-4 relative z-10">
            <h2 className="text-base md:text-xl lg:text-2xl xl:text-3xl font-heading font-bold uppercase leading-[1.1] drop-shadow-lg">
              Experience the Class and Skill of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Euro Hockey</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {DIVISIONS.map((division) => (
              <ArtistCard key={division.id} artist={division} onClick={() => setSelectedDivision(division)} />
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section id="agenda" className={`relative min-h-screen w-full shrink-0 flex flex-col justify-center py-12 md:py-16 lg:py-20 px-4 border-t border-white/10 bg-black/40 ${device.isDesktop ? 'snap-start' : ''}`}>
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-3 md:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-3">
                <h2 className="text-2xl md:text-4xl font-heading font-bold uppercase">
                  Trip <GradientText text="Agenda" className="text-2xl md:text-4xl" />
                </h2>
                <p className="text-[#a8fbd3] font-mono uppercase tracking-widest text-xs">
                  April 13-20, 2026
                </p>
              </div>
              <div className="max-w-3xl mx-auto px-3 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  <span className="font-bold text-[#4fb7b3]">Sample Itinerary:</span> Finalized version provided 1 month prior to travel.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Compact Timeline Grid */}
          <div className={`
             ${isMobile
              ? 'flex flex-col h-full'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar'}
          `}>
            {isMobile && (
              <div className="mb-6 overflow-x-auto pb-4 no-scrollbar flex items-center gap-3">
                {TRIP_SCHEDULE.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMobileDayIndex(idx)}
                    className={`flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl border transition-all duration-300 ${selectedMobileDayIndex === idx
                      ? day.tournament
                        ? 'bg-[#4fb7b3] border-[#4fb7b3] text-black shadow-lg shadow-[#4fb7b3]/20 scale-105'
                        : 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedMobileDayIndex === idx ? 'opacity-100' : 'opacity-60'}`}>{day.day}</span>
                    <span className="text-xl font-black">{day.dayNum}</span>
                    {day.tournament && selectedMobileDayIndex !== idx && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4fb7b3] mt-1" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {isMobile ? (
              // Mobile View: Single Day Display
              <motion.div
                key={selectedMobileDayIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-2xl border backdrop-blur-xl ${TRIP_SCHEDULE[selectedMobileDayIndex].tournament
                  ? 'bg-gradient-to-br from-[#4fb7b3]/20 via-[#4fb7b3]/10 to-[#637ab9]/20 border-[#4fb7b3]/30'
                  : 'bg-white/10 border-white/10'
                  }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {TRIP_SCHEDULE[selectedMobileDayIndex].day} <span className="text-[#4fb7b3]">Apr {TRIP_SCHEDULE[selectedMobileDayIndex].dayNum}</span>
                    </h3>
                    {TRIP_SCHEDULE[selectedMobileDayIndex].tournament && (
                      <span className="inline-block px-3 py-1 rounded-full bg-[#4fb7b3]/20 text-[#4fb7b3] text-xs font-bold uppercase tracking-wider border border-[#4fb7b3]/30">
                        {TRIP_SCHEDULE[selectedMobileDayIndex].tournamentDay}
                      </span>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${TRIP_SCHEDULE[selectedMobileDayIndex].tournament ? 'bg-[#4fb7b3] text-black' : 'bg-white/10 text-white'
                    }`}>
                    {TRIP_SCHEDULE[selectedMobileDayIndex].tournament ? <Trophy size={20} /> : <Calendar size={20} />}
                  </div>
                </div>

                <div className="space-y-4">
                  {TRIP_SCHEDULE[selectedMobileDayIndex].activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex gap-4 items-start">
                      <div className={`mt-1 p-2 rounded-lg ${TRIP_SCHEDULE[selectedMobileDayIndex].tournament ? 'bg-[#4fb7b3]/20 text-[#4fb7b3]' : 'bg-white/5 text-gray-400'
                        }`}>
                        {getIcon(activity.type, activity.description)}
                      </div>
                      <div>
                        {activity.time && (
                          <div className="text-sm font-mono font-bold text-[#a8fbd3] mb-0.5">{activity.time}</div>
                        )}
                        <div className="text-gray-200 leading-snug">{activity.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Desktop View: List ALL days
              TRIP_SCHEDULE.map((day, dayIndex) => {
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: dayIndex * 0.05 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ y: -3 }}
                    className={`group relative p-2 md:p-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${day.tournament
                      ? 'bg-gradient-to-br from-[#4fb7b3]/20 to-[#637ab9]/20 border-[#4fb7b3]/30 hover:border-[#4fb7b3]/50 hover:bg-[#4fb7b3]/20 shadow-lg shadow-[#4fb7b3]/10'
                      : 'bg-white/10 border-white/10 hover:border-white/20 hover:bg-white/15'
                      }`}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg ${day.tournament
                          ? 'bg-gradient-to-br from-[#a8fbd3] to-[#4fb7b3] text-black'
                          : 'bg-white/10 text-[#a8fbd3]'
                          }`}>
                          <div className="text-center leading-none">
                            <div className="text-[9px] md:text-[10px] font-mono uppercase opacity-80 font-bold">
                              {day.day}
                            </div>
                            <div className="text-base md:text-lg font-bold">
                              {day.dayNum}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs md:text-sm font-heading font-bold text-white tracking-wide">
                            {day.date.replace(/,.*/, '')}
                          </h3>
                          <p className="text-[9px] md:text-[10px] text-gray-300 font-medium">
                            {day.date.match(/,\s*(.*)$/)?.[1]}
                          </p>
                        </div>
                      </div>
                      {day.tournament && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#a8fbd3]/20 border border-[#a8fbd3]/40 rounded-full">
                          <Trophy className="w-3 h-3 md:w-4 md:h-4 text-[#a8fbd3]" />
                          <span className="text-[10px] md:text-xs font-bold text-[#a8fbd3] uppercase tracking-wide">
                            {day.tournamentDay?.replace('Tournament ', '')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Activities */}
                    <div className="space-y-2">
                      {day.activities.map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="flex items-start gap-3"
                        >
                          <div className={`shrink-0 mt-0.5 ${day.tournament ? 'text-[#a8fbd3]' : 'text-gray-400'
                            }`}>
                            {getIcon(activity.type, activity.description)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] md:text-xs leading-snug text-gray-200 font-medium">
                              {activity.time && (
                                <span className="font-mono font-bold text-white mr-2">
                                  {activity.time}
                                </span>
                              )}
                              <span className={day.tournament ? 'text-white' : 'text-gray-200'}>
                                {activity.description}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tournament Day Badge Overlay */}
                    {day.tournament && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a8fbd3] to-[#4fb7b3] rounded-l-xl" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className={`relative min-h-screen w-full shrink-0 flex flex-col justify-center py-12 md:py-16 lg:py-20 pb-16 md:pb-20 lg:pb-24 bg-black/20 backdrop-blur-sm border-t border-white/10 overflow-hidden ${device.isDesktop ? 'snap-start' : ''}`}>
        <div className="absolute top-1/2 right-[-20%] w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-[#4fb7b3]/20 rounded-full blur-[40px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-6xl w-full mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 md:mb-4 leading-tight">
                Beyond <br /> <GradientText text="THE ICE" className="text-2xl md:text-4xl lg:text-5xl" />
              </h2>
              <p className="text-sm md:text-base text-gray-200 mb-4 md:mb-6 font-light leading-relaxed drop-shadow-md">
                Experience the "Culture Capital of the Baltics." Beyond the world-class hockey, Riga is an architectural pearl where 800 years of Gothic, Medieval, and Art Nouveau history meet the pulse of modern European life.
              </p>

              <div className="space-y-3 md:space-y-4 lg:space-y-5">
                {[
                  { icon: Shield, title: 'Architectural Pearl', desc: 'Explore 800 years of heritage, from Gothic cathedrals to exquisite Art Nouveau.' },
                  { icon: Zap, title: 'Capital of Gastronomy', desc: 'A fusion of traditional Latvian meals and astonishing modern combinations.' },
                  { icon: Activity, title: 'Wellness & Culture', desc: 'Indulge in premier SPA treatments and the traditional Latvian bath experience.' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/5">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-1 font-heading">{feature.title}</h4>
                      <p className="text-xs text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[280px] md:h-[400px] lg:h-[500px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#637ab9] to-[#4fb7b3] rounded-2xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={CAROUSEL_IMAGES[currentImageIndex]}
                    alt={`Experience ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Navigation Controls - Better positioning */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 lg:p-8 flex items-center justify-between z-10">
                  <div className="flex gap-1.5 md:gap-2">
                    {CAROUSEL_IMAGES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${currentImageIndex === i ? 'bg-[#a8fbd3] w-6 md:w-8' : 'bg-white/30 hover:bg-white/50 w-1.5 md:w-2'}`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/40 hover:border-[#a8fbd3]/50 transition-all duration-300"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-black/40 hover:border-[#a8fbd3]/50 transition-all duration-300"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                  <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#a8fbd3]">
                      Riga Experience
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-20 left-6 md:bottom-24 md:left-8">
                  <div className="text-base md:text-lg font-bold tracking-widest uppercase text-white/90 drop-shadow-lg">
                    {currentImageIndex === 0 ? 'City Landmark' : 'Cultural Vibes'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER SECTION */}
      {/* REGISTRATION SECTION */}
      <section id="register" className="relative min-h-screen py-8 md:py-12 lg:py-16 pt-24 md:pt-32 lg:pt-40 px-4 md:px-10 flex flex-col snap-start bg-[#0a0b1a]">
        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center">
          <div className="flex flex-col items-center mb-6 md:mb-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GradientText
                text="REGISTER YOUR INTEREST"
                className="text-3xl md:text-5xl font-heading font-black tracking-tighter"
              />
            </motion.div>

          </div>

          <div className="relative">
            {!isRegistered ? (
              <CommitmentForm
                onSubmit={handleCommitmentSubmit}
                isInline={true}
                onQuestionClick={() => setIsQuestionFormOpen(true)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-[#1a1b3b] border border-[#4fb7b3]/30 rounded-2xl p-12 text-center shadow-2xl shadow-[#4fb7b3]/10"
              >
                <div className="p-4 rounded-full bg-[#4fb7b3]/20 border border-[#4fb7b3]/30 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-[#4fb7b3]" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-4 uppercase tracking-widest">
                  Interest Registered!
                </h3>
                <p className="text-gray-400 font-mono text-lg mb-8">
                  Thank you for your interest in the EHD x RHC 2026 Spring Tour. Our team will contact you shortly with further details.
                </p>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all"
                >
                  Register Another Player
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Integrated Footer */}
        <footer className="w-full border-t border-white/10 py-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter mb-1 text-white">RHC INVITE</div>
              <div className="flex gap-2 text-[10px] font-mono text-gray-400">
                <span>Official Registration Portal</span>
              </div>
            </div>

            <div className="flex gap-6 flex-wrap">
              <button
                onClick={() => setAdminLoginOpen(true)}
                className="text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                onClick={() => setIsQuestionFormOpen(true)}
                className="text-gray-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </footer>
      </section>

      {/* Question Form Modal */}
      <QuestionForm
        isOpen={isQuestionFormOpen}
        onClose={() => setIsQuestionFormOpen(false)}
      />

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
              {/* Close Button - Fixed to Corner with better touch target */}
              <button
                onClick={() => setSelectedDivision(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 md:p-2.5 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 touch-target"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Side - Fixed on Desktop */}
              <div className="w-full md:w-1/2 h-56 md:h-full relative overflow-hidden shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedDivision.id}-${subCarouselIndex}`}
                    src={selectedDivision.images && selectedDivision.images.length > 0
                      ? selectedDivision.images[subCarouselIndex]
                      : selectedDivision.image}
                    alt={selectedDivision.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b3b] via-transparent to-transparent md:bg-gradient-to-r md:from-[#1a1b3b]/80" />

                {/* Sub-carousel navigation */}
                {selectedDivision.images && selectedDivision.images.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 bottom-6 flex justify-center gap-1.5 z-20">
                      {selectedDivision.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setSubCarouselIndex(idx); }}
                          className={`h-1 rounded-full transition-all duration-300 ${subCarouselIndex === idx ? 'bg-[#a8fbd3] w-6' : 'bg-white/20 w-2 hover:bg-white/40'}`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubCarouselIndex(prev => (prev - 1 + (selectedDivision.images?.length || 0)) % (selectedDivision.images?.length || 1));
                        }}
                        className="p-3 rounded-full bg-[#4fb7b3] shadow-lg shadow-[#4fb7b3]/20 border border-white/10 text-black hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubCarouselIndex(prev => (prev + 1) % (selectedDivision.images?.length || 1));
                        }}
                        className="p-3 rounded-full bg-[#4fb7b3] shadow-lg shadow-[#4fb7b3]/20 border border-white/10 text-black hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </>
                )}

                {/* Mobile Title Overlay */}
                <div className="absolute bottom-4 left-6 md:hidden">
                  <h3 className="text-3xl font-heading font-bold uppercase leading-none text-white drop-shadow-md">
                    {selectedDivision.name}
                  </h3>
                </div>
              </div>

              {/* Content Side - Scrollable */}
              <div className="w-full md:w-1/2 h-full overflow-y-auto bg-[#1a1b3b] relative custom-scrollbar">
                {/* Navigation Buttons - Top Center */}
                <div className="sticky top-0 z-30 flex justify-center pt-6 pb-2 bg-gradient-to-b from-[#1a1b3b] via-[#1a1b3b]/95 to-transparent backdrop-blur-sm">
                  <div className="flex gap-3 p-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/20">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateDivision('prev'); }}
                      className="group p-2.5 rounded-full bg-white/5 text-white hover:bg-[#4fb7b3] hover:text-black transition-all duration-300 border border-white/10 hover:border-[#4fb7b3] hover:shadow-[0_0_20px_rgba(79,183,179,0.4)] pointer-events-auto hover:scale-110 active:scale-95"
                      data-hover="true"
                      aria-label="Previous Division"
                    >
                      <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="w-px bg-white/20 my-1"></div>

                    <button
                      onClick={(e) => { e.stopPropagation(); navigateDivision('next'); }}
                      className="group p-2.5 rounded-full bg-white/5 text-white hover:bg-[#4fb7b3] hover:text-black transition-all duration-300 border border-white/10 hover:border-[#4fb7b3] hover:shadow-[0_0_20px_rgba(79,183,179,0.4)] pointer-events-auto hover:scale-110 active:scale-95"
                      data-hover="true"
                      aria-label="Next Division"
                    >
                      <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="p-8 md:p-16 flex flex-col min-h-full pb-32 pt-0">
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
                      {selectedDivision.intro && (
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg font-light mb-8">
                          {selectedDivision.intro}
                        </p>
                      )}

                      {selectedDivision.thrillSection && (
                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                          <h4 className="text-2xl md:text-3xl font-heading font-bold text-[#a8fbd3] mb-6 tracking-widest uppercase drop-shadow-md">
                            {selectedDivision.thrillSection.title}{selectedDivision.thrillSection.title.endsWith(':') ? '' : ':'}
                          </h4>
                          <ul className="space-y-4">
                            {selectedDivision.thrillSection.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-4">
                                <Star className="w-5 h-5 text-[#4fb7b3] fill-[#4fb7b3] mt-1 shrink-0" />
                                <span className="text-gray-200 text-base font-light leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                          {selectedDivision.thrillSection.videoLink && (
                            <a
                              href={selectedDivision.thrillSection.videoLink.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-6 text-sm md:text-base font-heading font-bold text-[#a8fbd3] tracking-widest uppercase hover:text-white transition-all duration-300 group/link"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span className="border-b border-[#a8fbd3] group-hover:border-white transition-colors">{selectedDivision.thrillSection.videoLink.text}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {selectedDivision.exclusions && (
                        <div className="my-8">
                          <h4 className="text-xl md:text-2xl font-heading font-bold text-white mb-6 uppercase drop-shadow-md">
                            {selectedDivision.exclusions.title}:
                          </h4>
                          <ul className="space-y-3">
                            {selectedDivision.exclusions.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-red-500/80 shrink-0" />
                                <span className="text-gray-300 text-base font-light leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedDivision.pricing && (
                        <div className="my-10 bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
                          <div className="flex justify-end mb-6">
                            <span className="px-3 py-1 bg-[#4fb7b3] text-black font-bold text-xs tracking-widest uppercase rounded-full">
                              {selectedDivision.pricing.title}
                            </span>
                          </div>
                          <div className="space-y-6">
                            {selectedDivision.pricing.packages.map((pkg, i) => (
                              <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                <span className="text-white font-medium text-lg tracking-wide">{pkg.name}</span>
                                <span className="text-2xl md:text-3xl font-heading font-bold text-[#a8fbd3] whitespace-nowrap">{pkg.price}</span>
                              </div>
                            ))}
                          </div>
                          {selectedDivision.pricing.customText && (
                            <div className="mt-8 text-center">
                              <p className="text-[#4fb7b3] font-bold tracking-widest uppercase text-sm">
                                {selectedDivision.pricing.customText}
                              </p>
                            </div>
                          )}
                          {selectedDivision.pricing.paymentTerms && (
                            <div className="mt-6 pt-6 border-t border-white/20">
                              <p className="text-white text-sm md:text-base leading-relaxed text-center">
                                <span className="font-bold text-[#a8fbd3]">Payment Terms:</span> {selectedDivision.pricing.paymentTerms}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

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

                      {selectedDivision.listItems && (
                        <motion.ul
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="space-y-3 mt-8"
                        >
                          {selectedDivision.listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300">
                              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#4fb7b3] shrink-0" />
                              <span className="text-base font-light">{item}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Admin Features */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        token={adminToken || ''}
      />
    </div>
  );
};

export default App;