import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Sparkles, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1603274737277-f43f54446c7b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1
            data-testid="hero-heading"
            className="text-5xl md:text-7xl font-medium tracking-tight leading-tight text-white mb-6"
          >
            Elevate Your Beauty Ritual
          </h1>
          <p className="text-lg leading-relaxed text-white/90 mb-8 max-w-2xl mx-auto">
            Discover luxury skincare, makeup, and fragrances curated for the modern connoisseur
          </p>
          <Button
            data-testid="shop-now-button"
            onClick={() => navigate('/products')}
            className="bg-white text-[#4A0404] px-10 py-6 rounded-none hover:bg-[#F5F0E6] transition-all duration-300 font-medium tracking-wide text-sm uppercase"
          >
            Shop Now
            <ChevronRight className="ml-2" size={18} />
          </Button>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center items-center text-center gap-4">
              <Sparkles size={32} style={{ color: '#D4AF37' }} />
              <h3 className="text-xl font-medium" style={{ color: '#4A0404' }}>Premium Quality</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>Handpicked luxury products from renowned brands</p>
            </div>
            <div className="bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center items-center text-center gap-4">
              <Truck size={32} style={{ color: '#D4AF37' }} />
              <h3 className="text-xl font-medium" style={{ color: '#4A0404' }}>Free Shipping</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>Complimentary delivery on all orders</p>
            </div>
            <div className="bg-[#F5F0E6] p-8 md:p-12 flex flex-col justify-center items-center text-center gap-4">
              <Shield size={32} style={{ color: '#D4AF37' }} />
              <h3 className="text-xl font-medium" style={{ color: '#4A0404' }}>Authentic Products</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>100% genuine products guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: '#4A0404' }}>
              Featured Collection
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#5A5A5A' }}>
              Our most coveted selections this season
            </p>
          </div>
<div className="
  grid
  grid-cols-2
  lg:grid-cols-3
  gap-4
">
  {featuredProducts.slice(0, 6).map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

<div className="text-center mt-12">
  <Button
    data-testid="view-all-button"
    onClick={() => navigate('/products')}
    className="bg-transparent border border-[#4A0404] text-[#4A0404] px-8 py-4 rounded-none hover:bg-[#4A0404] hover:text-white transition-all duration-300 font-medium tracking-wide text-sm uppercase"
  >
    View All Products
  </Button>
</div>
</div>
</section>

<section className="py-20 md:py-32 px-6 md:px-12 lg:px-24 bg-[#F5F0E6]">
  <div className="container mx-auto">
<div 
  className="
    flex gap-2 md:gap-4 lg:gap-8
    overflow-x-auto scrollbar-hide 
    snap-x snap-mandatory 
    pb-4
  "
>
  {/* CARD 1 */}
  <div
    data-testid="category-skincare"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Skincare')}
  >
    <img
      src="https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop"
      alt="Skincare"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Skincare</h3>
    </div>
  </div>

  {/* CARD 2 */}
  <div
    data-testid="category-makeup"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Makeup')}
  >
    <img
      src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop"
      alt="Makeup"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Makeup</h3>
    </div>
  </div>

  {/* CARD 3 */}
  <div
    data-testid="category-perfume"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Perfume')}
  >
    <img
      src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop"
      alt="Perfume"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Perfume</h3>
    </div>
  </div>

  {/* CARD 4 */}
  <div
    data-testid="category-hair-tools"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Hair Tools')}
  >
    <img
      src="https://images.unsplash.com/photo-1700709678035-b6606373aa52?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Hair Tools"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Hair Tools</h3>
    </div>
  </div>

  {/* CARD 5 */}
  <div
    data-testid="category-brushes"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Brushes')}
  >
    <img
      src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1911&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Brushes"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Brushes</h3>
    </div>
  </div>

  {/* CARD 6 */}
  <div
    data-testid="category-bath-body"
    className="
      group relative 
      h-64 md:h-80 lg:h-96
      w-[calc(33.333%-0.33rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-1.33rem)]
      min-w-[calc(33.333%-0.33rem)] md:min-w-[calc(33.333%-0.66rem)] lg:min-w-[calc(16.666%-1.33rem)]
      overflow-hidden cursor-pointer rounded-lg
      snap-start
      flex-shrink-0
    "
    onClick={() => navigate('/products?category=Bath and Body')}
  >
    <img
      src="https://images.unsplash.com/photo-1673847401561-fcd75a7888c5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Bath & Body"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 md:p-6 lg:p-8">
      <h3 className="text-base md:text-2xl lg:text-3xl font-medium text-white">Bath & Body</h3>
    </div>
  </div>
</div>
</div>


</section>






</div>
);
}