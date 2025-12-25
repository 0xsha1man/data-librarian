import StatCard from "@/components/dashboard/StatCard";

export default function Dashboard() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Size"
                    value="4.2 TB"
                    subtext="14,203 files indexed"
                    icon="fa-solid fa-database"
                />
                <StatCard
                    label="Weeding"
                    value="0"
                    subtext="Files flagged"
                    icon="fa-solid fa-trash-can"
                    accentColor="text-error"
                />
                <StatCard
                    label="Efficiency"
                    value="94%"
                    subtext="Space saved (Est.)"
                    icon="fa-solid fa-bolt"
                    accentColor="text-warning"
                />
                <StatCard
                    label="Processing"
                    value="IDLE"
                    subtext="System ready"
                    icon="fa-solid fa-microchip"
                    accentColor="text-info"
                />
            </div>

            <div className="border border-[var(--border-dim)] bg-[var(--bg-card)] p-4 rounded-sm">
                <h3 className="font-mono text-lg text-secondary mb-4 border-b border-[var(--border-dim)] pb-2 flex items-center">
                    <i className="fa-solid fa-chart-line mr-2 text-[var(--accent-primary)]"></i>
                    SYSTEM_ACTIVITY
                </h3>
                <div className="h-64 flex items-center justify-center text-[var(--text-muted)] font-mono text-sm">
                    [ACTIVITY_GRAPH_PLACEHOLDER]
                </div>
            </div>
        </div>
    );
}
