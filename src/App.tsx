import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ChevronRight, 
  Star, 
  Award, 
  Truck, 
  DollarSign, 
  Instagram, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FURNITURE_CATEGORIES, ADVANTAGES, TESTIMONIALS, CONTACT_INFO } from './data';
import { FurnitureCategory, OrderFormData } from './types';

export default function App() {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Selected category for the "Batafsil" Modal
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    category: '',
    message: ''
  });
  
  // Form submission success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Scrolled state for header background transition
  const [isScrolled, setIsScrolled] = useState(false);

  // Active section for navigation highlight
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Simple scroll spy
      const sections = ['home', 'catalog', 'advantages', 'about', 'order', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format phone number to uzbek format as user types: +998 (XX) XXX-XX-XX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // keep only numbers
    
    // If user starts with 998, strip it to format uniformly
    if (value.startsWith('998') && value.length > 3) {
      value = value.substring(3);
    }

    // Limit length to 9 digits (excluding 998)
    value = value.substring(0, 9);

    // Apply formatting
    let formatted = '+998';
    if (value.length > 0) {
      formatted += ' (' + value.substring(0, 2);
    }
    if (value.length > 2) {
      formatted += ') ' + value.substring(2, 5);
    }
    if (value.length > 5) {
      formatted += '-' + value.substring(5, 7);
    }
    if (value.length > 7) {
      formatted += '-' + value.substring(7, 9);
    }

    setFormData({
      ...formData,
      phone: value.length === 0 ? '' : formatted
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName.trim()) {
      alert('Iltimos, ismingizni kiriting.');
      return;
    }
    if (!formData.phone || formData.phone.length < 17) {
      alert('Iltimos, telefon raqamingizni to\'liq kiriting.');
      return;
    }
    if (!formData.category) {
      alert('Iltimos, qiziqayotgan mebel turini tanlang.');
      return;
    }

    // Process submission (simulated)
    setIsSubmitted(true);
  };

  const handleOrderCategorySelection = (categoryTitle: string) => {
    setFormData({
      ...formData,
      category: categoryTitle
    });
    setSelectedCategory(null); // close modal
    
    // Smooth scroll to order form
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      category: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName: string) => {
    const props = { className: "w-8 h-8 text-gold-500" };
    switch (iconName) {
      case 'Award':
        return <Award {...props} />;
      case 'Truck':
        return <Truck {...props} />;
      case 'DollarSign':
        return <DollarSign {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-gold-500 selection:text-white overflow-x-hidden" id="home">
      
      {/* HEADER / NAVIGATION */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 text-white shadow-lg backdrop-blur-md py-4 border-b border-slate-800' 
          : 'bg-transparent text-white py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2 group">
            <span className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center font-display font-bold text-white text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
              B
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-wide group-hover:text-gold-300 transition-colors duration-300">
                BEK MEBELI
              </span>
              <span className="text-[10px] tracking-widest text-gold-400 font-mono -mt-1 uppercase">
                Premium Quality
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: 'catalog', label: 'Katalog' },
              { id: 'advantages', label: 'Afzalliklarimiz' },
              { id: 'about', label: 'Biz haqimizda' },
              { id: 'contact', label: 'Aloqa' }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-1 ${
                  activeSection === item.id 
                    ? 'text-gold-400 font-semibold' 
                    : 'text-slate-200 hover:text-gold-300'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span 
                    layoutId="underline" 
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-gold-400 rounded-full"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* CTA Phone Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href={`tel:${CONTACT_INFO.phones[0].replace(/\s+/g, '')}`} 
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-medium px-5 py-2.5 rounded-full text-sm shadow-md shadow-gold-600/10 hover:shadow-gold-500/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Qo'ng'iroq qilish</span>
            </a>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-100 hover:text-gold-400 hover:bg-slate-800/50 transition-colors"
            aria-label="Menyuni ochish"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-950 border-t border-slate-800 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-4">
                {[
                  { id: 'catalog', label: 'Katalog' },
                  { id: 'advantages', label: 'Afzalliklarimiz' },
                  { id: 'about', label: 'Biz haqimizda' },
                  { id: 'contact', label: 'Aloqa' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base font-medium text-slate-200 hover:text-gold-400 py-2 border-b border-slate-900"
                  >
                    {item.label}
                  </a>
                ))}
                
                <div className="pt-2 flex flex-col space-y-3">
                  <div className="flex items-center text-slate-400 text-sm py-1">
                    <Clock className="w-4 h-4 mr-2 text-gold-500" />
                    <span>{CONTACT_INFO.workingHours}</span>
                  </div>
                  <a 
                    href={`tel:${CONTACT_INFO.phones[0].replace(/\s+/g, '')}`} 
                    className="flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors"
                  >
                    <Phone className="w-5 h-5 text-white" />
                    <span>{CONTACT_INFO.phones[0]}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-slate-950 pt-20 overflow-hidden">
        {/* Background Image with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80" 
            alt="Bek Mebeli Premium Interior" 
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-transparent to-transparent opacity-95" />
          <div className="absolute inset-0 bg-slate-950/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center md:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 flex flex-col items-center md:items-start text-white">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-semibold tracking-wider text-slate-100 uppercase">Toshkentda Professional Mebel Ishlab Chiqarish</span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight mb-6 max-w-3xl"
              >
                Bek Mebeli — Uyingiz uchun <span className="gold-gradient-text font-semibold italic">shinamlik</span> va <span className="gold-gradient-text font-semibold">sifat</span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-light"
              >
                Biz sizning xohishingiz, uyingiz o'lchamlari va zamonaviy tendensiyalarga mos ravishda yuqori sifatli mebellarni buyurtma asosida tayyorlaymiz. O'zbekiston bo'ylab yetkazib berish kafolatlangan.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <a 
                  href="#catalog" 
                  className="w-full sm:w-auto text-center bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-gold-600/10 hover:shadow-gold-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Katalogni ko'rish</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </a>
                
                <a 
                  href="#order" 
                  className="w-full sm:w-auto text-center bg-slate-900/80 hover:bg-slate-800 text-white font-medium px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Bepul maslahat olish
                </a>
              </motion.div>
            </div>

            {/* Float badge widget on large screens */}
            <div className="hidden lg:col-span-4 lg:flex justify-end relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm"
              >
                <div className="flex items-center space-x-1 mb-4 text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-400" />
                  ))}
                </div>
                <h3 className="text-white font-display font-semibold text-lg mb-2">Eng yaxshi tanlov</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed mb-4">
                  "Uylarimizga mebel tanlashda Bek Mebeli jamoasiga murojaat qildik. Sifat va dizayn kutganimizdan a'lo chiqdi!"
                </p>
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Sardor Rahimov</span>
                  <span className="text-gold-400">Baxtli mijoz</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPACT STATS SUBSECTION */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900">12+</span>
            <span className="text-sm text-slate-500 mt-1">Yillik tajriba</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900">5,000+</span>
            <span className="text-sm text-slate-500 mt-1">Baxtli mijozlar</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900">5 yilgacha</span>
            <span className="text-sm text-slate-500 mt-1">Rasmiy kafolat</span>
          </div>
        </div>
      </section>

      {/* CATALOG (GRID KO'RINISHIDA) */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-gold-500 uppercase font-mono mb-2">Bizning katalogimiz</h2>
          <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Har qanday didga mos mebel turlari
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 mt-4 font-light">
            Siz uchun eng sara materiallardan ishlangan, zamonaviy va bejirim mebel to'plamlari katalogimiz. Istalgan kategoriyani tanlab, batafsil ma'lumot oling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FURNITURE_CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-slate-900/80 text-gold-400 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                  Kategoriya
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 flex-grow">
                  {category.description}
                </p>
                
                <button 
                  onClick={() => setSelectedCategory(category)}
                  className="w-full bg-slate-50 hover:bg-gold-50 hover:text-gold-700 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-100 hover:border-gold-200 transition-all duration-300 flex items-center justify-center space-x-1"
                >
                  <span>Batafsil ma'lumot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AFZALLIKLARIMIZ */}
      <section id="advantages" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-gold-500 uppercase font-mono mb-2">Nega aynan biz?</h2>
            <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Sizga taklif qiladigan afzalliklarimiz
            </p>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {ADVANTAGES.map((adv, index) => (
              <div 
                key={index}
                className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mb-6 shadow-sm shadow-gold-500/5">
                  {renderIcon(adv.iconName)}
                </div>
                
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                  {adv.title}
                </h3>
                
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BIZ HAQIMIZDA */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Visual column */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" 
                alt="Bek Mebeli Ustaxonasi va Sifat nazorati" 
                className="w-full aspect-[4/5] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            {/* Back Decoration Accent Box */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold-400 rounded-2xl z-0 pointer-events-none hidden sm:block" />
            
            {/* Float Stat Badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 text-white p-4 rounded-xl backdrop-blur-sm max-w-xs border border-slate-800">
              <div className="flex items-center space-x-2 text-gold-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wider font-mono uppercase">Kafolat va Sifat</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Biz har bir mahsulotni faqat sifatli va sertifikatlangan Yevropa hamda Turkiya materiallaridan tayyorlaymiz.
              </p>
            </div>
          </div>

          {/* Description content column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-xs font-semibold tracking-widest text-gold-500 uppercase font-mono mb-2">Biz haqimizda</h2>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-6">
              "Bek Mebeli" — Yillar davomida shakllangan ishonch
            </h3>
            
            <div className="space-y-4 text-slate-600 font-light leading-relaxed">
              <p>
                "Bek Mebeli" brendiga Toshkent shahrida asos solingan bo'lib, o'tgan yillar davomida minglab xonadonlar, idoralar va maskanlarni hashamatli hamda qulay mebellar bilan ta'minlashga muvaffaq bo'ldik. Bizning asosiy ustunligimiz — har bir mijozning uyi va didiga mos ravishda individual yondashuvdir.
              </p>
              <p>
                Biz mijozning uyi o'lchamlarini mutlaqo bepul o'lchaymiz, 3D dizayn loyihasini taqdim etamiz va kelishilgan narx doirasida sifatli mebelni o'z vaqtida yetkazib berib, bepul o'rnatamiz.
              </p>
              <p className="font-medium text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                <span>Nafis dizayn, ergonomik tuzilish va uzoq yillik xizmat.</span>
              </p>
            </div>

            {/* Testimonial slider / block inside about */}
            <div className="mt-10 border-l-4 border-gold-400 bg-slate-50 p-6 rounded-r-xl">
              <p className="text-slate-600 italic text-sm font-light">
                "Uyingizdagi har bir burchak o'ziga xos shinamlikka ega bo'lishi kerak. Bizning vazifamiz — siz orzu qilgan mebellarni eng yuqori darajada amalga oshirishdir."
              </p>
              <div className="mt-3 flex items-center space-x-3 text-xs">
                <span className="font-semibold text-slate-800">Bekzod Alimov</span>
                <span className="text-slate-400">|</span>
                <span className="text-gold-600 font-medium">Asoschi & Bosh Dizayner</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEEDBACKS / TESTIMONIALS */}
      <section className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-gold-400 uppercase font-mono mb-2">Mijozlarimiz fikrlari</h2>
            <p className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Sifatga baho bergan baxtli egalar
            </p>
            <div className="w-16 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-slate-800/50 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between hover:border-slate-700 hover:bg-slate-800/80 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4 text-gold-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400" />
                    ))}
                  </div>
                  
                  <p className="text-slate-300 text-sm font-light leading-relaxed mb-6 italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-semibold">{t.name}</h4>
                    <p className="text-slate-500 text-[11px] font-mono mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">{t.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BUYURTMA BERISH FORMASI */}
      <section id="order" className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left accent column */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0" />
              {/* background vector accent */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gold-500/10 blur-xl pointer-events-none" />
              
              <div className="relative z-10">
                <span className="text-gold-400 text-xs font-semibold tracking-widest font-mono uppercase">Maslahat olish</span>
                <h3 className="font-display font-bold text-2xl text-white mt-2 leading-snug">
                  Mebel haqida bepul konsultatsiya
                </h3>
                <p className="text-slate-400 text-xs font-light leading-relaxed mt-4">
                  Ma'lumotlaringizni yozib qoldiring. Loyiha menejeri sizga 15 daqiqa ichida qo'ng'iroq qiladi va siz qiziqqan barcha savollarga batafsil javob beradi.
                </p>
              </div>

              <div className="relative z-10 pt-8 border-t border-slate-800/80 space-y-4 text-xs font-light text-slate-300">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Bepul o'lchov olish</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Bepul 3D Dizayn chizish</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Tezkor yetkazib berish</span>
                </div>
              </div>
            </div>

            {/* Right form column */}
            <div className="lg:col-span-8 p-8 sm:p-12">
              <h4 className="font-display font-semibold text-xl text-slate-900 mb-6">Buyurtma yoki so'rov yuborish</h4>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h5 className="font-display font-semibold text-lg text-emerald-900 mb-2">Xabaringiz qabul qilindi!</h5>
                  <p className="text-emerald-700 text-sm font-light leading-relaxed max-w-sm mb-6">
                    Rahmat, {formData.fullName}. Mutaxassislarimiz tez fursatda (+998 {formData.phone.replace(/\D/g, '').substring(3, 5) ? `(${formData.phone.replace(/\D/g, '').substring(3, 5)})` : ''} ...) raqamingiz orqali siz bilan bog'lanishadi.
                  </p>
                  <button 
                    onClick={resetForm}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Yangi so'rov yuborish
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Ismingiz <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="Masalan: Sardor To'rayev"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Telefon raqamingiz <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      required
                      placeholder="+998 (90) 123-45-67"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Raqamlarni kiriting, formatlash avtomatik amalga oshiriladi.</span>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Qiziqayotgan mebel turi <span className="text-red-500">*</span></label>
                    <select 
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Mebel turini tanlang --</option>
                      <option value="Yotoqxona Mebellari">Yotoqxona mebellari</option>
                      <option value="Oshxona Mebellari">Oshxona mebellari</option>
                      <option value="Mehmonxona Mebellari">Mehmonxona mebellari</option>
                      <option value="Yumshoq Mebellar">Yumshoq mebellar</option>
                      <option value="Boshqa turdagi mebel">Maxsus individual buyurtma (boshqa)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Qo'shimcha istak yoki o'lchamlar (ixtiyoriy)</label>
                    <textarea 
                      id="message"
                      name="message"
                      rows={3}
                      placeholder="Masalan: Ranglar och bo'lishi kerak, yoki o'lchamlar taxminan 3x4..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ma'lumotlarni yuborish</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER & BOG'LANISH / ALOQA */}
      <footer id="contact" className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-slate-900">
            
            {/* Column 1: Brand details */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              <a href="#home" className="flex items-center space-x-2">
                <span className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center font-display font-bold text-white text-xl shadow-lg shadow-gold-500/20">
                  B
                </span>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl tracking-wide text-white">
                    BEK MEBELI
                  </span>
                  <span className="text-[10px] tracking-widest text-gold-400 font-mono -mt-1 uppercase">
                    Premium Quality
                  </span>
                </div>
              </a>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Toshkentdagi eng sifatli va hashamatli buyurtma asosidagi mebellarni ishlab chiqaruvchi brend. Biz har bir xonadonga o'zgacha shinamlik va hashamatli kayfiyat olib kiramiz.
              </p>
              
              {/* Working hours */}
              <div className="flex items-center space-x-3 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-900/80">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <div>
                  <h6 className="font-semibold text-white">Ish vaqti:</h6>
                  <p className="text-slate-400 mt-0.5">{CONTACT_INFO.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation links */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <h5 className="font-display font-bold text-sm tracking-widest text-gold-400 uppercase">Bo'limlar</h5>
              <div className="flex flex-col space-y-2.5 text-xs text-slate-400 font-light">
                <a href="#catalog" className="hover:text-gold-400 transition-colors">Mahsulotlar</a>
                <a href="#advantages" className="hover:text-gold-400 transition-colors">Afzalliklarimiz</a>
                <a href="#about" className="hover:text-gold-400 transition-colors">Biz haqimizda</a>
                <a href="#order" className="hover:text-gold-400 transition-colors">Maslahat olish</a>
              </div>
            </div>

            {/* Column 3: Contact information */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <h5 className="font-display font-bold text-sm tracking-widest text-gold-400 uppercase">Aloqa va bog'lanish</h5>
              <div className="flex flex-col space-y-3 text-xs text-slate-400 font-light">
                {CONTACT_INFO.phones.map((phone, idx) => (
                  <a 
                    key={idx} 
                    href={`tel:${phone.replace(/\s+/g, '')}`} 
                    className="flex items-center space-x-3 hover:text-gold-400 text-slate-300 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="font-semibold">{phone}</span>
                  </a>
                ))}
                
                <div className="flex items-start space-x-3 text-slate-300 pt-1">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-400 text-[11px]">{CONTACT_INFO.address}</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center space-x-4 pt-3">
                <a 
                  href={CONTACT_INFO.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-gold-500 border border-slate-800 hover:border-transparent flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                  title="Telegram orqali bog'lanish"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a 
                  href={CONTACT_INFO.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-gold-500 border border-slate-800 hover:border-transparent flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
                  title="Instagram sahifamiz"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 4: Google Maps integration card */}
            <div className="lg:col-span-3 flex flex-col space-y-4">
              <h5 className="font-display font-bold text-sm tracking-widest text-gold-400 uppercase">Xaritadagi manzilimiz</h5>
              
              {/* Maps Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-32 bg-slate-900 group">
                <div className="absolute inset-0 bg-slate-950/40 z-10" />
                {/* Simulated Map visual */}
                <div className="absolute inset-0 z-0 bg-[#e5e3df] flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-rose-500 absolute animate-bounce" />
                  <div className="text-[10px] text-slate-600 font-medium mt-12">Toshkent, Chilonzor t.</div>
                </div>
                
                <a 
                  href={CONTACT_INFO.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-semibold text-gold-400 space-x-1"
                >
                  <span>Google Xaritada ochish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              
              <a 
                href={CONTACT_INFO.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-400 hover:text-gold-300 font-medium underline flex items-center space-x-1 mt-1"
              >
                <span>Xaritaga yo'nalish olish</span>
                <ChevronRight className="w-4 h-4 inline" />
              </a>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-light">
            <p>© {new Date().getFullYear()} Bek Mebeli. Barcha huquqlar himoyalangan.</p>
            <p className="mt-2 sm:mt-0">Toshkent, O'zbekiston. Premium Mebel Brendi.</p>
          </div>

        </div>
      </footer>

      {/* DETAILED CATEGORY POPUP MODAL (BATAFSIL) */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 max-h-[90vh] flex flex-col"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 z-20 bg-slate-900/60 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content Container */}
              <div className="overflow-y-auto">
                
                {/* Header Image banner */}
                <div className="relative h-64 sm:h-72 bg-slate-100">
                  <img 
                    src={selectedCategory.image} 
                    alt={selectedCategory.title} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  
                  {/* Category Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-gold-400 text-xs font-semibold tracking-widest font-mono uppercase">Premium To'plam</span>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl mt-1">{selectedCategory.title}</h3>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To'plam tavsifi</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      {selectedCategory.details}
                    </p>
                  </div>

                  {/* Included items */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">To'plam tarkibiga nimalar kiradi?</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {selectedCategory.items.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <CheckCircle className="w-4 h-4 text-gold-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications (Material, Guarantee, Lead Time) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Xomashyo & Material</span>
                      <span className="text-xs font-medium text-slate-800 leading-normal block">{selectedCategory.material}</span>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Rasmiy Kafolat</span>
                      <span className="text-xs font-semibold text-gold-600 block">{selectedCategory.guarantee}</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center sm:text-left">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Tayyorlanish vaqti</span>
                      <span className="text-xs font-medium text-slate-800 block">{selectedCategory.duration}</span>
                    </div>
                  </div>

                  {/* Actions inside Modal */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => handleOrderCategorySelection(selectedCategory.title)}
                      className="w-full sm:flex-grow bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Ushbu turdagini buyurtma qilish</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-4 px-6 rounded-xl transition-colors cursor-pointer"
                    >
                      Yopish
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
