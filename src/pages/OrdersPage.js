import { useEffect, useState } from 'react';
import { Package, Calendar } from 'lucide-react';

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <p className="text-lg" style={{ color: '#5A5A5A' }}>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div data-testid="no-orders-message" className="container mx-auto px-6 md:px-12 py-20 text-center">
        <Package size={64} className="mx-auto mb-6" style={{ color: '#9CA3AF' }} />
        <h1 className="text-4xl font-medium tracking-tight mb-4" style={{ color: '#4A0404' }}>
          No Orders Yet
        </h1>
        <p className="text-lg" style={{ color: '#5A5A5A' }}>Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
      <h1 data-testid="orders-heading" className="text-4xl md:text-5xl font-medium tracking-tight mb-12" style={{ color: '#4A0404' }}>
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            data-testid={`order-${order.id}`}
            className="bg-white p-8 border border-stone-200"
          >
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: '#4A0404' }}>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#5A5A5A' }}>
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-widest uppercase font-semibold mb-1" style={{ color: '#D4AF37' }}>
                  {order.status}
                </p>
                <p data-testid={`order-total-${order.id}`} className="text-2xl font-semibold" style={{ color: '#4A0404' }}>
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-stone-200 last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#4A0404' }}>{item.name}</p>
                    <p className="text-sm" style={{ color: '#5A5A5A' }}>Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium" style={{ color: '#4A0404' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-sm" style={{ color: '#5A5A5A' }}>
                <span className="font-medium" style={{ color: '#4A0404' }}>Shipping Address:</span>{' '}
                {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}, {order.shipping_address.country}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}