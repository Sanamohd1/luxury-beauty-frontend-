import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { triggerCartUpdate } from '../lib/cartEvents';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    setIsAuthenticated(true);
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/cart/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
      } else {
        toast.error('Failed to load cart');
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        toast.error('Please login to continue');
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        await fetchCart();
        triggerCartUpdate();
        toast.success('Cart updated');
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
      } else {
        toast.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        toast.error('Please login to continue');
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.ok) {
        toast.success("Item removed");
        await fetchCart();
        triggerCartUpdate();
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error("Failed to remove item");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-lg text-stone-500">Loading cart...</p>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-20 text-center px-6">
        <h1 className="text-4xl font-medium mb-4 text-[#4A0404]">
          Login Required
        </h1>
        <p className="mb-8 text-stone-500">
          Please login to view your shopping cart
        </p>
        <Button
          onClick={() => navigate("/auth")}
          className="bg-[#4A0404] text-white px-8 py-4 rounded-none hover:bg-[#2D0202]"
        >
          Login / Sign Up
        </Button>
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center px-6">
        <h1 className="text-4xl font-medium mb-4 text-[#4A0404]">
          Your Cart is Empty
        </h1>
        <p className="mb-8 text-stone-500">
          Add some beautiful products to your cart
        </p>
        <Button
          onClick={() => navigate("/products")}
          className="bg-[#4A0404] text-white px-8 py-4 rounded-none hover:bg-[#2D0202]"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-6 lg:px-24 py-12">
      <h1 className="text-4xl font-medium mb-12 text-[#4A0404]">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.product_id}
              className="bg-white p-6 border flex flex-col sm:flex-row gap-6"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover mx-auto sm:mx-0 flex-shrink-0"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#4A0404] mb-2">
                  {item.name}
                </h3>
                <p className="text-xl font-semibold text-[#4A0404] mb-4">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex border">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-2 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4 flex items-center min-w-[50px] justify-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          item.quantity + 1
                        )
                      }
                      className="p-2 hover:bg-stone-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="flex items-center gap-2 text-sm text-[#4A0404] hover:text-[#2D0202] transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right text-xl font-semibold text-[#4A0404] sm:self-start">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-8 border sticky top-24">
            <h2 className="text-2xl font-medium mb-6 text-[#4A0404]">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-semibold">
                <span>Total</span>
                <span className="text-[#4A0404]">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#4A0404] text-white py-6 rounded-none hover:bg-[#2D0202] transition-colors font-medium"
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/products")}
              className="w-full mt-4 text-sm hover:bg-stone-100"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}