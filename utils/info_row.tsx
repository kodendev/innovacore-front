export const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`${className} font-semibold text-lg`}>{value}</span>
  </div>
);
