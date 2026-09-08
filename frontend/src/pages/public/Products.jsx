import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Container } from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import Reveal from '../../components/Reveal';
import { productService } from '../../api/services/productService';
import { cn } from '../../api/utils';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Price Low to High', value: 'price_asc' },
  { label: 'Price High to Low', value: 'price_desc' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const updateQueryParams = (newSearch, newSort, newPage) => {
    const params = {};
    if (newSearch) params.search = newSearch;
    if (newSort && newSort !== 'featured') params.sort = newSort;
    if (newPage && newPage > 1) params.page = newPage.toString();
    setSearchParams(params);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    productService
      .getAll({ search, sort, page, per_page: 12 })
      .then((res) => {
        if (isMounted) {
          const body = res.data;
          setProducts(body.data || []);
          setMeta(
            body.meta || {
              current_page: body.current_page || 1,
              last_page: body.last_page || 1,
              total: body.total || (body.data ? body.data.length : 0),
            }
          );
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [search, sort, page]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    updateQueryParams(val, sort, 1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    updateQueryParams('', sort, 1);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    setPage(1);
    updateQueryParams(search, val, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.last_page) {
      setPage(newPage);
      updateQueryParams(search, sort, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= meta.last_page; i++) pageNumbers.push(i);

  return (
    <main className="bg-white min-h-screen py-14 md:py-20">
      <SEO
        title="Products"
        description="Browse our collection of premium skincare products. Find the perfect routine for your natural glow."
        slug="products"
      />
      <Container>
        <Reveal as="header" className="text-center max-w-xl mx-auto mb-12 space-y-3" direction="up">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muru-pink">{t('products.collection')}</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-muru-text-main">{t('products.title')}</h1>
          <p className="text-muru-text-secondary text-base sm:text-lg">{t('products.subtitle')}</p>
        </Reveal>

        {/* Search + Sort */}
        <Reveal as="section" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-muru-border/40" delay={100}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muru-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t('products.searchPlaceholder')}
              className="w-full h-11 pl-11 pr-10 bg-white border border-muru-border/70 rounded-full text-sm text-muru-text-main placeholder-muru-text-secondary/70 focus:outline-none focus:border-muru-pink transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-muru-text-secondary hover:text-muru-pink transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <select
              id="sort-select"
              value={sort}
              onChange={handleSortChange}
              className="appearance-none h-11 pl-4 pr-10 bg-white border border-muru-border/70 rounded-full text-sm font-medium text-muru-text-main cursor-pointer focus:outline-none focus:border-muru-pink transition-colors"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muru-text-secondary pointer-events-none" />
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muru-pink-soft/40 rounded-[1.25rem]" />
                <div className="mt-4 space-y-2">
                  <div className="h-3.5 bg-muru-pink-soft/60 rounded w-3/4" />
                  <div className="h-3 bg-muru-pink-soft/40 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <h3 className="text-xl font-semibold text-muru-text-main mb-1.5">{t('products.noProducts')}</h3>
            <p className="text-sm text-muru-text-secondary max-w-sm mb-6">
              {search ? `${t('products.searchNotFound')} "${search}".` : t('products.noProductsDescription')}
            </p>
            {search && (
              <button
                onClick={handleClearSearch}
                className="h-10 px-6 bg-muru-pink-soft hover:bg-muru-pink-blush text-muru-pink font-medium text-sm rounded-full transition-colors"
              >
                {t('products.clearSearch')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product, idx) => (
                <Reveal key={product.id} delay={(idx % 4) * 70} direction="up">
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>

            {meta.last_page > 1 && (
              <nav
                className="flex items-center justify-center gap-2 mt-14 pt-8 border-t border-muru-border/30"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  disabled={meta.current_page === 1}
                  onClick={() => handlePageChange(meta.current_page - 1)}
                  className="p-2 rounded-full text-muru-text-secondary hover:text-muru-pink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => handlePageChange(pNum)}
                    className={cn(
                      'w-8 h-8 text-sm rounded-full transition-colors flex items-center justify-center',
                      pNum === meta.current_page
                        ? 'bg-muru-pink text-white'
                        : 'text-muru-text-secondary hover:text-muru-pink'
                    )}
                    aria-current={pNum === meta.current_page ? 'page' : undefined}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={meta.current_page === meta.last_page}
                  onClick={() => handlePageChange(meta.current_page + 1)}
                  className="p-2 rounded-full text-muru-text-secondary hover:text-muru-pink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </Container>
    </main>
  );
};

export default Products;
