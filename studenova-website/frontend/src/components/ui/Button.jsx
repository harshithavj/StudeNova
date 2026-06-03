export default function Button({ as: Component = 'button', className = '', variant = 'primary', size = 'md', ...props }) {
  const variants = {
    primary: 'bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800',
    secondary: 'bg-white text-slate-950 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-50',
    accent: 'bg-nova-coral text-white shadow-coral hover:-translate-y-0.5 hover:bg-[#f04f5f]',
    subtle: 'bg-nova-peach text-nova-coral hover:-translate-y-0.5 hover:bg-nova-pink'
  };
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };
  return <Component className={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition duration-200 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
