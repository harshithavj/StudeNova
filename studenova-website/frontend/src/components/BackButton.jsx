import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Back', className = '', fallback = '/', onBack }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }

    const fallbackTo = location.state?.from || fallback;
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-nova-muted ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-nova-coral ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
