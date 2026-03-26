import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface OverflowMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface OverflowMenuProps {
  items: OverflowMenuItem[];
}

export function OverflowMenu({ items }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2.5 rounded-xl bg-surface hover:bg-surface-2 text-label-secondary
                   hover:text-label transition-all"
        title="Menu"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface-2 rounded-2xl shadow-xl
                        border border-separator z-50 overflow-hidden py-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { setOpen(false); item.onClick(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                          transition-colors text-left
                          ${item.danger
                            ? 'text-red-400 hover:bg-surface-3'
                            : 'text-label hover:bg-surface-3'
                          }`}
            >
              {item.icon && <span className="shrink-0 text-label-secondary">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
