import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { triggerCartUpdate } from '../lib/cartEvents'; // ✅ Add this import

export default function CheckoutPage({ user }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.items.length === 0) {
          navigate('/cart');
        } else {
          setCart(data);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shipping_address: shippingData,
          payment_method: 'mock'
        })
      });

      if (response.ok) {
        const order = await response.json();
        setPaymentSuccess(true);
        toast.success('Order placed successfully!');
        triggerCartUpdate(); // ✅ Add this to clear cart count in navbar
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <p className="text-lg" style={{ color: '#5A5A5A' }}>Loading...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div data-testid="payment-success-message" className="container mx-auto px-6 md:px-12 py-20 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle size={64} className="mx-auto mb-6" style={{ color: '#D4AF37' }} />
          <h1 className="text-4xl font-medium tracking-tight mb-4" style={{ color: '#4A0404' }}>
            Payment Successful!
          </h1>
          <p className="text-lg mb-8" style={{ color: '#5A5A5A' }}>
            Your order has been placed successfully. Redirecting to orders...
          </p>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
      <h1 data-testid="checkout-heading" className="text-4xl md:text-5xl font-medium tracking-tight mb-12" style={{ color: '#4A0404' }}>
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 border border-stone-200">
              <h2 className="text-2xl font-medium tracking-tight mb-6" style={{ color: '#4A0404' }}>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    Full Name *
                  </label>
                  <Input
                    data-testid="fullname-input"
                    type="text"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    Email *
                  </label>
                  <Input
                    data-testid="email-input"
                    type="email"
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    Address *
                  </label>
                  <Input
                    data-testid="address-input"
                    type="text"
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    City *
                  </label>
                  <Input
                    data-testid="city-input"
                    type="text"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    State *
                  </label>
                  <Input
                    data-testid="state-input"
                    type="text"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    Zip Code *
                  </label>
                  <Input
                    data-testid="zipcode-input"
                    type="text"
                    value={shippingData.zipCode}
                    onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#4A0404' }}>
                    Country *
                  </label>
                  <Input
                    data-testid="country-input"
                    type="text"
                    value={shippingData.country}
                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                    required
                    className="h-12 bg-transparent border-b border-stone-300 focus:border-[#4A0404] rounded-none px-0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-stone-200">
              <h2 className="text-2xl font-medium tracking-tight mb-6" style={{ color: '#4A0404' }}>
                Payment Method (Mock)
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border border-stone-300 cursor-pointer hover:border-[#4A0404] transition-colors">
                  <input
                    data-testid="credit-card-payment"
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#4A0404]"
                  />
                  <CreditCard size={24} style={{ color: '#4A0404' }} />
                  <div>
                    <p className="font-medium" style={{ color: '#4A0404' }}>Credit Card (Test)</p>
                    <p className="text-sm" style={{ color: '#5A5A5A' }}>Mock payment - no real charges</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 border border-stone-300 cursor-pointer hover:border-[#4A0404] transition-colors">
                  <input
                    data-testid="wallet-payment"
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#4A0404]"
                  />
                  <Wallet size={24} style={{ color: '#4A0404' }} />
                  <div>
                    <p className="font-medium" style={{ color: '#4A0404' }}>Digital Wallet (Test)</p>
                    <p className="text-sm" style={{ color: '#5A5A5A' }}>Mock payment - no real charges</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-stone-200 sticky top-24">
              <h2 className="text-2xl font-medium tracking-tight mb-6" style={{ color: '#4A0404' }}>
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#4A0404' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: '#5A5A5A' }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#4A0404' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mb-6 border-t border-stone-200 pt-6">
                <div className="flex justify-between">
                  <span style={{ color: '#5A5A5A' }}>Subtotal</span>
                  <span data-testid="order-subtotal" className="font-medium" style={{ color: '#4A0404' }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5A5A5A' }}>Shipping</span>
                  <span className="font-medium" style={{ color: '#D4AF37' }}>FREE</span>
                </div>
                <div className="border-t border-stone-200 pt-4 flex justify-between">
                  <span className="text-lg font-medium" style={{ color: '#4A0404' }}>Total</span>
                  <span data-testid="order-total" className="text-2xl font-semibold" style={{ color: '#4A0404' }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                data-testid="place-order-button"
                type="submit"
                disabled={processing}
                className="w-full bg-[#4A0404] text-white px-8 py-6 rounded-none hover:bg-[#2D0202] transition-all duration-300 font-medium tracking-wide text-sm uppercase"
              >
                {processing ? 'Processing...' : 'Place Order (Test)'}
              </Button>
              <p className="text-xs text-center mt-4" style={{ color: '#9CA3AF' }}>
                This is a test checkout. No real payment will be processed.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}