import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔍 search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCartCount();
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/cart/`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
      } else {
        setCartCount(0);
      }
    } catch (e) {
      console.error(e);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCartCount(0);
    navigate('/');
  };


  // const fetchCartCount = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await fetch(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/cart`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (res.ok) {
  //       const data = await res.json();
  //       setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   setUser(null);
  //   navigate('/');
  // };

  // 🔍 ENTER SEARCH
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // 🔍 AJAX LIVE SEARCH
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/products?search=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="container mx-auto px-6 md:px-12">
        {/* MAIN NAV ROW */}
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/">
            <h1 className="text-3xl font-medium tracking-tight text-[#4A0404]">
              BEAUTÉ
            </h1>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-8">
            <Link to="/products" className="nav-link">Shop</Link>
            <Link to="/products?category=Skincare" className="nav-link">Skincare</Link>
            <Link to="/products?category=Makeup" className="nav-link">Makeup</Link>
            <Link to="/products?category=Perfume" className="nav-link">Perfume</Link>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* 🔍 SEARCH BUTTON - DESKTOP */}
            <div className="hidden md:block relative">
              {showSearch ? (
                <div className="relative border border-stone-300 bg-white w-64">
                  <div className="flex items-center px-3 py-2">
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      placeholder="Search products…"
                      className="w-full outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* LIVE RESULTS */}
                  {searchQuery && (
                    <div className="absolute left-0 top-full w-full bg-white border border-stone-300 shadow-lg z-50 max-h-80 overflow-y-auto">
                      {searchLoading && (
                        <div className="px-4 py-2 text-sm text-stone-500">
                          Searching...
                        </div>
                      )}

                      {!searchLoading && searchResults.length === 0 && (
                        <div className="px-4 py-2 text-sm text-stone-500">
                          No products found
                        </div>
                      )}

                      {!searchLoading &&
                        searchResults.slice(0, 5).map(product => (
                          <div
                            key={product._id}
                            onClick={() => {
                              navigate(`/products/${product._id}`);
                              setShowSearch(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-[#F5F0E6]"
                          >
                            {product.name || product.title}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="p-2 hover:bg-[#F5F0E6] rounded"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={20} className="text-[#4A0404]" />
                </button>
              )}
            </div>

            {/* 🔍 SEARCH BUTTON - MOBILE */}
            <button
              className="md:hidden p-2 hover:bg-[#F5F0E6] rounded"
              onClick={() => {
                setShowSearch(!showSearch);
                setMobileMenuOpen(false);
              }}
            >
              <Search size={20} className="text-[#4A0404]" />
            </button>

            {/* CART */}
            {user && (
              <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-[#F5F0E6] rounded">
                <ShoppingCart size={20} className="text-[#4A0404]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#4A0404] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* USER - DESKTOP */}
            {user ? (
              <div className="hidden md:block relative group">
                <button className="p-2 hover:bg-[#F5F0E6] rounded">
                  <User size={20} className="text-[#4A0404]" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/orders" className="block px-4 py-2 hover:bg-[#F5F0E6]">
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-[#F5F0E6]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} className="hidden md:inline-flex">
                Login
              </Button>
            )}

            {/* USER ICON - MOBILE */}
            {user && (
              <button 
                className="md:hidden p-2 hover:bg-[#F5F0E6] rounded"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setShowSearch(false);
                }}
              >
                <User size={20} className="text-[#4A0404]" />
              </button>
            )}

            {/* MOBILE MENU HAMBURGER */}
            <button
              className="md:hidden p-2 hover:bg-[#F5F0E6] rounded"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setShowSearch(false);
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR - FULL WIDTH */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <div className="relative border border-stone-300 bg-white">
              <div className="flex items-center px-3 py-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Search products…"
                  className="w-full outline-none text-sm"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* MOBILE LIVE RESULTS */}
              {searchQuery && (
                <div className="bg-white border-t border-stone-300 max-h-80 overflow-y-auto">
                  {searchLoading && (
                    <div className="px-4 py-2 text-sm text-stone-500">
                      Searching...
                    </div>
                  )}

                  {!searchLoading && searchResults.length === 0 && (
                    <div className="px-4 py-2 text-sm text-stone-500">
                      No products found
                    </div>
                  )}

                  {!searchLoading &&
                    searchResults.slice(0, 5).map(product => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/products/${product._id}`);
                          setShowSearch(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="px-4 py-3 cursor-pointer hover:bg-[#F5F0E6] border-b border-stone-100"
                      >
                        {product.name || product.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE MENU LINKS */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link 
              to="/products" 
              className="block py-2 hover:text-[#4A0404]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/products?category=Skincare" 
              className="block py-2 hover:text-[#4A0404]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skincare
            </Link>
            <Link 
              to="/products?category=Makeup" 
              className="block py-2 hover:text-[#4A0404]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Makeup
            </Link>
            <Link 
              to="/products?category=Perfume" 
              className="block py-2 hover:text-[#4A0404]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Perfume
            </Link>

            {/* MOBILE USER MENU */}
            {user ? (
              <>
                <Link 
                  to="/orders" 
                  className="block py-2 hover:text-[#4A0404] border-t border-stone-200 pt-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:text-[#4A0404]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Button 
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-3"
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}