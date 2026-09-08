import { Link } from 'react-router-dom';
import { cn } from '../api/utils';

const ProductCard = ({ product, className, showDescription = false }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn('group block', className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-muru-pink-soft/45 transition-shadow duration-300 group-hover:shadow-soft">
        <img
          src={product.image || '/images/muru_hero_campaign_1788771956720.jpg'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-[15px] font-bold leading-snug text-muru-text-main transition-colors group-hover:text-muru-pink">
          {product.name}
        </h3>
        {showDescription && product.short_description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muru-text-secondary">
            {product.short_description}
          </p>
        )}
        {product.show_price && product.formatted_price && (
          <p className="pt-1 text-[15px] font-bold text-muru-pink">{product.formatted_price}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
