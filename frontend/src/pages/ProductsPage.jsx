import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const categories = ['Dumbbells','Barbells','Weight Plates','Kettlebells','Benches','Treadmills','Exercise Bikes','Resistance Bands','Home Gym Systems','Accessories'];

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.keyword = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    api.get('/products', { params })
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const ProductCard = ({ product }) => (
    <Link to={`/products/${product._id}`} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col group hover:border-border-light hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-44 sm:h-48 bg-dark-800 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div className={`w-full h-full flex flex-col items-center justify-center text-dark-500 ${product.images?.[0] ? 'hidden' : 'flex'}`}>
          <svg className="w-10 h-10 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[11px]">No Image</span>
        </div>
        <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/90 text-white backdrop-blur-sm">{product.condition}</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors line-clamp-1">{product.title}</h3>
        <p className="text-[12px] text-dark-400 mt-1 line-clamp-2 flex-1 leading-relaxed">{product.description}</p>
        <div className="mt-3 pt-3 border-t border-border flex items-end justify-between">
          <p className="text-accent font-bold text-[15px]">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-dark-500">{product.category}</p>
        </div>
      </div>
    </Link>
  );

  const SkeletonCard = () => (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="h-48 animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-700 rounded w-3/4 animate-shimmer" />
        <div className="h-3 bg-dark-700 rounded w-full animate-shimmer" />
        <div className="h-3 bg-dark-700 rounded w-1/2 animate-shimmer" />
      </div>
    </div>
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>PRODUCTS</h1>
        <p className="text-dark-400 text-sm mt-1">Find the perfect equipment for your home gym</p>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-dark-800 border border-border rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all" />
            </div>
            <div className="flex gap-3">
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-dark-800 border border-border rounded-lg px-3.5 py-2.5 text-sm text-dark-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all sm:w-44">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-dark-800 border border-border rounded-lg px-3.5 py-2.5 text-sm text-dark-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all sm:w-44">
                <option value="">Sort by</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {!loading && products.length > 0 && (
        <p className="text-dark-400 text-xs mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-dark-400 text-sm">No products found.</p>
          {(search || category) && (
            <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-3 text-accent text-sm font-medium hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
