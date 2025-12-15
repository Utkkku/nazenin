import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  X, 
  Menu, 
  ArrowLeft,
  Check, 
  Minus, 
  Plus,
  Instagram,
  Info,
  Leaf,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from './lib/supabase';

// --- TYPES ---

type View = 'home' | 'products' | 'admin';

type ColorType = 'white' | 'brown' | 'green' | 'pink';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  color: ColorType;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  date: string;
  customerName: string;
  email: string;
  address: string;
  total: number;
  note?: string;
  status: 'pending' | 'confirmed';
}

// --- DATA ---

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sonsuz İpek Şakayık",
    category: "Silk Masterpiece",
    price: 2850,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be025b?q=80&w=800",
    description: "Su istemez, güneş beklemez. Yıllarca ilk günkü zarafetini korur.",
    color: 'pink'
  },
  {
    id: 2,
    name: "Ebedi Pampas Otu",
    category: "Dried Collection",
    price: 1450,
    image: "https://images.unsplash.com/photo-1596627006856-114757595513?q=80&w=800",
    description: "Dökülme yapmayan özel işlem. Bohem ve zamansız bir dokunuş.",
    color: 'brown'
  },
  {
    id: 3,
    name: "İpek Dokunuşlu Orkide",
    category: "Real-Touch Series",
    price: 3200,
    image: "https://images.unsplash.com/photo-1566927467984-6332be7377d0?q=80&w=800",
    description: "Gerçeğinden ayırt edilemeyen doku. Evinizin kalıcı mücevheri.",
    color: 'white'
  },
  {
    id: 4,
    name: "Miras Pamuk Dalları",
    category: "Natural Dried",
    price: 950,
    image: "https://images.unsplash.com/photo-1516205651411-84f31072aa0e?q=80&w=800",
    description: "Doğal kurutulmuş, %100 organik pamuk. Saf ve yalın güzellik.",
    color: 'white'
  },
  {
    id: 5,
    name: "Silver Dollar Okaliptüs",
    category: "Faux Greenery",
    price: 1100,
    image: "https://images.unsplash.com/photo-1598522338166-70e0a5585d82?q=80&w=800",
    description: "Soğuk yeşil tonlarıyla minimalist alanlar için ideal tamamlayıcı.",
    color: 'green'
  },
  {
    id: 6,
    name: "Kurutulmuş Ortanca",
    category: "Dried Collection",
    price: 1650,
    image: "https://images.unsplash.com/photo-1595356269931-d8579979b009?q=80&w=800",
    description: "Vintage görünümü sevenler için, sonbaharın en güzel tonları.",
    color: 'pink'
  },
  {
    id: 7,
    name: "Zeytin Dalı Demeti",
    category: "Faux Greenery",
    price: 1350,
    image: "https://images.unsplash.com/photo-1463936575229-469941621863?q=80&w=800",
    description: "Akdeniz esintisi. Barışın ve doğallığın simgesi yapay zeytin dalları.",
    color: 'green'
  },
  {
    id: 8,
    name: "Yabani Kuru Başaklar",
    category: "Dried Collection",
    price: 850,
    image: "https://images.unsplash.com/photo-1621980649733-1ec9413247c4?q=80&w=800",
    description: "Altın sarısı tonlarıyla evinize sıcaklık ve bereket katar.",
    color: 'brown'
  }
];

// --- STORAGE KEYS ---
const STORAGE_PRODUCTS_KEY = 'nazeninya_products';
const STORAGE_ORDERS_KEY = 'nazeninya_orders';

// --- COMPONENTS ---

export default function App() {
  // --- VIEW STATE ---

  const [view, setView] = useState<View>('home');

  // --- APP STATE ---

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', address: '', card: '' });

  // --- FILTER STATE ---

  const [filterColor, setFilterColor] = useState<ColorType | 'all'>('all');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [adminTab, setAdminTab] = useState<'orders' | 'products'>('orders');

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    image: '',
    description: '',
    color: 'white',
  });

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- EFFECTS ---

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load data from Supabase or localStorage (fallback)
  useEffect(() => {
    const loadProducts = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true });

          if (error) {
            console.error('Supabase products error:', error);
            // Fallback to localStorage
            loadFromLocalStorage();
          } else if (data && data.length > 0) {
            // Convert database format to app format
            const formattedProducts: Product[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: Number(p.price),
              image: p.image,
              description: p.description,
              color: p.color as ColorType,
            }));
            setProducts(formattedProducts);
          } else {
            // No data in Supabase, use defaults
            setProducts(DEFAULT_PRODUCTS);
          }
        } catch (err) {
          console.error('Failed to load products from Supabase:', err);
          loadFromLocalStorage();
        }
      } else {
        // Supabase not configured, use localStorage
        loadFromLocalStorage();
      }
    };

    const loadOrders = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Supabase orders error:', error);
            loadOrdersFromLocalStorage();
          } else if (data) {
            const formattedOrders: Order[] = data.map((o: any) => ({
              id: o.id,
              date: o.date || o.created_at,
              customerName: o.customer_name,
              email: o.email,
              address: o.address,
              total: Number(o.total),
              note: o.note || undefined,
              status: o.status as 'pending' | 'confirmed',
            }));
            setOrders(formattedOrders);
          }
        } catch (err) {
          console.error('Failed to load orders from Supabase:', err);
          loadOrdersFromLocalStorage();
        }
      } else {
        loadOrdersFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const storedProducts = window.localStorage.getItem(STORAGE_PRODUCTS_KEY);
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts) as Product[];
          if (Array.isArray(parsed) && parsed.length) {
            setProducts(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setProducts(DEFAULT_PRODUCTS);
    };

    const loadOrdersFromLocalStorage = () => {
      try {
        const storedOrders = window.localStorage.getItem(STORAGE_ORDERS_KEY);
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders) as Order[];
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    // Initial load
    loadProducts();
    loadOrders();

    // Real-time subscriptions for Supabase
    if (supabase) {
      const productsChannel = supabase
        .channel('products-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'products' },
          () => {
            loadProducts();
          }
        )
        .subscribe();

      const ordersChannel = supabase
        .channel('orders-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        productsChannel.unsubscribe();
        ordersChannel.unsubscribe();
      };
    }
  }, []);

  // Persist products to Supabase or localStorage (fallback)
  useEffect(() => {
    if (products.length === 0) return; // Don't save empty array on initial load

    const saveProducts = async () => {
      if (supabase) {
        try {
          // Get current products from Supabase
          const { data: existingProducts } = await supabase
            .from('products')
            .select('id');

          const existingIds = new Set(existingProducts?.map(p => p.id) || []);

          // Delete products that are not in current state
          const currentIds = new Set(products.map(p => p.id));
          const toDelete = Array.from(existingIds).filter(id => !currentIds.has(id));
          
          if (toDelete.length > 0) {
            await supabase.from('products').delete().in('id', toDelete);
          }

          // Upsert all products
          const productsToUpsert = products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            image: p.image,
            description: p.description,
            color: p.color,
          }));

          const { error } = await supabase
            .from('products')
            .upsert(productsToUpsert, { onConflict: 'id' });

          if (error) {
            console.error('Supabase products save error:', error);
            // Fallback to localStorage
            saveToLocalStorage();
          }
        } catch (err) {
          console.error('Failed to save products to Supabase:', err);
          saveToLocalStorage();
        }
      } else {
        saveToLocalStorage();
      }
    };

    const saveToLocalStorage = () => {
      try {
        window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
        window.dispatchEvent(new Event('localStorageUpdate'));
      } catch {
        // ignore
      }
    };

    saveProducts();
  }, [products]);

  // Persist orders to Supabase or localStorage (fallback)
  useEffect(() => {
    if (orders.length === 0) return; // Don't save empty array on initial load

    const saveOrders = async () => {
      if (supabase) {
        try {
          const ordersToUpsert = orders.map(o => ({
            id: o.id,
            customer_name: o.customerName,
            email: o.email,
            address: o.address,
            total: o.total,
            note: o.note || null,
            status: o.status,
            date: o.date,
          }));

          const { error } = await supabase
            .from('orders')
            .upsert(ordersToUpsert, { onConflict: 'id' });

          if (error) {
            console.error('Supabase orders save error:', error);
            saveOrdersToLocalStorage();
          }
        } catch (err) {
          console.error('Failed to save orders to Supabase:', err);
          saveOrdersToLocalStorage();
        }
      } else {
        saveOrdersToLocalStorage();
      }
    };

    const saveOrdersToLocalStorage = () => {
      try {
        window.localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
        window.dispatchEvent(new Event('localStorageUpdate'));
      } catch {
        // ignore
      }
    };

    saveOrders();
  }, [orders]);

  // Scroll to top when view changes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  // --- HANDLERS ---

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('processing');
    
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customerName: formData.name,
      email: formData.email,
      address: formData.address,
      total: cartTotal,
      note: undefined,
      status: 'pending',
    };

    // Save to Supabase or localStorage
    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .insert({
            customer_name: newOrder.customerName,
            email: newOrder.email,
            address: newOrder.address,
            total: newOrder.total,
            note: newOrder.note || null,
            status: newOrder.status,
            date: newOrder.date,
          });

        if (error) {
          console.error('Supabase order insert error:', error);
          // Fallback to localStorage
          setOrders(prev => [newOrder, ...prev]);
        } else {
          // Order will be loaded via real-time subscription
          setOrders(prev => [newOrder, ...prev]);
        }
      } catch (err) {
        console.error('Failed to save order to Supabase:', err);
        setOrders(prev => [newOrder, ...prev]);
      }
    } else {
      setOrders(prev => [newOrder, ...prev]);
    }

    setTimeout(() => {
      setOrderStatus('success');
      setCart([]);
    }, 2000);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setOrderStatus('idle');
    setFormData({ name: '', email: '', address: '', card: '' });
  };

  const handleViewChange = (newView: 'home' | 'products') => {
    setView(newView);
    setAdminLoginOpen(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const created: Product = { id: nextId, ...newProduct };
    setProducts(prev => [...prev, created]);
    setNewProduct({
      name: '',
      category: '',
      price: 0,
      image: '',
      description: '',
      color: 'white',
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleConfirmOrder = (id: number) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'confirmed' } : o)));
  };

  const handleDeleteOrder = (id: number) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // --- FILTER LOGIC ---

  const getFilteredProducts = () => {
    let result = [...products];
    // Filter
    if (filterColor !== 'all') {
      result = result.filter(p => p.color === filterColor);
    }
    // Sort
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    // Slice for Home page
    if (view === 'home') {
      return result.slice(0, 4);
    }
    return result;
  };

  const displayedProducts = getFilteredProducts();

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-canvas font-sans text-stone-800 relative overflow-x-hidden selection:bg-wood-900 selection:text-white">
      
      {/* --- NAVBAR --- */}

      <nav className={`fixed top-0 w-full z-40 transition-all duration-700 ease-in-out px-6 md:px-12 py-6 flex items-center ${isScrolled || view !== 'home' ? 'bg-canvas/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent text-white'}`}>
        {/* Left: main navigation */}
        <div className="flex-1 flex items-center gap-6">
          <Menu className={`w-6 h-6 cursor-pointer hover:text-wood-900 transition-colors ${isScrolled || view !== 'home' ? 'text-stone-800' : 'text-white'}`} strokeWidth={1} />
          <div className={`hidden md:flex gap-8 text-xs tracking-[0.2em] font-medium uppercase ${isScrolled || view !== 'home' ? 'text-stone-800' : 'text-white/90'}`}>
            <button onClick={() => handleViewChange('home')} className="hover:text-wood-900 transition-colors">Ana Sayfa</button>
            <button onClick={() => handleViewChange('products')} className="hover:text-wood-900 transition-colors">Koleksiyon</button>
          </div>
        </div>

        {/* Center: brand, perfectly centered */}
        <div className="flex-1 flex justify-center">
          <h1 
            onClick={() => handleViewChange('home')}
            className={`font-serif text-3xl md:text-4xl italic font-semibold tracking-wide transition-colors cursor-pointer text-center ${isScrolled || view !== 'home' ? 'text-stone-800' : 'text-white'}`}
          >
            Nazeninyaeverflora
          </h1>
        </div>

        {/* Right: cart */}
        <div className="flex-1 flex justify-end">
          <button onClick={() => setIsCartOpen(true)} className="relative group flex items-center gap-2 justify-end">
            <span className={`text-xs font-medium mr-1 hidden md:inline tracking-widest uppercase ${isScrolled || view === 'products' ? 'text-stone-800' : 'text-white'}`}>Sepet</span>
            <ShoppingBag className={`w-5 h-5 inline-block hover:text-wood-900 transition-colors ${isScrolled || view === 'products' ? 'text-stone-800' : 'text-white'}`} strokeWidth={1} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-wood-900 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </nav>

      {/* --- VIEW: HOME --- */}

      {view === 'home' && (
        <div className="animate-fade-in">
          {/* HERO SECTION */}
          <header className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-canvas">
            {/* Background image: luxury satin rose bouquet */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/image.png"
                alt="Lüks Saten Gül Buketi"
                className="w-full h-full object-cover object-center animate-[scale-in_25s_ease-out_infinite_alternate]"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Dark overlay to ensure text readability over bright satin highlights */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50 md:bg-black/45" /> 
            </div>

            {/* Text block on translucent panel */}
            <div className="relative z-10 px-4">
              <div className="max-w-xl mx-auto bg-black/25 backdrop-blur-md rounded-3xl px-6 py-8 md:px-10 md:py-10 text-center text-white animate-slide-up">
                <span className="block text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-medium text-[#FDE68A] border-b border-white/30 w-fit mx-auto pb-2">
                  Timeless Faux Botanicals
                </span>
                <h2 className="font-serif text-5xl md:text-7xl italic font-normal leading-[1.1] mb-6 drop-shadow-lg">
                  Solmayan Zarafet, <br />
                  <span className="not-italic font-light text-[#FDE68A]">Evinizin Mücevheri.</span>
                </h2>
                <p className="text-white/80 font-light max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
                  El işçiliğiyle hazırlanmış yapay çiçekler; her gün ilk günkü kadar taze,
                  her mekânda sonsuz bir zarafet.
                </p>
                <button 
                  onClick={() => handleViewChange('products')}
                  className="bg-white/10 backdrop-blur border border-white/40 text-white px-10 py-4 rounded-full font-serif text-sm tracking-widest hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-stone-900 transition-all duration-500"
                >
                  KEŞFET
                </button>
              </div>
            </div>
          </header>

          {/* FEATURED PRODUCTS */}

          <section className="relative z-10 py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-stone-200 pb-8">
              <div>
                <span className="text-wood-900 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Editörün Seçimi</span>
                <h3 className="font-serif text-4xl text-stone-800">Öne Çıkanlar</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {displayedProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </React.Fragment>
              ))}
            </div>

            <div className="mt-24 text-center">
              <button 
                onClick={() => handleViewChange('products')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-wood-900 text-white overflow-hidden rounded-sm transition-all hover:bg-stone-800 shadow-lg"
              >
                <span className="font-serif text-sm tracking-widest uppercase relative z-10">Tüm Koleksiyonu İncele</span>
                <ArrowLeft className="w-4 h-4 rotate-180 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* FEATURE / MANIFESTO */}

          <section className="bg-paper py-24 px-6">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 space-y-8">
                    <div className="flex items-center gap-3 text-wood-900 mb-2">
                        <Leaf size={20} />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Sürdürülebilir Lüks</span>
                    </div>
                    <h3 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
                        Su İstemez, <br/><i className="text-wood-900">Güneş Beklemez.</i>
                    </h3>
                    <p className="text-stone-600 font-light leading-relaxed max-w-md">
                        Gerçek çiçeklerin ömrü sayılıdır, bizim eserlerimiz ise birer mirastır. 
                        Antialerjik, evcil hayvan dostu ve bakım gerektirmeyen bu tasarımlar, 
                        modern yaşamın hızına ayak uydururken doğanın huzurunu evinize taşır.
                    </p>
                </div>

                <div className="order-1 md:order-2 h-[500px] overflow-hidden relative">
                    <img 
                        src="/image2.jpeg" 
                        alt="Dried Details - Nazeninyaeverflora" 
                        className="w-full h-full object-cover grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-stone-900/10"></div>
                </div>

            </div>
          </section>
        </div>
      )}

      {/* --- VIEW: PRODUCTS --- */}

      {view === 'products' && (
        <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in min-h-screen">
          {/* Header & Back Button */}
          <div className="mb-12">
            <button 
              onClick={() => handleViewChange('home')}
              className="flex items-center gap-2 text-stone-400 hover:text-wood-900 transition-colors mb-6 text-xs uppercase tracking-widest font-medium"
            >
              <ArrowLeft size={16} /> Ana Sayfaya Dön
            </button>
            <h2 className="font-serif text-5xl italic text-stone-800">Tüm Koleksiyon</h2>
          </div>

          {/* Filter Bar */}
          <div className="sticky top-24 z-30 bg-canvas/95 backdrop-blur py-4 mb-12 border-y border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Color Filter */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-wood-900 border-r border-stone-200 pr-4 mr-2">
                <Filter size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Filtrele</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'white', label: 'Beyaz' },
                  { id: 'brown', label: 'Toprak' },
                  { id: 'pink', label: 'Pembe' },
                  { id: 'green', label: 'Yeşil' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilterColor(opt.id as ColorType | 'all')}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      filterColor === opt.id 
                        ? 'bg-wood-900 text-white font-medium' 
                        : 'bg-white text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <ArrowUpDown size={14} className="text-stone-400" />
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent text-xs uppercase tracking-wider font-medium text-stone-600 focus:outline-none cursor-pointer"
              >
                <option value="default">Varsayılan</option>
                <option value="price-asc">Fiyat: Artan</option>
                <option value="price-desc">Fiyat: Azalan</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-full py-24 text-center text-stone-400">
                <p className="font-serif text-xl italic">Bu kriterlere uygun eser bulunamadı.</p>
                <button 
                  onClick={() => setFilterColor('all')}
                  className="mt-4 text-xs underline text-wood-900 hover:text-stone-800"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW: ADMIN --- */}

      {view === 'admin' && isAdminAuthenticated && (
        <div className="pt-24 pb-16 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in min-h-screen flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 bg-paper border border-stone-200 p-6 flex flex-col gap-6">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400">Panel</span>
              <h2 className="font-serif text-2xl text-stone-800">Yönetim</h2>
            </div>
            <nav className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => setAdminTab('orders')}
                className={`flex justify-between items-center px-3 py-2 rounded-sm text-left tracking-[0.18em] uppercase ${
                  adminTab === 'orders'
                    ? 'bg-wood-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>Siparişler</span>
                <span className="text-[10px] opacity-70">{orders.length}</span>
              </button>
              <button
                onClick={() => setAdminTab('products')}
                className={`flex justify-between items-center px-3 py-2 rounded-sm text-left tracking-[0.18em] uppercase ${
                  adminTab === 'products'
                    ? 'bg-wood-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>Ürünler</span>
                <span className="text-[10px] opacity-70">{products.length}</span>
              </button>
              <button
                onClick={() => { setIsAdminAuthenticated(false); setView('home'); }}
                className="mt-4 px-3 py-2 rounded-sm text-left tracking-[0.18em] uppercase text-stone-400 hover:text-wood-900 hover:bg-stone-100"
              >
                Çıkış
              </button>
            </nav>
          </aside>

          {/* Content */}
          <section className="flex-1 bg-white border border-stone-200 p-6 md:p-8 shadow-sm">
            {adminTab === 'orders' && (
              <>
                <header className="mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
                      Son Siparişler
                    </span>
                    <h3 className="font-serif text-2xl text-stone-800">Siparişler</h3>
                  </div>
                  <span className="text-xs text-stone-400">
                    Toplam {orders.length} kayıt
                  </span>
                </header>
                {orders.length === 0 ? (
                  <p className="text-sm text-stone-400 italic">
                    Henüz kaydedilmiş bir sipariş bulunmuyor.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-t border-stone-200">
                      <thead className="text-left text-[11px] uppercase tracking-[0.18em] text-stone-400">
                        <tr>
                          <th className="py-3 pr-4">Tarih</th>
                          <th className="py-3 pr-4">Müşteri</th>
                          <th className="py-3 pr-4">Tutar</th>
                          <th className="py-3 pr-4">Adres</th>
                          <th className="py-3 pr-4">Durum</th>
                          <th className="py-3 pr-4 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr
                            key={order.id}
                            className="border-t border-stone-100 hover:bg-stone-50/60"
                          >
                            <td className="py-3 pr-4 align-top">
                              {new Date(order.date).toLocaleString('tr-TR')}
                            </td>
                            <td className="py-3 pr-4 align-top">
                              <div className="font-medium text-stone-800">
                                {order.customerName}
                              </div>
                              <div className="text-[11px] text-stone-400">
                                {order.email}
                              </div>
                            </td>
                            <td className="py-3 pr-4 align-top">
                              ₺{order.total.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-3 pr-4 align-top text-[11px] text-stone-500">
                              {order.address}
                            </td>
                            <td className="py-3 pr-4 align-top">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-[10px] uppercase tracking-[0.16em] ${
                                  order.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {order.status === 'pending' ? 'Beklemede' : 'Onaylandı'}
                              </span>
                            </td>
                            <td className="py-3 pr-0 align-top text-right">
                              <div className="flex justify-end gap-2">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleConfirmOrder(order.id)}
                                    className="px-3 py-1 rounded-full text-[11px] bg-emerald-600 text-white hover:bg-emerald-700"
                                  >
                                    Onayla
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="px-3 py-1 rounded-full text-[11px] bg-stone-100 text-stone-500 hover:bg-stone-200"
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {adminTab === 'products' && (
              <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
                      Vitrin Yönetimi
                    </span>
                    <h3 className="font-serif text-2xl text-stone-800">Ürünler</h3>
                  </div>
                  <span className="text-xs text-stone-400">
                    Toplam {products.length} ürün
                  </span>
                </header>

                {/* Add Product */}
                <form
                  onSubmit={handleAddProduct}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-stone-200 p-4 rounded bg-paper/60"
                >
                  <input
                    required
                    placeholder="Ürün Adı"
                    className="bg-transparent border-b border-stone-300 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none"
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <input
                    required
                    type="number"
                    min={0}
                    placeholder="Fiyat (₺)"
                    className="bg-transparent border-b border-stone-300 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none"
                    value={newProduct.price || ''}
                    onChange={e =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) || 0 })
                    }
                  />
                  <input
                    required
                    placeholder="Kategori"
                    className="bg-transparent border-b border-stone-300 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none"
                    value={newProduct.category}
                    onChange={e =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  />
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.2em] text-stone-400 mb-2">
                      Ürün Görseli
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="product-image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Dosya boyutu kontrolü (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Görsel boyutu 5MB\'dan küçük olmalıdır.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProduct({ ...newProduct, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="flex-1 cursor-pointer border-b border-stone-300 py-2 text-sm text-stone-800 hover:border-wood-900 transition-colors flex items-center gap-2"
                      >
                        <span className="text-stone-400">
                          {newProduct.image ? '✓ Görsel seçildi' : 'Görsel seç (JPG, PNG)'}
                        </span>
                      </label>
                      {newProduct.image && (
                        <div className="w-16 h-16 rounded overflow-hidden border border-stone-200">
                          <img 
                            src={newProduct.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {newProduct.image && (
                      <button
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, image: '' })}
                        className="mt-2 text-xs text-stone-400 hover:text-stone-600 underline"
                      >
                        Görseli kaldır
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Kısa Açıklama"
                    className="md:col-span-2 bg-transparent border-b border-stone-300 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none resize-none"
                    value={newProduct.description}
                    onChange={e =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                  />
                  <div className="flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-3 text-xs text-stone-600">
                      <span className="uppercase tracking-[0.2em] text-stone-400">
                        Renk
                      </span>
                      <select
                        className="bg-transparent border-b border-stone-300 py-1 text-xs focus:border-wood-900 outline-none"
                        value={newProduct.color}
                        onChange={e =>
                          setNewProduct({
                            ...newProduct,
                            color: e.target.value as ColorType,
                          })
                        }
                      >
                        <option value="white">Beyaz</option>
                        <option value="brown">Toprak</option>
                        <option value="pink">Pembe</option>
                        <option value="green">Yeşil</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-sm bg-wood-900 text-white text-[11px] uppercase tracking-[0.18em] hover:bg-stone-800"
                    >
                      Ürünü Ekle
                    </button>
                  </div>
                </form>

                {/* Product list */}
                <div className="border border-stone-200 rounded divide-y divide-stone-100 bg-white/60">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 overflow-hidden bg-paper">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-serif text-sm text-stone-800">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {product.category} • {product.color}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-medium text-wood-900">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-0 z-50 pointer-events-none ${isCartOpen ? 'pointer-events-auto' : ''}`}>
        <div 
          onClick={() => setIsCartOpen(false)}
          className={`absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-canvas shadow-2xl transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-stone-200`}>
          <div className="p-8 flex justify-between items-center border-b border-stone-200 bg-white/50">
            <h3 className="font-serif text-2xl text-stone-800">Seçtikleriniz</h3>
            <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-500">
              <X className="w-6 h-6 text-stone-400 hover:text-stone-800" strokeWidth={1} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-300 space-y-4">
                <ShoppingBag className="w-12 h-12" strokeWidth={0.5} />
                <p className="font-sans font-medium tracking-widest text-sm uppercase">Henüz bir eser eklenmedi</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-6 group animate-fade-in">
                  <div className="w-24 aspect-[3/4] overflow-hidden bg-paper relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-serif text-lg text-stone-800 leading-tight mb-2">{item.name}</h4>
                      <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">{item.category}</p>
                      <div className="flex items-center gap-1 text-[10px] text-wood-900 bg-wood-900/5 w-fit px-2 py-0.5 rounded">
                        <Info size={10} /> Bakım Gerektirmez
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.id, -1)} className="hover:text-wood-900"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="hover:text-wood-900"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-medium text-sm">₺{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 bg-white border-t border-stone-100">
              <div className="flex justify-between items-center mb-6 font-serif text-2xl">
                <span>Toplam</span>
                <span>₺{cartTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                className="w-full bg-wood-900 text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors duration-500 shadow-lg"
              >
                Siparişi Tamamla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- CHECKOUT MODAL --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={closeCheckout} />
          
          <div className="relative w-full max-w-lg bg-canvas shadow-2xl p-12 animate-slide-up border border-white/20">
            <button onClick={closeCheckout} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors">
              <X className="w-6 h-6" strokeWidth={1} />
            </button>

            {orderStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 border border-wood-900/20 bg-wood-900/5 rounded-full flex items-center justify-center mx-auto mb-6 text-wood-900">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-stone-800 mb-4">Mirasınız Hazırlanıyor</h3>
                <p className="text-stone-500 font-light mb-8 max-w-xs mx-auto">Sonsuz güzellikteki seçimleriniz, özenle paketlenip size ulaştırılacak.</p>
                <button onClick={closeCheckout} className="text-xs font-bold tracking-[0.2em] uppercase text-wood-900 border-b border-wood-900 pb-1 hover:text-stone-800 hover:border-stone-800 transition-colors">
                  Galeriye Dön
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-serif text-3xl text-stone-800 mb-8 text-center">Teslimat Bilgileri</h3>
                
                <form onSubmit={handleCheckout} className="space-y-8">
                  <div className="space-y-6">
                    <input 
                      required
                      placeholder="Ad Soyad"
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none transition-colors font-light"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      required
                      type="email"
                      placeholder="E-posta Adresi"
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none transition-colors font-light"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <textarea 
                      required
                      rows={2}
                      placeholder="Teslimat Adresi"
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none transition-colors font-light resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div className="bg-paper p-4 rounded text-xs text-stone-500 font-light flex gap-2 items-start">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <p>Siparişiniz özel korumalı kutularda gönderilir. Kargo süreci boyunca hasar görmez.</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={orderStatus === 'processing'}
                    className="w-full bg-wood-900 text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {orderStatus === 'processing' ? 'İşleniyor...' : `Güvenli Ödeme (₺${cartTotal.toLocaleString()})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-stone-800 text-stone-400 py-24 px-6 mt-0">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          <div className="space-y-6">
            <h4 className="font-serif text-3xl italic text-white">Nazeninyaeverflora</h4>
            <p className="font-light text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Timeless Faux Botanicals. <br/>
              Doğa kadar gerçek, zamandan bağımsız sanat eserleri.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 items-center md:items-start">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-wood-800 mb-4">Koleksiyonlar</span>
            <button onClick={() => { handleViewChange('products'); setFilterColor('white'); }} className="hover:text-white transition-colors text-sm font-light">Beyaz Düşler</button>
            <button onClick={() => { handleViewChange('products'); setFilterColor('brown'); }} className="hover:text-white transition-colors text-sm font-light">Toprak Tonları</button>
            <button onClick={() => { handleViewChange('products'); setFilterColor('green'); }} className="hover:text-white transition-colors text-sm font-light">Yeşil Vaha</button>
          </div>

          <div className="flex flex-col space-y-4 items-center md:items-start">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-wood-800 mb-4">İletişim</span>
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/nazeninyaeverflora/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5 cursor-pointer" />
              </a>
              <a 
                href="https://www.tiktok.com/@nazeninyaeverflora?lang=tr-TR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 cursor-pointer" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs mt-4">hello@nazeninyaeverflora.com</p>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light tracking-wider opacity-40">
          <p>&copy; 2024 Nazeninyaeverflora. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <p>Est. 2024 Istanbul</p>
            <button
              onClick={() => { setAdminLoginOpen(true); setAdminError(''); }}
              className="text-[10px] underline decoration-dotted text-stone-500 hover:text-stone-200"
            >
              Yönetici Girişi
            </button>
          </div>
        </div>
      </footer>

      {/* --- ADMIN LOGIN MODAL --- */}
      {adminLoginOpen && !isAdminAuthenticated && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setAdminLoginOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-canvas shadow-2xl p-8 border border-white/10 animate-slide-up">
            <button
              onClick={() => setAdminLoginOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1} />
            </button>
            <h3 className="font-serif text-2xl text-stone-800 mb-2">Yönetici Girişi</h3>
            <p className="text-xs text-stone-500 mb-6">
              Bu alan sadece Nazeninyaeverflora yönetimi içindir.
            </p>
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                const adminUsername = (import.meta.env as any).VITE_ADMIN_USERNAME;
                const adminPassword = (import.meta.env as any).VITE_ADMIN_PASSWORD;
                
                if (!adminUsername || !adminPassword) {
                  setAdminError('Admin bilgileri yapılandırılmamış. Lütfen sistem yöneticisine başvurun.');
                  return;
                }
                if (adminUser === adminUsername && adminPass === adminPassword) {
                  setIsAdminAuthenticated(true);
                  setAdminLoginOpen(false);
                  setAdminError('');
                  setView('admin');
                } else {
                  setAdminError('Kullanıcı adı veya şifre hatalı.');
                }
              }}
            >
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none"
                  placeholder="Yönetici adı"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Şifre
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    className="w-full bg-transparent border-b border-stone-300 py-2 pr-8 text-sm text-stone-800 placeholder:text-stone-400 focus:border-wood-900 outline-none"
                    placeholder="Şifreyi girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-stone-400 hover:text-stone-600 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
              {adminError && (
                <p className="text-[11px] text-rose-500 mt-1">{adminError}</p>
              )}
              <button
                type="submit"
                className="mt-4 w-full bg-wood-900 text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent for cleaner code

function ProductCard(props: { product: Product; onAddToCart: (p: Product) => void }) {
  const { product, onAddToCart } = props;
  return (
    <div className="group cursor-pointer relative flex flex-col">
      {/* Card Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden mb-6 bg-paper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
        />
        
        {/* Maintenance Free Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-20">
            <Info size={12} className="text-wood-900" />
            <span className="text-[10px] font-bold tracking-wider text-stone-600 uppercase">Bakım Gerektirmez</span>
        </div>
        {/* Glassmorphism Hover Action */}
        <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-white/95 backdrop-blur text-stone-800 py-4 text-xs font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-wood-900 hover:text-white transition-colors"
          >
            Sepete Ekle — ₺{product.price}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] tracking-[0.2em] text-stone-400 uppercase font-medium">{product.category}</span>
          <span className="text-[10px] uppercase text-stone-300 border border-stone-200 px-1.5 rounded">{product.color}</span>
        </div>
        <h4 className="font-serif text-2xl text-stone-800 group-hover:text-wood-900 transition-colors duration-300">{product.name}</h4>
        <p className="text-xs text-stone-500 font-light mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}