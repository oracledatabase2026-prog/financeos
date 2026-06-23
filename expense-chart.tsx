'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dashboardApi } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
const COLORS = ['#378ADD','#639922','#BA7517','#7F77DD','#E24B4A'];
export function ExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { dashboardApi.getExpenseBreakdown().then((r) => setData(r.categories || [])).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <Skeleton className="h-[200px] w-full" />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v: any) => `$${(v/1000).toFixed(0)}K`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
