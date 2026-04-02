import { clsx } from 'clsx';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  isLoading?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className,
  isLoading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'bg-[#22C55E] text-black font-semibold rounded-2xl px-6 py-3 transition-opacity',
        isDisabled && 'opacity-50 cursor-not-allowed',
        !isDisabled && 'hover:opacity-90',
        className,
      )}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
