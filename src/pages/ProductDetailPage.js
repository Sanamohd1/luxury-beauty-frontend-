import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { triggerCartUpdate } from '../lib/cartEvents';

export default function ProductDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews?product_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          product_id: id, 
          quantity: quantity 
        })
      });

      if (response.ok) {
        toast.success('Added to cart!');
        triggerCartUpdate(); // ✅ Trigger cart update to refresh navbar
        // Don't navigate - let user continue shopping
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          product_id: id, 
          rating, 
          comment 
        })
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setComment('');
        setRating(0);
        fetchReviews();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <p className="text-lg" style={{ color: '#5A5A5A' }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <p className="text-lg" style={{ color: '#5A5A5A' }}>Product not found</p>
      </div>
    );
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="aspect-square mb-4 overflow-hidden border border-stone-200">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square overflow-hidden border-2 ${
                    selectedImage === img ? 'border-[#4A0404]' : 'border-stone-200'
                  } hover:border-[#4A0404] transition-colors`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: '#5A5A5A' }}>
            {product.brand}
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: '#4A0404' }}>
            {product.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} 
                stroke="#D4AF37" 
              />
            ))}
            <span className="text-sm" style={{ color: '#5A5A5A' }}>
              {product.rating} ({product.reviews_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-semibold mb-2" style={{ color: '#4A0404' }}>
              ${product.price.toFixed(2)}
            </p>
            {product.original_price && (
              <>
                <p className="text-lg line-through" style={{ color: '#9CA3AF' }}>
                  ${product.original_price.toFixed(2)}
                </p>
                <p className="text-sm font-medium" style={{ color: '#D4AF37' }}>
                  {discount}% OFF
                </p>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-base mb-8 leading-relaxed" style={{ color: '#5A5A5A' }}>
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="mb-8">
            <p className="text-sm font-medium mb-3" style={{ color: '#4A0404' }}>
              Quantity:
            </p>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-[#F5F0E6] transition-colors"
                style={{ color: '#4A0404' }}
              >
                -
              </button>
              <span className="text-lg font-medium w-12 text-center" style={{ color: '#4A0404' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-[#F5F0E6] transition-colors"
                style={{ color: '#4A0404' }}
              >
                +
              </button>
            </div>
            <p className="text-sm" style={{ color: '#5A5A5A' }}>
              {product.stock} in stock
            </p>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={addToCart}
            className="w-full bg-[#4A0404] text-white px-8 py-6 rounded-none hover:bg-[#2D0202] transition-all duration-300 font-medium tracking-wide text-sm uppercase flex items-center justify-center gap-3"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </Button>

          {/* Product Meta */}
          <div className="mt-8 pt-8 border-t border-stone-200 space-y-2">
            <p className="text-sm" style={{ color: '#5A5A5A' }}>
              Category: <span style={{ color: '#4A0404' }}>{product.category}</span>
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-xs border border-stone-300"
                    style={{ color: '#5A5A5A' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-stone-200 pt-12">
        <h2 className="text-3xl font-medium tracking-tight mb-8" style={{ color: '#4A0404' }}>
          Customer Reviews
        </h2>

        {/* REVIEW FORM */}
        {user && (
          <div className="bg-[#F5F0E6] p-8 mb-8 border border-stone-200">
            <h3 className="text-xl font-medium mb-6" style={{ color: '#4A0404' }}>
              Write a Review
            </h3>
            <form onSubmit={submitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#4A0404' }}>
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className="cursor-pointer transition-all"
                      fill={star <= (hoverRating || rating) ? '#D4AF37' : 'none'}
                      stroke="#D4AF37"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm mt-2" style={{ color: '#5A5A5A' }}>
                    You rated this product {rating} star{rating > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#4A0404' }}>
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows="4"
                  className="w-full border border-stone-300 p-3 outline-none focus:border-[#4A0404]"
                  placeholder="Share your experience with this product..."
                  style={{ color: '#4A0404' }}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#4A0404] text-white px-6 py-3 rounded-none hover:bg-[#2D0202] uppercase tracking-wide text-sm"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-[#F5F0E6] p-6 mb-8 border border-stone-200 text-center">
            <p className="mb-4" style={{ color: '#5A5A5A' }}>Please login to write a review</p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-[#4A0404] text-white px-6 py-3 rounded-none hover:bg-[#2D0202] uppercase tracking-wide text-sm"
            >
              Login
            </Button>
          </div>
        )}

        {/* REVIEWS LIST */}
        {reviews.length === 0 ? (
          <p data-testid="no-reviews-message" className="text-base" style={{ color: '#5A5A5A' }}>
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-6 border border-stone-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? '#D4AF37' : 'none'} 
                        stroke="#D4AF37" 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#4A0404' }}>
                    {review.user_name}
                  </span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#5A5A5A' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}