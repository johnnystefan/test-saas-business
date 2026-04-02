interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-[#E5E7EB] font-semibold text-lg">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}
