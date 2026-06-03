import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Back', className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-nova-muted ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:text-nova-coral ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
