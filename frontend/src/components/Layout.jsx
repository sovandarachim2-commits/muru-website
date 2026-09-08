import { cn } from '../api/utils';

export const Container = ({ children, className, clean = false }) => {
  return (
    <div className={cn(
      "mx-auto w-full px-5 sm:px-8 lg:px-12",
      !clean && "max-w-[1440px]",
      className
    )}>
      {children}
    </div>
  );
};

export const SectionTitle = ({ title, subtitle, centered = false, className }) => {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-semibold text-muru-text-main mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muru-text-secondary text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1 w-20 bg-muru-pink mt-6",
        centered && "mx-auto"
      )} />
    </div>
  );
};
