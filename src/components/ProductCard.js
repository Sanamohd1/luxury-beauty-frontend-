import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Safely handle missing product data
  if (!product) {
    return null;
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Safely get rating and reviews count with defaults
  const rating = product.rating || 0;
  const reviewsCount = product.reviews_count || 0;
  const stock = product.stock || 0;
  const price = product.price || 0;
  const originalPrice = product.original_price || null;
  const brand = product.brand || 'Unknown Brand';
  const name = product.name || 'Unnamed Product';
  const image = product.image || 'https://via.placeholder.com/400';

  return (
    <div
      onClick={() => navigate(`/products/${product.id || product._id}`)}
      className="group cursor-pointer bg-white border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 space-y-2">
        <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#D4AF37' }}>
          {brand}
        </p>

        <h3 className="font-medium text-lg tracking-tight line-clamp-2" style={{ color: '#4A0404' }}>
          {name}
        </h3>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.floor(rating) ? '#D4AF37' : 'none'}
              stroke="#D4AF37"
            />
          ))}
          <span className="text-xs ml-1" style={{ color: '#5A5A5A' }}>
            ({reviewsCount})
          </span>
        </div>

<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-2">
  <span className="text-xl font-semibold" style={{ color: '#4A0404' }}>
    ${price.toFixed(2)}
  </span>
  {originalPrice && (
    <div className="flex items-center gap-2">
      <span className="text-sm line-through" style={{ color: '#9CA3AF' }}>
        ${originalPrice.toFixed(2)}
      </span>
      <span className="bg-[#4A0404] text-white px-2 py-0.5 text-xs font-semibold">
        {discount}% OFF
      </span>
    </div>
  )}
</div>
        {stock < 10 && stock > 0 && (
          <p className="text-xs font-medium" style={{ color: '#D4AF37' }}>
            Only {stock} left in stock
          </p>
        )}

        {stock === 0 && (
          <p className="text-xs font-medium" style={{ color: '#DC2626' }}>
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );
}