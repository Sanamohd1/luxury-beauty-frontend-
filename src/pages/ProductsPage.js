import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);


  const filters = useMemo(() => ({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: Number(searchParams.get('minPrice') || 0),
    maxPrice: Number(searchParams.get('maxPrice') || 500),
    minRating: Number(searchParams.get('min_rating') || 0),
    maxRating: Number(searchParams.get('max_rating') || 0),
    search: searchParams.get('search') || '',
    preferences: searchParams.getAll('preference'),
    ingredients: searchParams.getAll('ingredient'),
    benefits: searchParams.getAll('benefit'),
    skin_types: searchParams.getAll('skin_type'),
    formulations: searchParams.getAll('formulation'),
    spf: searchParams.get('spf') || ''
  }), [searchParams]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined || value === 0) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const toggleMultiParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    const currentValues = params.getAll(key);
    
    if (currentValues.includes(value)) {
      // Remove the value
      params.delete(key);
      currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
    } else {
      // Add the value
      params.append(key, value);
    }
    
    setSearchParams(params);
  };

  const setRatingRange = (min, max) => {
    const params = new URLSearchParams(searchParams);
    if (min === 0 && max === 0) {
      params.delete('min_rating');
      params.delete('max_rating');
    } else {
      params.set('min_rating', min);
      if (max > 0) {
        params.set('max_rating', max);
      } else {
        params.delete('max_rating');
      }
    }
    setSearchParams(params);
  };

  function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);

    return (
      <div className="border-b pb-4 mb-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex justify-between w-full font-medium mb-2"
        >
          {title}
          <span>{open ? '–' : '+'}</span>
        </button>

        {open && <div className="pb-4 space-y-2">{children}</div>}
      </div>
    );
  }

  const clearFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    setLoading(true);
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/products?${searchParams}`;
    console.log('Fetching URL:', url);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('Products received:', data);
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <h1 className="text-4xl mb-6">Shop Products</h1>

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search products…"
          value={filters.search}
          onChange={(e) => updateParam('search', e.target.value)}
          className="w-full sm:w-72"
        />

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden flex items-center gap-2 border px-4 py-2 rounded"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-8 mt-8">
        {/* FILTERS SIDEBAR - FULL SCREEN ON MOBILE */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto">
            <div className="p-4">
              {/* MOBILE HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* RATING */}
              <FilterSection title="Rating">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 4 && filters.maxRating === 0}
                    onChange={() => setRatingRange(4, 0)}
                  />
                  4+ stars
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 3 && filters.maxRating === 4}
                    onChange={() => setRatingRange(3, 4)}
                  />
                  3 - 4 stars
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 2 && filters.maxRating === 3}
                    onChange={() => setRatingRange(2, 3)}
                  />
                  2 - 3 stars
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 0 && filters.maxRating === 2}
                    onChange={() => setRatingRange(0, 2)}
                  />
                  Below 2 stars
                </label>
                {(filters.minRating > 0 || filters.maxRating > 0) && (
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === 0 && filters.maxRating === 0}
                      onChange={() => setRatingRange(0, 0)}
                    />
                    All ratings
                  </label>
                )}
              </FilterSection>

              {/* PREFERENCE */}
              <FilterSection title="Preference">
                {['Vegan', 'Cruelty Free', 'Dermatologist Tested'].map(p => (
                  <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.preferences.includes(p)}
                      onChange={() => toggleMultiParam('preference', p)}
                    />
                    {p}
                  </label>
                ))}
              </FilterSection>

              {/* SUPER INGREDIENTS */}
              <FilterSection title="Super Ingredients">
                {['Vitamin C', 'Niacinamide', 'Retinol', 'Hyaluronic Acid'].map(i => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.ingredients.includes(i)}
                      onChange={() => toggleMultiParam('ingredient', i)}
                    />
                    {i}
                  </label>
                ))}
              </FilterSection>

              {/* BENEFITS */}
              <FilterSection title="Benefits">
                {['Brightening', 'Hydration', 'Anti Aging', 'Acne Control'].map(b => (
                  <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.benefits.includes(b)}
                      onChange={() => toggleMultiParam('benefit', b)}
                    />
                    {b}
                  </label>
                ))}
              </FilterSection>

              {/* SKIN TYPE */}
              <FilterSection title="Skin Type">
                {['Oily', 'Dry', 'Combination', 'Sensitive'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.skin_types.includes(s)}
                      onChange={() => toggleMultiParam('skin_type', s)}
                    />
                    {s}
                  </label>
                ))}
              </FilterSection>

              {/* FORMULATION */}
              <FilterSection title="Formulation">
                {['Gel', 'Cream', 'Serum', 'Lotion'].map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.formulations.includes(f)}
                      onChange={() => toggleMultiParam('formulation', f)}
                    />
                    {f}
                  </label>
                ))}
              </FilterSection>

              {/* SPF */}
              <FilterSection title="SPF">
                {[15, 30, 50].map(spf => (
                  <label key={spf} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="spf"
                      checked={filters.spf === String(spf)}
                      onChange={() => updateParam('spf', spf)}
                    />
                    SPF {spf}
                  </label>
                ))}
                {filters.spf && (
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="spf"
                      checked={filters.spf === ''}
                      onChange={() => updateParam('spf', '')}
                    />
                    All SPF
                  </label>
                )}
              </FilterSection>

            </div>

            {/* APPLY FILTERS BUTTON - MOBILE ONLY */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-[#4A0404] text-white py-3 rounded font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden md:block w-72 shrink-0 bg-white border overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* RATING */}
            <FilterSection title="Rating">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === 4 && filters.maxRating === 0}
                  onChange={() => setRatingRange(4, 0)}
                />
                4+ stars
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === 3 && filters.maxRating === 4}
                  onChange={() => setRatingRange(3, 4)}
                />
                3 - 4 stars
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === 2 && filters.maxRating === 3}
                  onChange={() => setRatingRange(2, 3)}
                />
                2 - 3 stars
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === 0 && filters.maxRating === 2}
                  onChange={() => setRatingRange(0, 2)}
                />
                Below 2 stars
              </label>
              {(filters.minRating > 0 || filters.maxRating > 0) && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === 0 && filters.maxRating === 0}
                    onChange={() => setRatingRange(0, 0)}
                  />
                  All ratings
                </label>
              )}
            </FilterSection>

            {/* PREFERENCE */}
            <FilterSection title="Preference">
              {['Vegan', 'Cruelty Free', 'Dermatologist Tested'].map(p => (
                <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.preferences.includes(p)}
                    onChange={() => toggleMultiParam('preference', p)}
                  />
                  {p}
                </label>
              ))}
            </FilterSection>

            {/* SUPER INGREDIENTS */}
            <FilterSection title="Super Ingredients">
              {['Vitamin C', 'Niacinamide', 'Retinol', 'Hyaluronic Acid'].map(i => (
                <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ingredients.includes(i)}
                    onChange={() => toggleMultiParam('ingredient', i)}
                  />
                  {i}
                </label>
              ))}
            </FilterSection>

            {/* BENEFITS */}
            <FilterSection title="Benefits">
              {['Brightening', 'Hydration', 'Anti Aging', 'Acne Control'].map(b => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.benefits.includes(b)}
                    onChange={() => toggleMultiParam('benefit', b)}
                  />
                  {b}
                </label>
              ))}
            </FilterSection>

            {/* SKIN TYPE */}
            <FilterSection title="Skin Type">
              {['Oily', 'Dry', 'Combination', 'Sensitive'].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.skin_types.includes(s)}
                    onChange={() => toggleMultiParam('skin_type', s)}
                  />
                  {s}
                </label>
              ))}
            </FilterSection>

            {/* FORMULATION */}
            <FilterSection title="Formulation">
              {['Gel', 'Cream', 'Serum', 'Lotion'].map(f => (
                <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.formulations.includes(f)}
                    onChange={() => toggleMultiParam('formulation', f)}
                  />
                  {f}
                </label>
              ))}
            </FilterSection>

            {/* SPF */}
            <FilterSection title="SPF">
              {[15, 30, 50].map(spf => (
                <label key={spf} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="spf"
                    checked={filters.spf === String(spf)}
                    onChange={() => updateParam('spf', spf)}
                  />
                  SPF {spf}
                </label>
              ))}
              {filters.spf && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="spf"
                    checked={filters.spf === ''}
                    onChange={() => updateParam('spf', '')}
                  />
                  All SPF
                </label>
              )}
            </FilterSection>

          </div>
        </aside>

        {/* PRODUCTS SECTION */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-gray-600">
            {products.length} products found
          </p>

          {loading ? (
            <p className="text-center py-20">Loading…</p>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-4
            ">
              {products.map((p, index) => (
                <ProductCard key={p._id || p.id || index} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}