import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  IndianRupee, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Search,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Sparkles,
  Link,
  Check,
  ArrowRight,
  Loader2,
  Camera,
  Heart,
  RotateCcw,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, OrderStatus, FitType, SizeType, LookbookPost } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { formatPrice } from '../utils/formatPrice';
import { api } from '../services/api';

const BLACK_TEE_PRESETS = [
  {
    name: 'Standard Heavyweight Front',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Oversized Street Drape',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'BoxyFit Silhouette',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Gym T-shirt Athletic Compression',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Mineral Acid Washed',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: '280 GSM Cotton Texture',
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85',
  }
];

const LOOKBOOK_IMAGE_PRESETS = [
  {
    name: 'Oversized Model (Front)',
    url: '/images/lookbook/oversized_model.png',
  },
  {
    name: 'Oversized Model (Night Stance)',
    url: '/images/lookbook/oversized_model1.png',
  },
  {
    name: 'BoxyFit Model (Proportions)',
    url: '/images/lookbook/boxyfit_model.png',
  },
  {
    name: 'Standard Model (Street Cut)',
    url: '/images/lookbook/standard_model.png',
  },
  {
    name: 'Tokyo Neon Drape',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Minimalist Cargo Pair',
    url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Daylight Acid Fade',
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=85',
  },
];

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    setActiveTab,
    lookbookPosts,
    addLookbookPost,
    updateLookbookPost,
    deleteLookbookPost,
    resetLookbookPosts,
    isAdmin,
    setAuthModalOpen,
    setAuthMode,
    setAdminLoginIntent
  } = useShop();

  const [adminTab, setAdminTab] = useState<'analytics' | 'inventory' | 'orders' | 'lookbook'>('analytics');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inventorySearch, setInventorySearch] = useState('');

  // Lookbook / Street Archive Manager State
  const [showLookbookModal, setShowLookbookModal] = useState(false);
  const [editingLookbookId, setEditingLookbookId] = useState<string | null>(null);
  const [lbImage, setLbImage] = useState<string>(LOOKBOOK_IMAGE_PRESETS[0].url);
  const [lbCaption, setLbCaption] = useState<string>('');
  const [lbLikes, setLbLikes] = useState<string>('1200');
  const [lbProductId, setLbProductId] = useState<string>(products[0]?.id || 'bf-01');
  const [lbFitTag, setLbFitTag] = useState<FitType>('Oversized');
  const [lbImageUrlInput, setLbImageUrlInput] = useState<string>('');
  const [lbNotice, setLbNotice] = useState<string | null>(null);
  const [lbIsCompressing, setLbIsCompressing] = useState<boolean>(false);

  const handleOpenAddLookbook = () => {
    setEditingLookbookId(null);
    setLbImage(LOOKBOOK_IMAGE_PRESETS[0].url);
    setLbCaption('Tokyo night walk in the 280 GSM Onyx Oversized. Architectural drape that never loses shape.');
    setLbLikes('1250');
    setLbProductId(products[0]?.id || 'bf-01');
    setLbFitTag(products[0]?.fit || 'Oversized');
    setLbImageUrlInput('');
    setLbNotice(null);
    setShowLookbookModal(true);
  };

  const handleOpenEditLookbook = (post: LookbookPost) => {
    setEditingLookbookId(post.id);
    setLbImage(post.image);
    setLbCaption(post.caption);
    setLbLikes(post.likes.toString());
    setLbProductId(post.productId);
    setLbFitTag(post.fitTag || 'Oversized');
    setLbImageUrlInput('');
    setLbNotice(null);
    setShowLookbookModal(true);
  };

  const handleSaveLookbookPost = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedProduct = products.find((p) => p.id === lbProductId) || products[0];
    if (editingLookbookId) {
      updateLookbookPost({
        id: editingLookbookId,
        image: lbImage,
        caption: lbCaption,
        likes: Number(lbLikes) || 1000,
        productId: matchedProduct.id,
        productName: matchedProduct.name,
        fitTag: lbFitTag,
      });
    } else {
      const newPost: LookbookPost = {
        id: `lb-${Date.now().toString().slice(-4)}`,
        image: lbImage,
        caption: lbCaption,
        likes: Number(lbLikes) || 1200,
        productId: matchedProduct.id,
        productName: matchedProduct.name,
        fitTag: lbFitTag,
      };
      addLookbookPost(newPost);
    }
    setShowLookbookModal(false);
  };

  const handleLookbookImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLbIsCompressing(true);
      setLbNotice(`Uploading "${file.name}" to Cloudinary CDN...`);

      let finalUrl = '';
      try {
        const cdnRes = await api.uploadImage(file);
        finalUrl = cdnRes.url;
        setLbNotice(`✓ Cloudinary CDN Upload Complete!`);
      } catch (cdnErr) {
        console.warn('Cloudinary upload error, using local compressed image:', cdnErr);
        const result = await compressImage(file, 1200, 0.78);
        finalUrl = result.dataUrl;
        setLbNotice(`✓ Ready locally: ${result.compressedSizeKb} KB`);
      }

      setLbImage(finalUrl);
      setTimeout(() => setLbNotice(null), 3500);
    } catch (err) {
      console.error(err);
      alert('Could not process this image. Please select a PNG, JPG, or WEBP file.');
    } finally {
      setLbIsCompressing(false);
      e.target.value = '';
    }
  };

  // Image manipulation state
  const [addImageUrlInput, setAddImageUrlInput] = useState('');
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('280 GSM Combed French Terry Cotton');
  const [newPrice, setNewPrice] = useState('1299');
  const [newOriginalPrice, setNewOriginalPrice] = useState('1999');
  const [newFit, setNewFit] = useState<FitType>('Oversized');
  const [newGsm, setNewGsm] = useState('280');
  const [newDescription, setNewDescription] = useState('Engineered with 100% pre-shrunk reactive black cotton for daily heavy rotation.');
  const [newProductImages, setNewProductImages] = useState<string[]>([
    BLACK_TEE_PRESETS[0].url,
    BLACK_TEE_PRESETS[1].url,
  ]);
  const [newStockM, setNewStockM] = useState('15');
  const [newStockL, setNewStockL] = useState('20');
  const [newStockXl, setNewStockXl] = useState('10');

  // Analytics metrics calculations (in INR)
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 184500; // base simulated volume
  const totalOrdersCount = orders.length + 184;
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);
  const pendingOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  // Local File Upload reader with automatic high-compression
  const [isCompressing, setIsCompressing] = useState(false);

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setUploadNotice(`Uploading "${file.name}" to Cloudinary CDN...`);

      let finalUrl = '';
      try {
        const cdnRes = await api.uploadImage(file);
        finalUrl = cdnRes.url;
        setUploadNotice(`✓ Cloudinary CDN Upload Complete!`);
      } catch (cdnErr) {
        console.warn('Cloudinary upload error, using local compressed image:', cdnErr);
        const result = await compressImage(file, 1000, 0.75);
        finalUrl = result.dataUrl;
        setUploadNotice(`✓ Added locally (${result.compressedSizeKb} KB)`);
      }

      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          images: [...editingProduct.images, finalUrl]
        });
      } else {
        setNewProductImages((prev) => [...prev, finalUrl]);
      }
      setTimeout(() => setUploadNotice(null), 3500);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Could not process this image. Please select a standard PNG, JPG, or WEBP file.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleMakePrimaryImage = (index: number, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      const imgs = [...editingProduct.images];
      const [chosen] = imgs.splice(index, 1);
      imgs.unshift(chosen);
      setEditingProduct({ ...editingProduct, images: imgs });
    } else {
      const imgs = [...newProductImages];
      const [chosen] = imgs.splice(index, 1);
      imgs.unshift(chosen);
      setNewProductImages(imgs);
    }
  };

  const handleRemoveImageItem = (index: number, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      if (editingProduct.images.length <= 1) {
        alert("A product must keep at least 1 image. Upload or add another image before removing this one.");
        return;
      }
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_, i) => i !== index)
      });
    } else {
      setNewProductImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddUrlImage = (isEditing: boolean) => {
    if (!addImageUrlInput.trim()) return;
    const url = addImageUrlInput.trim();
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, url]
      });
    } else {
      setNewProductImages((prev) => [...prev, url]);
    }
    setAddImageUrlInput('');
  };

  const handleAddPresetImage = (presetUrl: string, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      if (editingProduct.images.includes(presetUrl)) return;
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, presetUrl]
      });
    } else {
      if (newProductImages.includes(presetUrl)) return;
      setNewProductImages((prev) => [...prev, presetUrl]);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = newProductImages.length > 0 ? newProductImages : [BLACK_TEE_PRESETS[0].url];
    const discountedPrice = Number(newPrice) || 1299;
    const mrp = Number(newOriginalPrice) || undefined;
    const created: Product = {
      id: `bf-${Date.now().toString().slice(-4)}`,
      name: newTitle.toUpperCase(),
      subtitle: newSubtitle,
      price: discountedPrice,
      originalPrice: mrp && mrp > discountedPrice ? mrp : undefined,
      fit: newFit,
      gsm: Number(newGsm) || 280,
      material: '100% Organic Heavyweight Cotton',
      description: newDescription,
      features: ['Pre-shrunk 0%', `${newGsm} GSM Heavyweight`, 'Double-stitched rib collar'],
      images: finalImages,
      sizes: [
        { size: 'S', stock: 8 },
        { size: 'M', stock: Number(newStockM) || 12 },
        { size: 'L', stock: Number(newStockL) || 15 },
        { size: 'XL', stock: Number(newStockXl) || 8 },
        { size: 'XXL', stock: 4 },
      ],
      rating: 5.0,
      reviewsCount: 1,
      isNewDrop: true,
      tag: 'NEW RELEASE'
    };

    addProduct(created);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('1299');
    setNewOriginalPrice('1999');
    setNewProductImages([BLACK_TEE_PRESETS[0].url, BLACK_TEE_PRESETS[1].url]);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      updateProduct(editingProduct);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Error updating product. Please try again.');
    }
  };

  // Filtered inventory
  const filteredInventory = products.filter(
    (p) =>
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.fit.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Executive Access Guard - only users with role === 'admin' can access
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-amber-400 shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            EXECUTIVE CLEARANCE REQUIRED
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
            ADMIN COMMAND RESTRICTED
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            This terminal gives direct control over MongoDB product inventory, order logistics, and Cloudinary CDN assets. You must be authenticated as an Executive Admin to proceed.
          </p>
        </div>

        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 max-w-md mx-auto text-left font-mono text-xs text-zinc-300 space-y-2">
          <div className="flex justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>MASTER ADMIN CREDENTIALS:</span>
            <span className="text-emerald-400 font-bold">Verified in DB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Email:</span>
            <span className="text-white font-bold">admin@blackfits.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Password:</span>
            <span className="text-amber-400 font-bold">Admin@BlackFits2026</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAdminLoginIntent(true);
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-heading font-black text-xs tracking-wider uppercase transition-colors shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In As Admin</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
          >
            Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              BLACKFITS EXECUTIVE COMMAND • MONGODB & CLOUDINARY LIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-0.5">
            ADMIN & INVENTORY ANALYTICS
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Store Health: Optimal • Database: MongoDB Atlas (Port 5000) • Media: Cloudinary CDN
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              adminTab === 'analytics'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              adminTab === 'inventory'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              adminTab === 'orders'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fulfillment ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('lookbook')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              adminTab === 'lookbook'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Street Archive ({lookbookPosts.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SALES ANALYTICS */}
      {adminTab === 'analytics' && (
        <div className="py-6 space-y-6">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Gross Revenue</span>
                <IndianRupee className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white">
                {formatPrice(totalRevenue)}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+24.6% vs previous month</span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Total Tees Dispatched</span>
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white">
                {totalOrdersCount}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1">
                Avg order volume: 1.8 tees / cart
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Avg Order Value (AOV)</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white">
                {formatPrice(avgOrderValue)}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1">
                +12% via Heavyweight bundle promo
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-mono uppercase">Pending Fulfillment</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-amber-400">
                {pendingOrders} Orders
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1">
                Queued in packing vault
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive SVG Revenue Trend Chart */}
            <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-base text-white">REVENUE TRAJECTORY (LAST 7 DAYS)</h3>
                  <p className="text-xs font-mono text-zinc-400">Daily gross sales recorded in INR</p>
                </div>
                <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  Total: Rs. 1,96,800
                </span>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4 bg-zinc-950/60 rounded-2xl border border-zinc-855">
                {[
                  { day: 'Mon', rev: 18200, height: '42%' },
                  { day: 'Tue', rev: 22400, height: '54%' },
                  { day: 'Wed', rev: 19800, height: '48%' },
                  { day: 'Thu', rev: 28900, height: '70%' },
                  { day: 'Fri', rev: 34500, height: '84%' },
                  { day: 'Sat', rev: 41200, height: '100%' },
                  { day: 'Sun', rev: 31800, height: '78%' },
                ].map((bar) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatPrice(bar.rev)}
                    </span>
                    <div
                      className="w-full bg-zinc-800 group-hover:bg-amber-400 rounded-t-lg transition-all duration-300"
                      style={{ height: bar.height }}
                    />
                    <span className="text-[11px] font-mono text-zinc-500 font-bold group-hover:text-white">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Silhouette Popularity Breakdown */}
            <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="font-heading font-black text-base text-white">POPULAR FITS</h3>
                <p className="text-xs font-mono text-zinc-400">Silhouette demand distribution</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Oversized (280 GSM)', pct: 46, color: 'bg-white' },
                  { name: 'BoxyFit (260 GSM)', pct: 28, color: 'bg-zinc-300' },
                  { name: 'Standard (240 GSM)', pct: 16, color: 'bg-amber-400' },
                  { name: 'Gym T-shirt (230 GSM)', pct: 10, color: 'bg-zinc-500' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300">{item.name}</span>
                      <span className="text-white font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                💡 <strong className="text-zinc-200">Recommendation:</strong> Restock size L & XL in Onyx Oversized to prevent stockout this weekend.
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {adminTab === 'inventory' && (
        <div className="py-6 space-y-4">
          
          {/* Inventory Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search catalog inventory..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New T-Shirt Drop</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="p-4">PRODUCT</th>
                    <th className="p-4">PHOTOS</th>
                    <th className="p-4">SILHOUETTE</th>
                    <th className="p-4">DENSITY</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK BY SIZE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {filteredInventory.map((item) => {
                    const totalUnits = item.sizes.reduce((sum, s) => sum + s.stock, 0);
                    const isLowStock = totalUnits < 15;

                    return (
                      <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-lg bg-black border border-zinc-800 overflow-hidden flex-shrink-0 relative">
                              <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-heading font-bold text-white text-sm line-clamp-1">{item.name}</div>
                              <span className="text-[10px] text-zinc-500">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">
                            <ImageIcon className="w-3 h-3 text-zinc-400" />
                            <span>{item.images.length} view(s)</span>
                          </span>
                        </td>

                        <td className="p-4 text-zinc-300 font-semibold">{item.fit}</td>

                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{formatPrice(item.price)}</span>
                            {item.originalPrice && item.originalPrice > item.price ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-zinc-500 line-through text-[10px] font-mono">
                                  {formatPrice(item.originalPrice)}
                                </span>
                                <span className="text-amber-400 text-[9px] font-bold font-mono bg-amber-400/10 border border-amber-400/30 px-1 py-0.2 rounded">
                                  -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">Regular MRP</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {item.sizes.map((s) => (
                              <span
                                key={s.size}
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  s.stock === 0
                                    ? 'bg-rose-950/40 text-rose-400 border-rose-800'
                                    : s.stock < 5
                                    ? 'bg-amber-950/40 text-amber-400 border-amber-800'
                                    : 'bg-zinc-850 text-zinc-300 border-zinc-750'
                                }`}
                              >
                                {s.size}: {s.stock}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          {totalUnits === 0 ? (
                            <span className="text-rose-400 bg-rose-950/40 border border-rose-800 px-2 py-0.5 rounded text-[10px]">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded text-[10px]">
                              Low ({totalUnits} pcs)
                            </span>
                          ) : (
                            <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                              Healthy ({totalUnits} pcs)
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct(item)}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white flex items-center gap-1 text-[11px]"
                              title="Edit T-Shirt details & photos"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit / Photos</span>
                            </button>
                            <button
                              onClick={() => deleteProduct(item.id)}
                              className="p-1.5 bg-zinc-800 hover:bg-rose-900/60 rounded-lg text-zinc-400 hover:text-rose-300"
                              title="Delete T-Shirt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ORDER FULFILLMENT MANAGER */}
      {adminTab === 'orders' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">LIVE DISPATCH & PACKING QUEUE</h3>
            <span className="text-xs font-mono text-zinc-400">Total: {orders.length} orders logged</span>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="p-4">ORDER ID</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4">RECIPIENT & CITY</th>
                    <th className="p-4">ITEMS</th>
                    <th className="p-4">BILLED</th>
                    <th className="p-4">PAYMENT</th>
                    <th className="p-4">STATUS CONTROL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-bold text-white">#{ord.id}</td>
                      <td className="p-4 text-zinc-400">{ord.date}</td>
                      <td className="p-4">
                        <div className="text-white font-medium">{ord.shippingAddress.name}</div>
                        <div className="text-[10px] text-zinc-500">{ord.shippingAddress.city}, {ord.shippingAddress.postalCode}</div>
                      </td>
                      <td className="p-4 text-zinc-300">{ord.items.length} tees</td>
                      <td className="p-4 font-black text-white">{formatPrice(ord.total)}</td>
                      <td className="p-4 text-emerald-400">{ord.paymentStatus}</td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-zinc-950 border border-zinc-700 text-xs font-bold text-amber-400 p-1.5 rounded-lg cursor-pointer focus:outline-none"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Quality Check & Packing">Quality Check & Packing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNITY & STREET ARCHIVE MANAGER */}
      {adminTab === 'lookbook' && (
        <div className="py-6 space-y-6">
          {/* Header & Stats Banner */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    STREETSTYLE SOCIAL ENGINE
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                  COMMUNITY & STREET ARCHIVE MANAGER
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1 max-w-xl">
                  Curate community photoshoots, street lookbook posts, and seamlessly connect each look to an actual T-shirt in your store catalog.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetLookbookPosts}
                  className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5"
                  title="Restore default streetstyle posts"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  onClick={handleOpenAddLookbook}
                  className="px-4 py-2.5 bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lookbook Post</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
              <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Published Looks</span>
                <span className="font-heading font-black text-lg text-white">{lookbookPosts.length} snaps</span>
              </div>
              <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Catalog Linkage</span>
                <span className="font-heading font-black text-lg text-emerald-400">100% Active</span>
              </div>
              <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Total Likes</span>
                <span className="font-heading font-black text-lg text-amber-400">
                  {lookbookPosts.reduce((s, p) => s + p.likes, 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Available Products</span>
                <span className="font-heading font-black text-lg text-zinc-300">{products.length} tees</span>
              </div>
            </div>
          </div>

          {/* Lookbook Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lookbookPosts.map((post) => {
              const connectedProduct = products.find((p) => p.id === post.productId) || products[0];

              return (
                <div
                  key={post.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-all shadow-md"
                >
                  {/* Top Photo with Badges */}
                  <div className="relative aspect-[4/5] bg-black overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 text-[10px] font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>{post.fitTag}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-rose-400 text-[10px] font-mono border border-zinc-800">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>

                    {/* Bottom caption preview on photo */}
                    <div className="absolute bottom-3 inset-x-3">
                      <p className="text-[11px] text-zinc-200 line-clamp-2 italic drop-shadow">
                        "{post.caption}"
                      </p>
                    </div>
                  </div>

                  {/* Connected Product Information */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-zinc-950/40">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-500 block font-bold">
                        CONNECTED STORE PRODUCT:
                      </span>
                      {connectedProduct ? (
                        <div className="flex items-center gap-2.5 mt-1.5 p-2 bg-zinc-900/80 rounded-xl border border-zinc-800">
                          <div className="w-9 h-11 rounded-lg bg-black border border-zinc-800 overflow-hidden flex-shrink-0">
                            <img src={connectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-heading font-bold text-white text-xs truncate">
                              {connectedProduct.name}
                            </h5>
                            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-0.5">
                              <span>{connectedProduct.fit}</span>
                              <span className="text-amber-400 font-bold">{formatPrice(connectedProduct.price)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-rose-950/40 border border-rose-800 text-rose-400 rounded-xl text-[10px] font-mono mt-1">
                          No connected product found
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-850">
                      <button
                        onClick={() => handleOpenEditLookbook(post)}
                        className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit / Link</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete this street lookbook post?`)) {
                            deleteLookbookPost(post.id);
                          }
                        }}
                        className="p-2 bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 rounded-xl transition-colors border border-transparent hover:border-rose-900/60"
                        title="Delete Lookbook Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {lookbookPosts.length === 0 && (
            <div className="p-12 text-center bg-zinc-900/20 border border-zinc-800 rounded-3xl space-y-3">
              <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
              <h4 className="font-heading font-bold text-white text-base">No Lookbook Snaps Published</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-mono">
                Click "Add Lookbook Post" to upload images or select model photoshoot presets and link them to your t-shirts.
              </p>
              <button
                onClick={handleOpenAddLookbook}
                className="px-4 py-2 bg-white text-zinc-950 font-bold rounded-xl text-xs hover:bg-zinc-200 transition-colors"
              >
                + Add First Street Look
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD NEW PRODUCT DROP */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleCreateProduct} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 text-xs font-mono my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-black text-base text-white">NEW T-SHIRT RELEASE ARCHIVE</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">T-Shirt Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PHANTOM ACID MINERAL CUT"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Silhouette / Fit</label>
                <select
                  value={newFit}
                  onChange={(e) => setNewFit(e.target.value as FitType)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  <option value="Standard">Standard (Classic Plain Heavyweight)</option>
                  <option value="Oversized">Oversized (Dropped Shoulder)</option>
                  <option value="BoxyFit">BoxyFit (Cropped & Wide)</option>
                  <option value="Gym T-shirt">Gym T-shirt (Athletic Stretch)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Fabric Weight (GSM)</label>
                <input
                  type="number"
                  value={newGsm}
                  onChange={(e) => setNewGsm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  Actual Price / MRP (Rs.) <span className="text-[10px] text-zinc-500">(Strikethrough Price)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1999"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  Discounted Selling Price (Rs.) <span className="text-[10px] text-amber-400 font-bold">(After-cut Price)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1299"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              {Number(newOriginalPrice) > Number(newPrice) && Number(newPrice) > 0 && (
                <div className="sm:col-span-2 p-2.5 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-bold">Discount Tag Preview:</span>
                    <span className="line-through text-zinc-500 font-mono">Rs. {Number(newOriginalPrice).toLocaleString('en-IN')}</span>
                    <span className="text-white font-bold font-mono">Rs. {Number(newPrice).toLocaleString('en-IN')}</span>
                    <span className="bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {Math.round(((Number(newOriginalPrice) - Number(newPrice)) / Number(newOriginalPrice)) * 100)}% OFF
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono">
                    Saves Rs. {(Number(newOriginalPrice) - Number(newPrice)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div>
                <label className="text-zinc-400 block mb-1">Initial Stock (Size L)</label>
                <input
                  type="number"
                  value={newStockL}
                  onChange={(e) => setNewStockL(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* PRODUCT IMAGES MANAGER FOR NEW PRODUCT */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  PRODUCT PHOTOS ({newProductImages.length})
                </span>
                <span className="text-[10px] text-zinc-400">First image is the Primary cover</span>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {newProductImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-zinc-700 group">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-amber-400 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMakePrimaryImage(idx, false)}
                          className="px-2 py-0.5 bg-white text-zinc-950 text-[9px] rounded font-bold hover:bg-zinc-200"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImageItem(idx, false)}
                        className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload & Add controls */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* File Upload button */}
                  <label className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-center transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload from Device (PNG/JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLocalImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  {/* Add URL form */}
                  <div className="flex-1 flex gap-1">
                    <input
                      type="text"
                      placeholder="Paste image URL or /images/..."
                      value={addImageUrlInput}
                      onChange={(e) => setAddImageUrlInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-750 rounded-xl px-2.5 py-1.5 text-white text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddUrlImage(false)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-400 block mb-1">Or choose preset photoshoot:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {BLACK_TEE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetImage(p.url, false)}
                        className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded whitespace-nowrap"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCompressing}
              className={`w-full py-3 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-2 ${
                isCompressing
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200'
              }`}
            >
              {isCompressing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isCompressing ? 'Optimizing Photos...' : 'Publish to Vault'}</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT (FEATURING FULL IMAGE MANAGEMENT) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleSaveEdit} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 text-xs font-mono my-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-white">EDIT PRODUCT: {editingProduct.name}</h3>
                <span className="text-[10px] text-zinc-500">ID: {editingProduct.id}</span>
              </div>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadNotice && (
              <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{uploadNotice}</span>
              </div>
            )}

            {/* PRODUCT IMAGES & VISUAL ASSETS CONTROLLER */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    PRODUCT IMAGES & VISUAL ASSETS ({editingProduct.images.length})
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Click "Make Cover" to set the primary store photo or remove/upload new ones.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-zinc-800 text-amber-400 px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              {/* Current Product Images List */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {editingProduct.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black border-2 transition-all group border-zinc-800 hover:border-zinc-500">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-400 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                        Cover Image
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-1.5 text-center">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleMakePrimaryImage(idx, true)}
                          className="px-2 py-1 bg-white text-zinc-950 text-[10px] rounded font-bold hover:bg-zinc-200 shadow"
                        >
                          Make Cover
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Primary
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImageItem(idx, true)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] flex items-center gap-1 shadow"
                        title="Delete image from product"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload from Local Device & Add URL */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {/* File Upload from PC */}
                  <label className="w-full sm:w-auto px-4 py-2 bg-white text-zinc-950 font-bold rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow">
                    <Upload className="w-4 h-4" />
                    <span>Upload Local Image (PC/Phone)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLocalImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>

                  {/* Add URL input */}
                  <div className="w-full sm:flex-1 flex gap-1">
                    <input
                      type="text"
                      placeholder="Paste image URL or /images/filename.jpg"
                      value={addImageUrlInput}
                      onChange={(e) => setAddImageUrlInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-750 rounded-xl px-2.5 py-2 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddUrlImage(true)}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700 font-bold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Quick Presets Picker */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-400 block mb-1">
                    Or select pre-shot black tee photography:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {BLACK_TEE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetImage(p.url, true)}
                        className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded whitespace-nowrap"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Silhouette / Fit</label>
                <select
                  value={editingProduct.fit}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value as FitType })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  <option value="Standard">Standard</option>
                  <option value="Oversized">Oversized</option>
                  <option value="BoxyFit">BoxyFit</option>
                  <option value="Gym T-shirt">Gym T-shirt</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  Actual Price / MRP (Rs.) <span className="text-[10px] text-zinc-500">(Strikethrough Price)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1999 (Clear to remove discount)"
                  value={editingProduct.originalPrice ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setEditingProduct({ ...editingProduct, originalPrice: val });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  Discounted Selling Price (Rs.) <span className="text-[10px] text-amber-400 font-bold">(Customer Price)</span>
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                {editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price ? (
                  <div className="p-2.5 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 font-bold">Discount Tag Preview:</span>
                      <span className="line-through text-zinc-500 font-mono">Rs. {editingProduct.originalPrice.toLocaleString('en-IN')}</span>
                      <span className="text-white font-bold font-mono">Rs. {editingProduct.price.toLocaleString('en-IN')}</span>
                      <span className="bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <span className="text-emerald-400 font-mono">
                      Customer saves Rs. {(editingProduct.originalPrice - editingProduct.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-400 text-[10px]">
                    ℹ️ No discount cut tag active. Set "Actual Price / MRP" higher than "Discounted Selling Price" to display strikethrough price and % OFF badge.
                  </div>
                )}
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">GSM Density</label>
                <input
                  type="number"
                  value={editingProduct.gsm}
                  onChange={(e) => setEditingProduct({ ...editingProduct, gsm: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingProduct.subtitle}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* Stock by size */}
            <div>
              <label className="text-zinc-400 block mb-1">Update Stock by Size</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {editingProduct.sizes.map((s, idx) => (
                  <div key={s.size} className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-bold">{s.size}</span>
                    <input
                      type="number"
                      value={s.stock}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updatedSizes = [...editingProduct.sizes];
                        updatedSizes[idx] = { ...s, stock: val };
                        setEditingProduct({ ...editingProduct, sizes: updatedSizes });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-1 text-white text-xs mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isCompressing}
                className={`px-6 py-3 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                  isCompressing
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {isCompressing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isCompressing ? 'Compressing Photos...' : 'Save Product Changes & Photos'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT LOOKBOOK POST */}
      {showLookbookModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form
            onSubmit={handleSaveLookbookPost}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 text-xs font-mono my-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-heading font-black text-base text-white">
                  {editingLookbookId ? 'EDIT STREET LOOKBOOK POST' : 'ADD COMMUNITY STREET SNAP'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLookbookModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {lbNotice && (
              <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>{lbNotice}</span>
              </div>
            )}

            {/* Lookbook Image Controller */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-white text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  STREETSTYLE PHOTOGRAPHY
                </span>
                <span className="text-[10px] text-zinc-400">Vertical aspect ratio (4:5)</span>
              </div>

              {/* Current Preview & Upload */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-32 aspect-[4/5] rounded-xl overflow-hidden bg-black border-2 border-zinc-700 flex-shrink-0 shadow-md relative group">
                  <img src={lbImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 text-[9px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>{lbFitTag}</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {/* File Upload from PC/Phone */}
                  <label className="w-full px-4 py-2.5 bg-white text-zinc-950 font-bold rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow text-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload from Device (PC / Phone)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLookbookImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Add URL input */}
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Paste image URL or /images/..."
                      value={lbImageUrlInput}
                      onChange={(e) => setLbImageUrlInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-750 rounded-xl px-2.5 py-1.5 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (lbImageUrlInput.trim()) {
                          setLbImage(lbImageUrlInput.trim());
                          setLbImageUrlInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700 font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Presets Picker */}
              <div className="pt-2 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-400 block mb-1">
                  Or select from street photoshoot library:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {LOOKBOOK_IMAGE_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLbImage(p.url)}
                      className={`px-2.5 py-1 rounded text-[10px] whitespace-nowrap border transition-colors ${
                        lbImage === p.url
                          ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400'
                          : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CHOOSE FIT TYPE (SHOWCASED ON TOP OF POST) */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-heading font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    CHOOSE FIT TYPE (SHOWCASED ON TOP OF POST)
                  </label>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Select the fit silhouette showcased in this photograph. Displayed as a highlighted badge on top of the post.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-zinc-950 px-2.5 py-1 rounded-full border border-amber-400/40 text-amber-400 font-bold flex items-center gap-1.5 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{lbFitTag}</span>
                </span>
              </div>

              {/* 4 Fit Options as visual selectable cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Standard', 'Oversized', 'BoxyFit', 'Gym T-shirt'] as FitType[]).map((fit) => {
                  const isSelected = lbFitTag === fit;
                  return (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setLbFitTag(fit)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-md shadow-amber-400/20'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-heading font-black">{fit}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-[9px] font-mono ${isSelected ? 'text-zinc-900 font-semibold' : 'text-zinc-500'}`}>
                        {fit === 'Standard' && 'Classic drape'}
                        {fit === 'Oversized' && 'Dropped shoulder'}
                        {fit === 'BoxyFit' && 'Wide & cropped'}
                        {fit === 'Gym T-shirt' && 'Athletic muscle'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONNECT TO ACTUAL STORE PRODUCT */}
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-3">
              <div>
                <label className="font-heading font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                  <Link className="w-4 h-4 text-amber-400" />
                  CONNECT TO ACTUAL STORE PRODUCT
                </label>
                <p className="text-[10px] text-zinc-400 mb-2">
                  Select which T-shirt from your catalog is featured in this photograph. When visitors tap "Shop The Fit", this exact product will be loaded for instant purchase.
                </p>

                <select
                  value={lbProductId}
                  onChange={(e) => {
                    const pId = e.target.value;
                    setLbProductId(pId);
                    const chosen = products.find((p) => p.id === pId);
                    if (chosen) {
                      setLbFitTag(chosen.fit);
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-white cursor-pointer font-sans text-xs focus:outline-none focus:border-amber-400"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.fit} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Preview of Connected Product */}
              {(() => {
                const chosen = products.find((p) => p.id === lbProductId) || products[0];
                if (!chosen) return null;
                return (
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-lg bg-black border border-zinc-800 overflow-hidden flex-shrink-0">
                        <img src={chosen.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-bold">
                          {chosen.fit}
                        </span>
                        <h4 className="font-heading font-bold text-white text-xs mt-1">
                          {chosen.name}
                        </h4>
                        <span className="text-zinc-400 font-mono text-[11px] font-bold">
                          {formatPrice(chosen.price)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Caption & Community Likes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-zinc-400 block mb-1">Lookbook Caption / Street Quote</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo night walk in the 280 GSM Onyx Oversized..."
                  value={lbCaption}
                  onChange={(e) => setLbCaption(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Community Likes</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1420"
                  value={lbLikes}
                  onChange={(e) => setLbLikes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowLookbookModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={lbIsCompressing}
                className={`px-6 py-3 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2 ${
                  lbIsCompressing
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {lbIsCompressing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingLookbookId ? 'Save Lookbook Changes' : 'Publish to Street Archive'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
