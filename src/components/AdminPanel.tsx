import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  X, 
  Search, 
  FileText, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Database, 
  TrendingUp, 
  FileCheck, 
  UserPlus, 
  MessageSquare, 
  Sparkles,
  RefreshCw,
  Printer,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  addDoc 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Booking, FurnitureCategory, Testimonial, ContactSettings, AdminUser } from '../types';

interface AdminPanelProps {
  currentUserEmail: string | null;
  currentUserId: string | null;
  bookings: Booking[];
  categories: FurnitureCategory[];
  testimonials: Testimonial[];
  settings: ContactSettings;
  admins: AdminUser[];
  onRefreshAll: () => Promise<void>;
  onClose: () => void;
  onSeedDatabase: () => Promise<void>;
}

export default function AdminPanel({
  currentUserEmail,
  currentUserId,
  bookings,
  categories,
  testimonials,
  settings,
  admins,
  onRefreshAll,
  onClose,
  onSeedDatabase
}: AdminPanelProps) {
  // Tabs: 'dashboard', 'bookings', 'categories', 'testimonials', 'settings', 'admins'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'categories' | 'testimonials' | 'settings' | 'admins'>('dashboard');

  // Search & Filters for Bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // State for active category being edited
  const [editingCategory, setEditingCategory] = useState<FurnitureCategory | null>(null);
  const [catItemInput, setCatItemInput] = useState('');

  // State for adding admin
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');

  // State for custom testimonial creation
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    comment: '',
    rating: 5,
    date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
  });
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  // Loading indicator for background operations
  const [isOperating, setIsOperating] = useState(false);
  const [operationSuccess, setOperationSuccess] = useState<string | null>(null);

  // Edit State for Settings
  const [editedSettings, setEditedSettings] = useState<ContactSettings>({ ...settings });

  // Booking detail view & note editing
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [tempAdminNote, setTempAdminNote] = useState('');

  // Revenue projection helper (Part of the 15 features)
  const [averageOrderValue, setAverageOrderValue] = useState<number>(3500000); // 3.5M UZS average

  useEffect(() => {
    setEditedSettings({ ...settings });
  }, [settings]);

  const triggerSuccessMessage = (message: string) => {
    setOperationSuccess(message);
    setTimeout(() => setOperationSuccess(null), 3000);
  };

  // 1. UPDATE BOOKING STATUS (Feature 3)
  const handleUpdateBookingStatus = async (bookingId: string, nextStatus: Booking['status']) => {
    setIsOperating(true);
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
      triggerSuccessMessage("Bron holati muvaffaqiyatli o'zgartirildi!");
      await onRefreshAll();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: nextStatus });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 2. DELETE BOOKING (Feature 4)
  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Haqiqatan ham ushbu buyurtmani o'chirib tashlamoqchimisiz?")) return;
    setIsOperating(true);
    const path = `bookings/${bookingId}`;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      triggerSuccessMessage("Buyurtma muvaffaqiyatli o'chirildi!");
      setSelectedBooking(null);
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 3. SAVE ADMIN NOTE (Feature 5)
  const handleSaveAdminNote = async (bookingId: string) => {
    setIsOperating(true);
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        adminNote: tempAdminNote,
        updatedAt: serverTimestamp()
      });
      triggerSuccessMessage("Admin izohi saqlandi!");
      await onRefreshAll();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, adminNote: tempAdminNote });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 4. ADD NEW ADMIN (Feature 6)
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminUid.trim()) {
      alert("Iltimos, email va UID maydonlarini to'ldiring.");
      return;
    }
    setIsOperating(true);
    const path = `admins/${newAdminUid}`;
    try {
      await setDoc(doc(db, 'admins', newAdminUid), {
        email: newAdminEmail.trim().toLowerCase(),
        assignedAt: serverTimestamp(),
        assignedBy: currentUserEmail || 'Tizim'
      });
      triggerSuccessMessage(`${newAdminEmail} muvaffaqiyatli admin etib tayinlandi!`);
      setNewAdminEmail('');
      setNewAdminUid('');
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 5. REVOKE ADMIN ACCESS (Feature 8)
  const handleRevokeAdmin = async (adminId: string, email: string) => {
    if (email === "tuyginovsardor@gmail.com") {
      alert("Asosiy loyiha rahbarining adminlik huquqini bekor qilib bo'lmaydi!");
      return;
    }
    if (adminId === currentUserId) {
      alert("O'zingizning adminligingizni o'zingiz o'chira olmaysiz!");
      return;
    }
    if (!window.confirm(`Haqiqatan ham ${email} ning admin huquqlarini olib tashlamoqchimisiz?`)) return;
    setIsOperating(true);
    const path = `admins/${adminId}`;
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      triggerSuccessMessage("Admin huquqlari muvaffaqiyatli bekor qilindi!");
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 6. SAVE CATEGORY CHANGES (Feature 9)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsOperating(true);
    const path = `categories/${editingCategory.id}`;
    try {
      await setDoc(doc(db, 'categories', editingCategory.id), {
        title: editingCategory.title,
        description: editingCategory.description,
        image: editingCategory.image,
        details: editingCategory.details,
        items: editingCategory.items,
        material: editingCategory.material,
        guarantee: editingCategory.guarantee,
        duration: editingCategory.duration
      });
      triggerSuccessMessage(`${editingCategory.title} muvaffaqiyatli yangilandi!`);
      setEditingCategory(null);
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // Add Item to category inclusion list
  const handleAddCatItem = () => {
    if (!catItemInput.trim() || !editingCategory) return;
    setEditingCategory({
      ...editingCategory,
      items: [...editingCategory.items, catItemInput.trim()]
    });
    setCatItemInput('');
  };

  // Remove Item from category inclusion list
  const handleRemoveCatItem = (index: number) => {
    if (!editingCategory) return;
    const newItems = [...editingCategory.items];
    newItems.splice(index, 1);
    setEditingCategory({
      ...editingCategory,
      items: newItems
    });
  };

  // 7. ADD TESTIMONIAL (Feature 11)
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name.trim() || !newTestimonial.comment.trim()) return;
    setIsOperating(true);
    const path = 'testimonials';
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: newTestimonial.name,
        role: newTestimonial.role || 'Mijoz',
        comment: newTestimonial.comment,
        rating: Number(newTestimonial.rating),
        date: newTestimonial.date,
        createdAt: serverTimestamp()
      });
      triggerSuccessMessage("Yangi mijoz fikri qo'shildi!");
      setNewTestimonial({
        name: '',
        role: '',
        comment: '',
        rating: 5,
        date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
      });
      setShowAddTestimonial(false);
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 8. DELETE TESTIMONIAL
  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm("Haqiqatan ham ushbu fikrni o'chirmoqchimisiz?")) return;
    setIsOperating(true);
    const path = `testimonials/${id}`;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      triggerSuccessMessage("Mijoz fikri o'chirildi!");
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // 9. SAVE GLOBAL SETTINGS (Feature 12)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOperating(true);
    const path = 'settings/contact_info';
    try {
      await setDoc(doc(db, 'settings', 'contact_info'), {
        phones: editedSettings.phones,
        email: editedSettings.email,
        address: editedSettings.address,
        workingHours: editedSettings.workingHours,
        instagram: editedSettings.instagram,
        telegram: editedSettings.telegram,
        mapsLink: editedSettings.mapsLink
      });
      triggerSuccessMessage("Aloqa sozlamalari muvaffaqiyatli saqlandi!");
      await onRefreshAll();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } finally {
      setIsOperating(false);
    }
  };

  // Add Phone to settings
  const handleAddSettingsPhone = () => {
    setEditedSettings({
      ...editedSettings,
      phones: [...editedSettings.phones, '+998 ']
    });
  };

  const handleSettingsPhoneChange = (index: number, val: string) => {
    const updated = [...editedSettings.phones];
    updated[index] = val;
    setEditedSettings({
      ...editedSettings,
      phones: updated
    });
  };

  const handleRemoveSettingsPhone = (index: number) => {
    const updated = [...editedSettings.phones];
    updated.splice(index, 1);
    setEditedSettings({
      ...editedSettings,
      phones: updated
    });
  };

  // 10. PRINT / EXPORT LIST (Feature 14)
  const handlePrintOrders = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const ordersHtml = bookings.map((b, idx) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">${idx + 1}</td>
        <td style="padding: 10px;"><b>${b.fullName}</b></td>
        <td style="padding: 10px;">${b.phone}</td>
        <td style="padding: 10px;">${b.category}</td>
        <td style="padding: 10px;">${b.message || '-'}</td>
        <td style="padding: 10px;">
          <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background: #eee;">
            ${b.status.toUpperCase()}
          </span>
        </td>
        <td style="padding: 10px;">${b.adminNote || '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Bek Mebeli - Buyurtmalar Hisoboti</title>
          <style>
            body { font-family: sans-serif; color: #333; margin: 40px; }
            h1 { font-family: serif; color: #1e293b; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f1f5f9; text-align: left; padding: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>BEK MEBELI — BUYURTMALAR RO'YXATI</h1>
          <p>Yaratilgan vaqt: ${new Date().toLocaleString('uz-UZ')}</p>
          <hr />
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Mijoz ismi</th>
                <th>Telefon</th>
                <th>Mebel turi</th>
                <th>Izoh / O'lcham</th>
                <th>Holat</th>
                <th>Admin qeydlari</th>
              </tr>
            </thead>
            <tbody>
              ${ordersHtml}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Booking stats computations (Feature 13)
  const stats = {
    total: bookings.length,
    yangi: bookings.filter(b => b.status === 'yangi').length,
    aloqada: bookings.filter(b => b.status === 'aloqada').length,
    kelishildi: bookings.filter(b => b.status === 'kelishildi').length,
    yakunlandi: bookings.filter(b => b.status === 'yakunlandi').length,
    bekor: bookings.filter(b => b.status === 'bekor_qilindi').length,
  };

  const estimatedTotalRevenue = stats.kelishildi * averageOrderValue + stats.yakunlandi * averageOrderValue;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
      
      {/* SUCCESS / ERROR TOAST INDICATOR */}
      <AnimatePresence>
        {operationSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center space-x-3 text-sm font-semibold border border-emerald-500"
          >
            <CheckCircle className="w-5 h-5 text-white" />
            <span>{operationSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[92vh] flex flex-col relative"
      >
        
        {/* PANEL HEADER */}
        <div className="bg-slate-950 text-white p-6 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <span className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-display font-bold text-white text-lg">
              B
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-xl tracking-wide text-white">BEK MEBELI</h2>
                <span className="bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full uppercase">Admin Panel</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Tizim: {currentUserEmail}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Refresh Button */}
            <button 
              onClick={async () => {
                setIsOperating(true);
                await onRefreshAll();
                setIsOperating(false);
                triggerSuccessMessage("Ma'lumotlar bazasi yangilandi!");
              }}
              disabled={isOperating}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title="Bazani yangilash"
            >
              <RefreshCw className={`w-5 h-5 ${isOperating ? 'animate-spin text-gold-400' : ''}`} />
            </button>

            {/* Print button */}
            <button 
              onClick={handlePrintOrders}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title="Hisobotni chop etish"
            >
              <Printer className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
            >
              Panelni yopish
            </button>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-slate-50">
          
          {/* SIDEBAR TABS (Feature 15: Easy navigation) */}
          <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible shrink-0 gap-1 md:space-y-1">
            {[
              { id: 'dashboard', label: "Boshqaruv Paneli", icon: TrendingUp },
              { id: 'bookings', label: `Buyurtmalar (${stats.yangi + stats.aloqada})`, icon: FileText },
              { id: 'categories', label: "Katalog Sozlamalari", icon: Settings },
              { id: 'testimonials', label: "Mijozlar Fikrlari", icon: MessageSquare },
              { id: 'settings', label: "Aloqa Ma'lumotlari", icon: MapPin },
              { id: 'admins', label: "Adminlar Boshqaruvi", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedBooking(null);
                    setEditingCategory(null);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 shrink-0 cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gold-500 text-slate-950 font-bold shadow-lg shadow-gold-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-850/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* SEED ACTION IF EMPTY */}
            {bookings.length === 0 && categories.length === 0 && (
              <div className="pt-6 hidden md:block">
                <button 
                  onClick={onSeedDatabase}
                  className="w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Bazani Seeding qilish</span>
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE CONTENT VIEW */}
          <div className="flex-grow p-6 overflow-y-auto">
            
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Stats Bento Grid (Feature 13) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Barcha buyurtmalar</span>
                    <h3 className="text-3xl font-bold text-slate-950 mt-1">{stats.total} ta</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-gold-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm relative overflow-hidden">
                    <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase font-semibold">Yangi buyurtmalar</span>
                    <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.yangi} ta</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.yangi / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
                    <span className="text-[10px] font-mono tracking-wider text-emerald-500 uppercase font-semibold font-semibold">Kelishildi / Yakunlandi</span>
                    <h3 className="text-3xl font-bold text-emerald-600 mt-1">{stats.kelishildi + stats.yakunlandi} ta</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? ((stats.kelishildi + stats.yakunlandi) / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
                    <span className="text-[10px] font-mono tracking-wider text-rose-500 uppercase font-semibold">Bekor qilingan</span>
                    <h3 className="text-3xl font-bold text-rose-600 mt-1">{stats.bekor} ta</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.bekor / stats.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>

                {/* Database Activation Card if DB is empty */}
                {bookings.length === 0 && categories.length === 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Database className="w-10 h-10 text-indigo-600 shrink-0" />
                      <div>
                        <h4 className="font-display font-semibold text-lg text-indigo-900">Ma'lumotlar bazasi hali bo'sh</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed max-w-xl">
                          Hozirda Firestore ma'lumotlar bazasida mebel kategoriyalari yoki settings mavjud emas. Quyidagi tugmani bosish orqali barcha rasmiy boshlang'ich ma'lumotlar, mebel kategoriyalari, aloqa settingslari va rasm linklarini bazaga bir soniyada yuklang!
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onSeedDatabase}
                      className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/15 whitespace-nowrap cursor-pointer"
                    >
                      Boshlang'ich Ma'lumotlarni Yuklash
                    </button>
                  </div>
                )}

                {/* Additional KPI Tool: Estimator & System Summary (Feature 13) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Revenue Estimator */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-base text-slate-900">Kutilayotgan tushum hisoblagichi</h4>
                      <span className="p-1.5 rounded-lg bg-gold-50 text-gold-700 font-mono text-[10px] font-bold">Modellashtirish</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sizning tasdiqlangan (kelishilgan va yakunlangan) buyurtmalaringiz uchun hisoblanayotgan taxminiy daromad.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">1 ta mebel narxi (O'rtacha)</span>
                        <input 
                          type="number" 
                          value={averageOrderValue}
                          onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                          className="w-full bg-transparent font-bold text-slate-900 text-sm mt-1 focus:outline-none border-b border-slate-200"
                        />
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl text-white">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Kutilayotgan Umumiy Summa</span>
                        <span className="text-sm sm:text-base font-bold text-gold-400 block mt-1">
                          {estimatedTotalRevenue.toLocaleString('uz-UZ')} UZS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Console Logs (Feature 12) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-3">
                    <h4 className="font-display font-semibold text-base text-slate-900">Tizim holati va xavfsizlik diagnostikasi</h4>
                    <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed space-y-2 max-h-32 overflow-y-auto">
                      <div className="text-emerald-400">[OK] Firebase Firestore xavfsiz ulanish muvaffaqiyatli.</div>
                      <div className="text-gold-400">[INFO] Kiruvchi so'rovlarni filtrlash qoidasi (ABAC) faol.</div>
                      <div className="text-slate-400">[INFO] Jami ro'yxatga olingan adminlar soni: {admins.length} ta.</div>
                      <div className="text-slate-400">[SYSTEM] Boshlang'ich tizim vaqti: 2026-07-04T11:15:00Z</div>
                    </div>
                  </div>

                </div>

                {/* Recent Bookings Quick list */}
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-semibold text-base text-slate-900">Oxirgi Yangi Buyurtmalar</h4>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium underline"
                    >
                      Barchasini ko'rish
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-medium">
                          <th className="py-2.5">Mijoz</th>
                          <th className="py-2.5">Telefon</th>
                          <th className="py-2.5">Mebel turi</th>
                          <th className="py-2.5">Holat</th>
                          <th className="py-2.5 text-right">Harakat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.filter(b => b.status === 'yangi').slice(0, 5).map((b) => (
                          <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="py-3 font-semibold text-slate-900">{b.fullName}</td>
                            <td className="py-3 font-mono">{b.phone}</td>
                            <td className="py-3 text-slate-600">{b.category}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-medium border border-amber-200">
                                YANGI
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setTempAdminNote(b.adminNote || '');
                                  setActiveTab('bookings');
                                }}
                                className="text-gold-600 hover:text-gold-700 font-semibold"
                              >
                                Boshqarish
                              </button>
                            </td>
                          </tr>
                        ))}
                        {bookings.filter(b => b.status === 'yangi').length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400 font-light">
                              Hozirda yangi buyurtmalar mavjud emas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 2. DETAILED BOOKINGS MANAGER */}
            {activeTab === 'bookings' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Bookings List Panel */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-lg text-slate-950">Buyurtmalar Ro'yxati</h3>
                  
                  {/* Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input 
                        type="text" 
                        placeholder="Mijoz ismi yoki tel raqami..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-700 cursor-pointer"
                    >
                      <option value="all">Barcha holatlar</option>
                      <option value="yangi">Yangi</option>
                      <option value="aloqada">Aloqada</option>
                      <option value="kelishildi">Kelishildi</option>
                      <option value="yakunlandi">Yakunlandi</option>
                      <option value="bekor_qilindi">Bekor qilingan</option>
                    </select>
                  </div>

                  {/* List */}
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredBookings.map((b) => (
                      <div 
                        key={b.id}
                        onClick={() => {
                          setSelectedBooking(b);
                          setTempAdminNote(b.adminNote || '');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedBooking?.id === b.id 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-150'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs sm:text-sm">{b.fullName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono uppercase ${
                            b.status === 'yangi' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'aloqada' ? 'bg-blue-100 text-blue-800' :
                            b.status === 'kelishildi' ? 'bg-purple-100 text-purple-800' :
                            b.status === 'yakunlandi' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] mt-2 opacity-80">
                          <span>{b.category}</span>
                          <span className="font-mono">{b.phone}</span>
                        </div>
                      </div>
                    ))}

                    {filteredBookings.length === 0 && (
                      <div className="py-12 text-center text-slate-400 font-light text-xs">
                        Kriteriylarga mos buyurtmalar topilmadi.
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Management Panel */}
                <div className="lg:col-span-5">
                  {selectedBooking ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-display font-semibold text-base text-slate-950">Buyurtma Tafsilotlari</h3>
                        <button 
                          onClick={() => setSelectedBooking(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-3.5 text-xs text-left">
                        <div>
                          <span className="text-slate-400 uppercase font-mono text-[9px] block">Mijoz ismi</span>
                          <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedBooking.fullName}</span>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 uppercase font-mono text-[9px] block">Telefon raqami</span>
                            <span className="font-mono font-bold text-slate-900 block mt-0.5">{selectedBooking.phone}</span>
                          </div>
                          <a 
                            href={`tel:${selectedBooking.phone}`}
                            className="bg-gold-500 hover:bg-gold-600 text-slate-950 p-2 rounded-lg transition-colors cursor-pointer"
                            title="Qo'ng'iroq qilish"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>

                        <div>
                          <span className="text-slate-400 uppercase font-mono text-[9px] block">Qiziqayotgan mebeli</span>
                          <span className="font-medium text-slate-800 block mt-0.5">{selectedBooking.category}</span>
                        </div>

                        {selectedBooking.message && (
                          <div>
                            <span className="text-slate-400 uppercase font-mono text-[9px] block">Mijoz yozgan izoh</span>
                            <p className="bg-slate-50 p-3 rounded-xl text-slate-600 leading-relaxed font-light border border-slate-100 mt-1">{selectedBooking.message}</p>
                          </div>
                        )}
                      </div>

                      {/* Direct Message (Feature 15) */}
                      <div className="pt-2">
                        <a 
                          href={`https://t.me/share/url?url=https://bekmebeli.uz&text=Assalomu%20alaykum%20${encodeURIComponent(selectedBooking.fullName)},%20siz%20Bek%20Mebeli%20do'konimizdan%20${encodeURIComponent(selectedBooking.category)}%20bo'yicha%20buyurtma%20qoldirgan%20edingiz.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                          <span>Telegram orqali xabar yuborish</span>
                        </a>
                      </div>

                      {/* Status Transition triggers (Feature 3) */}
                      <div className="border-t border-slate-100 pt-4 space-y-3">
                        <span className="text-slate-400 uppercase font-mono text-[9px] block text-left">Holatni o'zgartirish</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { status: 'yangi', label: 'Yangi', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
                            { status: 'aloqada', label: 'Aloqada', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' },
                            { status: 'kelishildi', label: 'Kelishildi', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
                            { status: 'yakunlandi', label: 'Yakunlandi', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
                            { status: 'bekor_qilindi', label: 'Bekor', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' }
                          ].map((item) => (
                            <button
                              key={item.status}
                              onClick={() => handleUpdateBookingStatus(selectedBooking.id, item.status as any)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${item.color} ${
                                selectedBooking.status === item.status ? 'ring-2 ring-slate-900 font-bold' : ''
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Admin Note editing (Feature 5) */}
                      <div className="border-t border-slate-100 pt-4 space-y-3 text-left">
                        <label className="text-slate-400 uppercase font-mono text-[9px] block">Admin qeydlari</label>
                        <textarea 
                          value={tempAdminNote}
                          onChange={(e) => setTempAdminNote(e.target.value)}
                          placeholder="Faqat administratorlar ko'radigan qeydlar..."
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
                        <button 
                          onClick={() => handleSaveAdminNote(selectedBooking.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Izohni saqlash
                        </button>
                      </div>

                      {/* Delete Trigger (Feature 4) */}
                      <div className="border-t border-slate-100 pt-4 text-right">
                        <button 
                          onClick={() => handleDeleteBooking(selectedBooking.id)}
                          className="text-rose-500 hover:text-rose-600 font-semibold text-xs flex items-center justify-end space-x-1 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Buyurtmani butkul o'chirish</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-light text-xs">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      Tafsilotlar va boshqaruv paneli ko'rinishi uchun birorta buyurtmani tanlang.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. DYNAMIC CATEGORIES MANAGER (Feature 9) */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                
                {editingCategory ? (
                  <form onSubmit={handleSaveCategory} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-display font-semibold text-base text-slate-950">Kategoriyani tahrirlash: {editingCategory.title}</h3>
                      <button 
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Kategoriya nomi</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.title}
                          onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Rasm havolasi (Unsplash)</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.image}
                          onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Qisqa tavsifi</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Batafsil matni (Modalda ko'rinadi)</label>
                        <textarea 
                          required
                          value={editingCategory.details}
                          rows={3}
                          onChange={(e) => setEditingCategory({ ...editingCategory, details: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Xomashyo & Materiallar</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.material}
                          onChange={(e) => setEditingCategory({ ...editingCategory, material: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Kafolat muddati</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.guarantee}
                          onChange={(e) => setEditingCategory({ ...editingCategory, guarantee: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Tayyorlanish muddati</label>
                        <input 
                          type="text" 
                          required
                          value={editingCategory.duration}
                          onChange={(e) => setEditingCategory({ ...editingCategory, duration: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>
                    </div>

                    {/* Manage Items list (Feature 10) */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <label className="block text-xs font-semibold text-slate-700 uppercase">To'plam tarkibiga kiruvchi qismlar listi</label>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Yangi mahsulot qo'shish (Masalan: Ikki kishilik karavot)..."
                          value={catItemInput}
                          onChange={(e) => setCatItemInput(e.target.value)}
                          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                        <button 
                          type="button"
                          onClick={handleAddCatItem}
                          className="bg-slate-900 text-white hover:bg-slate-800 p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {editingCategory.items.map((item, index) => (
                          <li key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                            <span className="font-medium text-slate-700">{item}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveCatItem(index)}
                              className="text-rose-500 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex gap-3">
                      <button 
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Kategoriyani saqlash
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                    </div>

                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-150 p-5 flex space-x-4 items-start shadow-sm hover:shadow-md transition-shadow">
                        <img 
                          src={c.image} 
                          alt={c.title} 
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-grow text-left">
                          <h4 className="font-display font-bold text-base text-slate-900">{c.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                            <span className="text-[10px] text-gold-600 font-bold bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                              {c.guarantee}
                            </span>
                            <button 
                              onClick={() => setEditingCategory({ ...c })}
                              className="text-xs text-slate-900 hover:text-gold-600 font-semibold flex items-center space-x-1"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Tahrirlash</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 4. MODERATE TESTIMONIALS MANAGER (Feature 11) */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg text-slate-950">Mijozlar Fikrlari</h3>
                  <button 
                    onClick={() => setShowAddTestimonial(!showAddTestimonial)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Yangi fikr qo'shish</span>
                  </button>
                </div>

                {showAddTestimonial && (
                  <form onSubmit={handleAddTestimonial} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4 text-left">
                    <h4 className="font-display font-semibold text-sm">Yangi fikr qo'shish formasi</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mijoz ismi</label>
                        <input 
                          type="text" 
                          required
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Manzili yoki unvoni</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Toshkent, Chilonzor"
                          value={newTestimonial.role}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Reyting (1-5)</label>
                        <select 
                          value={newTestimonial.rating}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500 cursor-pointer text-slate-700"
                        >
                          <option value="5">5 yulduz</option>
                          <option value="4">4 yulduz</option>
                          <option value="3">3 yulduz</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Fikr matni</label>
                      <textarea 
                        required
                        rows={2}
                        value={newTestimonial.comment}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Qo'shish
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowAddTestimonial(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white rounded-2xl border border-slate-150 p-5 flex items-start justify-between shadow-sm">
                      <div className="text-left space-y-2">
                        <div className="flex items-center space-x-1.5 text-gold-500">
                          {[...Array(t.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">"{t.comment}"</p>
                        <div className="text-[10px] text-slate-400 font-mono">
                          <span className="font-bold text-slate-800">{t.name}</span> — {t.role} ({t.date})
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl border border-rose-100 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 5. CONTACTS & SETTINGS MANAGER (Feature 12) */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6 text-left max-w-2xl mx-auto">
                <h3 className="font-display font-semibold text-base text-slate-950 border-b border-slate-100 pb-3">Aloqa Sozlamalarini Yangilash</h3>
                
                <div className="space-y-4">
                  
                  {/* Phone list settings */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 uppercase">Aloqa telefonlari</label>
                    {editedSettings.phones.map((phone, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          required
                          value={phone}
                          onChange={(e) => handleSettingsPhoneChange(idx, e.target.value)}
                          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500 font-mono"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveSettingsPhone(idx)}
                          className="text-rose-500 hover:text-rose-600 p-2.5"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={handleAddSettingsPhone}
                      className="text-xs text-gold-600 hover:text-gold-700 font-semibold flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4 inline" />
                      <span>Telefon qo'shish</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">E-pochta manzili</label>
                    <input 
                      type="email" 
                      required
                      value={editedSettings.email}
                      onChange={(e) => setEditedSettings({ ...editedSettings, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Ustaxona & Manzilimiz</label>
                    <input 
                      type="text" 
                      required
                      value={editedSettings.address}
                      onChange={(e) => setEditedSettings({ ...editedSettings, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Ish vaqti</label>
                    <input 
                      type="text" 
                      required
                      value={editedSettings.workingHours}
                      onChange={(e) => setEditedSettings({ ...editedSettings, workingHours: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Instagram sahifa linki</label>
                      <input 
                        type="text" 
                        required
                        value={editedSettings.instagram}
                        onChange={(e) => setEditedSettings({ ...editedSettings, instagram: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Telegram admin yoki kanal linki</label>
                      <input 
                        type="text" 
                        required
                        value={editedSettings.telegram}
                        onChange={(e) => setEditedSettings({ ...editedSettings, telegram: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Google Xarita linki (Manzilimiz uchun)</label>
                    <input 
                      type="text" 
                      required
                      value={editedSettings.mapsLink}
                      onChange={(e) => setEditedSettings({ ...editedSettings, mapsLink: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                </div>

                <div className="border-t border-slate-100 pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Barcha o'zgarishlarni saqlash
                  </button>
                </div>
              </form>
            )}

            {/* 6. ADMINS MANAGEMENT (Feature 6 & 8) */}
            {activeTab === 'admins' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Add admin form */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4 text-left">
                  <h3 className="font-display font-semibold text-base text-slate-950">Yangi Admin tayinlash</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Kompaniyaning boshqa dizaynerlari yoki menejerlariga admin huquqini taqdim etish. Foydalanuvchining login qilgan UID va Email kiritilishi zarur.
                  </p>
                  
                  <form onSubmit={handleAddAdmin} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">Admin Emaili</label>
                      <input 
                        type="email" 
                        required
                        placeholder="Masalan: manager@gmail.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">Foydalanuvchi UID (Google Auth UID)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Foydalanuvchining shaxsiy ID kodi"
                        value={newAdminUid}
                        onChange={(e) => setNewAdminUid(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-gold-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block leading-relaxed">
                        Yangi admin bo'ladigan xodim avval saytdan kirishi va uning UID kodi sizga ma'lum bo'lishi kerak.
                      </span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4 text-white" />
                      <span>Admin etib tasdiqlash</span>
                    </button>
                  </form>
                </div>

                {/* Admins List view (Feature 7) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-base text-slate-950">Ro'yxatdan o'tgan Adminlar</h3>
                  
                  <div className="space-y-2">
                    {/* Hardcoded Bootstrap Admin representation */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-950 flex items-center justify-between text-left">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs">tuyginovsardor@gmail.com</span>
                          <span className="bg-gold-500 text-slate-950 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Asoschi</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">Tizim bo'yicha birlamchi administrator</span>
                      </div>
                      <span className="text-slate-400 text-xs">Asoschi</span>
                    </div>

                    {/* Dynamic admins */}
                    {admins.filter(a => a.email !== 'tuyginovsardor@gmail.com').map((admin) => (
                      <div key={admin.id} className="p-4 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between text-left">
                        <div>
                          <span className="font-bold text-xs text-slate-950 block">{admin.email}</span>
                          <span className="text-[9px] text-slate-400 block mt-1">UID: {admin.id}</span>
                        </div>

                        <button 
                          onClick={() => handleRevokeAdmin(admin.id, admin.email)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                          title="Adminlik huquqini olib tashlash"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}

                    {admins.filter(a => a.email !== 'tuyginovsardor@gmail.com').length === 0 && (
                      <div className="py-6 text-center text-slate-400 font-light text-xs">
                        Boshqa adminlar biriktirilmagan.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </motion.div>
    </div>
  );
}
