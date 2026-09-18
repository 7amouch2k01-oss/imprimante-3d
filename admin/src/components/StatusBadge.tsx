const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'En attente',
    className: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  },
  IN_PRODUCTION: {
    label: 'En production',
    className: 'bg-[#116B36]/10 text-[#116B36] border border-[#116B36]/20',
  },
  COMPLETED: {
    label: 'Terminé',
    className: 'bg-zinc-800 text-white border border-zinc-700',
  },
  CANCELLED: {
    label: 'Annulé',
    className: 'bg-red-50 text-red-600 border border-red-200',
  },
  SHIPPED: {
    label: 'Expédié',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  DELIVERED: {
    label: 'Livré',
    className: 'bg-zinc-100 text-zinc-700 border border-zinc-300',
  },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-zinc-100 text-zinc-500 border border-zinc-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
