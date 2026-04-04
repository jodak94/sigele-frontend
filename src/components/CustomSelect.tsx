import { useState, useRef, useEffect } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function CustomSelect({
    options,
    value,
    onChange,
    placeholder = '— Seleccione —',
    disabled = false,
    className = '',
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (opt: SelectOption) => {
        onChange(opt.value);
        setOpen(false);
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => !disabled && setOpen((v) => !v)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-left transition-all outline-none
                    ${open ? 'border-primary' : 'border-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}`}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
                    {selected ? selected.label : placeholder}
                </span>
                <CaretDown
                    size={16}
                    weight="bold"
                    className={`transition-transform duration-200 shrink-0 ml-2 ${open ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <ul className="max-h-56 overflow-auto py-1">
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-left transition-colors hover:bg-gray-50"
                                        style={isSelected ? { background: 'rgba(var(--primary-rgb), 0.07)', color: 'var(--primary-dark)' } : { color: '#374151' }}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <Check size={14} weight="bold" className="text-primary shrink-0" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
