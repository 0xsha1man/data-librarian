
interface StatCardProps {
    label: string;
    value: string;
    subtext: string;
    icon: string;
    accentColor?: string; // Tailwind class like 'text-blue-500'
}

export default function StatCard({
    label,
    value,
    subtext,
    icon,
    accentColor = "text-[var(--accent-primary)]",
}: StatCardProps) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-dim)] p-5 relative overflow-hidden group hover:border-[var(--accent-primary)] transition-colors duration-200">
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-primary)]"></div>

            <div className="flex justify-between items-start mb-4 pl-2">
                <span className="font-mono text-xs text-secondary uppercase tracking-widest">
                    {label}
                </span>
                <i className={`${icon} ${accentColor} text-lg`}></i>
            </div>

            <div className="text-3xl font-mono text-white pl-2 break-all">{value}</div>
            <div className="mt-2 text-xs text-gray-300 font-mono pl-2">
                {subtext}
            </div>
        </div>
    );
}
