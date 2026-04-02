import { clsx } from 'clsx';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export function InputField({
  label,
  error,
  className,
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label className="text-[#9CA3AF] text-sm font-medium">{label}</label>
      <input
        {...inputProps}
        className={clsx(
          'bg-[#111827] border text-[#E5E7EB] rounded-2xl px-4 py-3 outline-none transition-colors',
          'focus:border-[#22C55E]',
          error ? 'border-red-500' : 'border-[#9CA3AF]',
        )}
      />
      {error && <span className="text-red-400 text-xs mt-0.5">{error}</span>}
    </div>
  );
}
