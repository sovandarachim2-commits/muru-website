import { useId } from 'react';
import { cn } from '../api/utils';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-muru-pink text-white hover:bg-muru-pink-dark',
    secondary: 'bg-muru-pink-soft text-muru-pink hover:bg-muru-pink-blush border border-muru-pink/10',
    outline: 'bg-transparent border-2 border-muru-pink text-muru-pink hover:bg-muru-pink hover:text-white',
    ghost: 'bg-transparent text-muru-text-secondary hover:text-muru-pink hover:bg-muru-pink-soft',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        loading && 'animate-pulse',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export const FormField = ({ label, error, className, type, as, options, children, ...props }) => {
  const id = useId();
  const inputId = props.name ? `${props.name}-${id}` : id;
  const fieldType = as || type;

  const baseInputClasses = cn(
    "w-full px-4 py-2.5 bg-white border border-muru-border rounded-xl focus:ring-2 focus:ring-muru-pink/20 focus:border-muru-pink outline-none transition-all",
    error && "border-red-500 focus:ring-red-200"
  );

  let input;
  if (fieldType === 'textarea') {
    const { rows = 4 } = props;
    const { rows: _, ...inputProps } = props;
    input = (
      <textarea
        id={inputId}
        className={cn(baseInputClasses, "resize-y min-h-[80px]")}
        rows={rows}
        {...inputProps}
      />
    );
  } else if (fieldType === 'select') {
    input = (
      <select
        id={inputId}
        className={cn(baseInputClasses, "bg-white")}
        {...props}
      >
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
        {children}
      </select>
    );
  } else {
    input = (
      <input
        id={inputId}
        className={baseInputClasses}
        type={type || 'text'}
        {...props}
      />
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-muru-text-main">
          {label}
        </label>
      )}
      {input}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const SectionWrapper = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden mb-8">
    <div className="bg-slate-50/50 px-6 py-4 lg:px-8 border-b border-muru-border flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-muru-pink" />}
      <h3 className="font-bold text-muru-text-main uppercase tracking-widest text-sm">{title}</h3>
    </div>
    <div className="p-6 lg:p-10 space-y-6">
      {children}
    </div>
  </div>
);

export const SkeletonCard = ({ className }) => (
  <div className={cn("bg-white rounded-2xl border border-muru-border shadow-sm p-6 animate-pulse", className)}>
    <div className="space-y-4">
      <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
      <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-muru-border shadow-sm overflow-hidden animate-pulse">
    <div className="bg-slate-50 px-6 py-4 border-b border-muru-border">
      <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
    </div>
    <div className="divide-y divide-muru-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4">
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonForm = ({ fields = 6 }) => (
  <div className="bg-white rounded-2xl border border-muru-border shadow-sm p-6 lg:p-10 animate-pulse">
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);
