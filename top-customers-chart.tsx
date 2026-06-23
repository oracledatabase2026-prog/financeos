'use client';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api/dashboard';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
export function TopCustomersChart() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { dashboardApi.getTopCustomers().then((d) => setCustomers((d||[]).slice(0,5))).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="space-y-3">{[...Array(5)].map((_,i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;
  const max = Math.max(...customers.map((c) => c.totalRevenue), 1);
  return (
    <div className="space-y-3">
      {customers.map((c) => (
        <div key={c.code}>
          <div className="flex justify-between text-sm mb-1"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">{formatCurrency(c.totalRevenue)}</span></div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(c.totalRevenue/max)*100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
