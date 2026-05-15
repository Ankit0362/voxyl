export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-lg py-sm rounded-full font-bold shadow-lg transition-transform active:scale-95 text-center flex justify-center items-center gap-xs";

  const variants = {
    primary: "brand-gradient text-on-primary",
    secondary: "glass border border-outline-variant hover:bg-surface-variant text-on-surface",
    danger: "bg-error-container text-on-error-container hover:bg-error/80",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
