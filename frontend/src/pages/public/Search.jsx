import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { Container } from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import Reveal from '../../components/Reveal';
import SEO from '../../components/SEO';
import { productService } from '../../api/services/productService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    const timer = window.setTimeout(() => {
      const params = {};
      if (trimmed) params.q = trimmed;
      setSearchParams(params, { replace: true });

      if (!trimmed) {
        setProducts([]);
        return;
      }

      setLoading(true);
      productService
        .getAll({ search: trimmed, per_page: 12 })
        .then((response) => {
          setProducts(response.data?.data || []);
        })
        .catch((error) => {
          console.error('Failed to search products', error);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }, 260);

    return () => window.clearTimeout(timer);
  }, [query, setSearchParams]);

  const clearSearch = () => {
    setQuery('');
    setProducts([]);
  };

  return (
    <main className="bg-white min-h-screen py-14 md:py-20">
      <SEO
        title="Search"
        description="Search MURU skincare products."
        slug="search"
      />
      <Container>
        <Reveal as="header" className="max-w-2xl mx-auto text-center mb-10 space-y-3" direction="up">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">Search</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-muru-text-main">Find Your Product</h1>
          <p className="text-muru-text-secondary text-base sm:text-lg">Search by product name, benefit, or description.</p>
        </Reveal>

        <Reveal className="max-w-2xl mx-auto mb-12" delay={100}>
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muru-text-secondary" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full h-14 pl-14 pr-14 rounded-full border border-muru-border bg-white text-base text-muru-text-main placeholder-muru-text-secondary/70 outline-none transition-colors focus:border-muru-pink"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muru-text-secondary transition-colors hover:text-muru-pink"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-square bg-muru-pink-soft/40 rounded-[1.25rem]" />
                <div className="mt-4 h-4 bg-muru-pink-soft/50 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : query.trim() && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 70} direction="up">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : query.trim() ? (
          <Reveal className="text-center py-16" direction="up">
            <h2 className="text-xl font-semibold text-muru-text-main mb-2">No products found</h2>
            <p className="text-sm text-muru-text-secondary mb-6">Try a different product name or skincare keyword.</p>
            <Link
              to="/products"
              className="inline-flex h-11 items-center justify-center rounded-full bg-muru-pink px-7 text-sm font-medium text-white transition-colors hover:bg-muru-pink-dark"
            >
              View All Products
            </Link>
          </Reveal>
        ) : null}
      </Container>
    </main>
  );
};

export default Search;
