import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  History, 
  Search, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Package, 
  CreditCard, 
  CheckCircle,
  ExternalLink,
  Filter
} from 'lucide-react';

// --- Types ---

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  isAffiliate?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Delivered' | 'Shipped' | 'Processing';
}

type ShopView = 'browse' | 'cart' | 'orders';

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nitro Whey Gold Standard',
    price: 54.99,
    category: 'Supplements',
    rating: 4.8,
    reviews: 2150,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Adjustable Dumbbell Set (50lbs)',
    price: 199.99,
    category: 'Gear',
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Pro Yoga Mat - Non Slip',
    price: 45.00,
    category: 'Gear',
    rating: 4.6,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'The Science of Lifting',
    price: 24.95,
    category: 'Books',
    rating: 4.7,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'Resistance Bands Loop Set',
    price: 15.99,
    category: 'Gear',
    rating: 4.5,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'Pre-Workout Energy - Blue Raz',
    price: 32.50,
    category: 'Supplements',
    rating: 4.3,
    reviews: 150,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7782-XJ',
    date: 'Oct 15, 2023',
    total: 65.98,
    status: 'Delivered',
    items: [
      { ...PRODUCTS[2], quantity: 1 },
      { ...PRODUCTS[4], quantity: 1 }
    ]
  }
];

export const Shop = () => {
  const [view, setView] = useState<ShopView>('browse');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived State
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}-NW`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      total: cartTotal,
      status: 'Processing'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('orders');
  };

  // Filter Products
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      
      {/* Shop Sidebar / Navigation */}
      <aside className="w-full lg:w-64 shrink-0 space-y-8">
        
        {/* Main Nav Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden">
           <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              <button 
                onClick={() => setView('browse')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  view === 'browse' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Browse Products</span>
              </button>

              <button 
                onClick={() => setView('cart')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  view === 'cart' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-slate-900" />
                  )}
                </div>
                <span className="font-medium">My Cart</span>
                {cartItemCount > 0 && (
                   <span className="ml-auto text-xs font-bold bg-slate-800 px-2 py-1 rounded-full">{cartItemCount}</span>
                )}
              </button>

              <button 
                onClick={() => setView('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  view === 'orders' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-5 h-5" />
                <span className="font-medium">Order History</span>
              </button>
           </nav>
        </div>

        {/* Categories (Only visible in Browse) */}
        {view === 'browse' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hidden lg:block">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
               <Filter className="w-4 h-4" />
               <h3 className="font-bold">Categories</h3>
            </div>
            <div className="space-y-2">
               {['All', 'Supplements', 'Gear', 'Books'].map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                     activeCategory === cat ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Mini Promo */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white hidden lg:block shadow-lg shadow-indigo-500/20">
           <Star className="w-8 h-8 text-yellow-300 mb-4 fill-yellow-300" />
           <h3 className="font-bold text-lg mb-1">Pro Member Deal</h3>
           <p className="text-indigo-100 text-sm mb-4">Get 20% off all supplements this week.</p>
           <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold backdrop-blur-sm transition-colors">
              View Deals
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
         
         {/* --- BROWSE VIEW --- */}
         {view === 'browse' && (
           <div className="space-y-6">
              {/* Search & Mobile Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                 <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search for gear, protein, etc..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    />
                 </div>
                 <div className="flex gap-2 lg:hidden overflow-x-auto pb-1">
                    {['All', 'Supplements', 'Gear', 'Books'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border ${
                          activeCategory === cat ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredProducts.map(product => {
                   const cartItem = cart.find(item => item.id === product.id);
                   const quantity = cartItem ? cartItem.quantity : 0;
                   
                   return (
                   <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-cyan-900/10 hover:border-cyan-500/30 transition-all duration-300 group flex flex-col h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-white">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg border border-slate-700">
                           {product.category}
                         </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                         <div className="flex items-start justify-between gap-2 mb-2">
                           <h3 className="font-bold text-white leading-tight">{product.name}</h3>
                           <div className="flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                             <Star className="w-3 h-3 fill-yellow-400" />
                             {product.rating}
                           </div>
                         </div>
                         
                         <p className="text-slate-500 text-xs mb-4">{product.reviews} reviews</p>

                         <div className="mt-auto flex items-center justify-between">
                            <span className="text-xl font-bold text-white">${product.price}</span>
                            
                            {quantity > 0 ? (
                                <div className="flex items-center gap-3 bg-slate-950 rounded-xl p-1 border border-slate-800 shadow-lg shadow-cyan-900/20">
                                    <button 
                                        onClick={() => updateQuantity(product.id, -1)} 
                                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-bold text-white w-4 text-center">{quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(product.id, 1)} 
                                        className="p-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-slate-950 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                  onClick={() => addToCart(product)}
                                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
                                >
                                   <Plus className="w-5 h-5" />
                                </button>
                            )}
                         </div>
                      </div>
                   </div>
                 )})}
              </div>
           </div>
         )}

         {/* --- CART VIEW --- */}
         {view === 'cart' && (
            <div className="max-w-3xl mx-auto space-y-6">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-cyan-400" />
                  Your Shopping Cart
               </h2>

               {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                     <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-10 h-10 text-slate-600" />
                     </div>
                     <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                     <p className="text-slate-500 mb-6">Looks like you haven't added any gear yet.</p>
                     <button onClick={() => setView('browse')} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                        Start Browsing
                     </button>
                  </div>
               ) : (
                  <div className="space-y-6">
                     <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                        {cart.map((item) => (
                           <div key={item.id} className="p-4 border-b border-slate-800 last:border-0 flex items-center gap-4">
                              <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-white truncate">{item.name}</h4>
                                 <p className="text-sm text-slate-400">${item.price}</p>
                              </div>
                              <div className="flex items-center gap-3 bg-slate-950 rounded-lg p-1 border border-slate-800">
                                 <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                                    <Minus className="w-4 h-4" />
                                 </button>
                                 <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                 </button>
                              </div>
                              <button onClick={() => updateQuantity(item.id, -item.quantity)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Summary */}
                     <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                        <div className="space-y-3 mb-6">
                           <div className="flex justify-between text-slate-400">
                              <span>Subtotal</span>
                              <span>${cartTotal.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-slate-400">
                              <span>Shipping</span>
                              <span className="text-emerald-400">Free</span>
                           </div>
                           <div className="h-px bg-slate-800 my-2" />
                           <div className="flex justify-between text-white text-lg font-bold">
                              <span>Total</span>
                              <span>${cartTotal.toFixed(2)}</span>
                           </div>
                        </div>
                        <button 
                           onClick={handleCheckout}
                           className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                        >
                           <CreditCard className="w-5 h-5" />
                           Checkout Now
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* --- ORDERS VIEW --- */}
         {view === 'orders' && (
            <div className="max-w-3xl mx-auto space-y-6">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="w-6 h-6 text-indigo-400" />
                  Order History
               </h2>

               <div className="space-y-4">
                  {orders.map((order) => (
                     <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-white">{order.id}</h3>
                                 <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {order.status}
                                 </span>
                              </div>
                              <p className="text-sm text-slate-400">{order.date}</p>
                           </div>
                           <div className="text-left sm:text-right">
                              <p className="text-xs text-slate-500 uppercase font-bold">Total Amount</p>
                              <p className="text-xl font-bold text-white">${order.total.toFixed(2)}</p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-sm font-medium text-slate-200">{item.name}</h4>
                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                 </div>
                                 <div className="text-sm text-slate-300">
                                    ${(item.price * item.quantity).toFixed(2)}
                                 </div>
                              </div>
                           ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
                            <button className="text-sm text-slate-400 hover:text-white font-medium">View Invoice</button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                               <CheckCircle className="w-4 h-4" />
                               Track Order
                            </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </main>
    </div>
  );
};