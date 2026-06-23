// src/components/charts/revenue-chart.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardApi } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export function RevenueChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await dashboardApi.getRevenueChart(2024);
      setData(result.data || []);
    } catch (error) {
      console.error('Failed to load revenue chart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Legend />
        <Bar dataKey="revenue" fill="hsl(237 84% 65%)" radius={[4, 4, 0, 0]} name="Revenue" />
        <Bar dataKey="expenses" fill="hsl(0 84% 65%)" radius={[4, 4, 0, 0]} name="Expenses" />
        <Line type="monotone" dataKey="profit" stroke="hsl(160 84% 48%)" strokeWidth={2} name="Profit" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// src/components/charts/expense-chart.tsx
'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardApi } from '@/lib/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['hsl(237 84% 65%)', 'hsl(160 84% 48%)', 'hsl(38 92% 60%)', 'hsl(271 76% 73%)', 'hsl(0 84% 65%)'];

export function ExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await dashboardApi.getExpenseBreakdown();
      setData(
        result.categories?.map((cat: any) => ({
          name: cat.name,
          value: cat.value,
          percentage: cat.percentage,
        })) || []
      );
    } catch (error) {
      console.error('Failed to load expense breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs text-muted-foreground">
              {entry.name} {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// src/components/charts/top-customers-chart.tsx
'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api/dashboard';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function TopCustomersChart() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await dashboardApi.getTopCustomers();
      setCustomers(data.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load top customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const maxRevenue = Math.max(...customers.map((c) => c.totalRevenue));

  return (
    <div className="space-y-3">
      {customers.map((customer, index) => (
        <div key={customer.code} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{customer.name}</span>
            <span className="text-muted-foreground">{formatCurrency(customer.totalRevenue)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(customer.totalRevenue / maxRevenue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
