'use client';

import { useEffect, useState } from 'react';
import { Building2, Shield, CreditCard, Bell, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { settingsApi } from '@/lib/api/settings';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/auth-store';

const ROLES = [
  { name: 'Super Admin', users: 2, access: 'Full Access', desc: 'Complete system access including user management' },
  { name: 'CFO / Finance Manager', users: 3, access: 'Finance + Reports', desc: 'Financial data, reports, approvals' },
  { name: 'Accountant', users: 8, access: 'Entries + View', desc: 'Create entries, view all financial data' },
  { name: 'HR Manager', users: 4, access: 'HR Only', desc: 'Employee management and payroll' },
  { name: 'Viewer', users: 12, access: 'Read Only', desc: 'View dashboards and reports only' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    overdueInvoices: true, lowStock: true, payrollDue: true, loginAlerts: false,
  });

  useEffect(() => {
    settingsApi.getCompany()
      .then(setCompany)
      .catch(() => setCompany({ name: 'FinanceOS Holdings', vatNumber: 'EG-VAT-2024-00842', address: '25 Hassan Allam St', city: 'Cairo', country: 'Egypt', currency: 'USD', timezone: 'Africa/Cairo', fiscalYearStart: 1 }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.updateCompany(company);
      toast({ title: 'Settings saved', description: 'Company information updated successfully' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCompany((c: any) => ({ ...c, [k]: e.target.value }));

  return (
    <MainLayout title="Settings" description="Company profile, security, permissions & billing">
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="company"><Building2 className="mr-2 h-4 w-4" />Company</TabsTrigger>
          <TabsTrigger value="permissions"><Shield className="mr-2 h-4 w-4" />Permissions</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Alerts</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4" />Billing</TabsTrigger>
        </TabsList>

        {/* Company */}
        <TabsContent value="company">
          <Card>
            <CardHeader><CardTitle>Company Information</CardTitle><CardDescription>Update your company profile and financial settings</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="space-y-1.5"><div className="h-4 w-24 rounded bg-muted animate-pulse" /><div className="h-10 rounded bg-muted animate-pulse" /></div>)}</div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5"><Label>Company Name</Label><Input value={company?.name || ''} onChange={set('name')} /></div>
                    <div className="space-y-1.5"><Label>Legal Name</Label><Input value={company?.legalName || ''} onChange={set('legalName')} /></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5"><Label>Tax ID</Label><Input value={company?.taxId || ''} onChange={set('taxId')} /></div>
                    <div className="space-y-1.5"><Label>VAT Number</Label><Input value={company?.vatNumber || ''} onChange={set('vatNumber')} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Address</Label><Input value={company?.address || ''} onChange={set('address')} /></div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5"><Label>City</Label><Input value={company?.city || ''} onChange={set('city')} /></div>
                    <div className="space-y-1.5"><Label>Country</Label><Input value={company?.country || ''} onChange={set('country')} /></div>
                    <div className="space-y-1.5"><Label>Timezone</Label><Input value={company?.timezone || ''} disabled className="bg-muted" /></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5"><Label>Base Currency</Label><Input value={company?.currency || 'USD'} disabled className="bg-muted" /></div>
                    <div className="space-y-1.5"><Label>Fiscal Year Start (Month)</Label><Input type="number" min={1} max={12} value={company?.fiscalYearStart || 1} onChange={set('fiscalYearStart')} /></div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>User Roles & Permissions</CardTitle><CardDescription>Manage access levels for your team members</CardDescription></div>
                <Button size="sm"><Shield className="mr-2 h-4 w-4" />Add Role</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ROLES.map((role, i) => (
                  <div key={role.name} className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{role.name}</span>
                        <Badge variant={i === 0 ? 'default' : i < 3 ? 'secondary' : 'outline'}>{role.access}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{role.desc}</p>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-sm font-semibold">{role.users}</div>
                      <div className="text-xs text-muted-foreground">users</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle>Current User</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Badge>{user?.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Alert Preferences</CardTitle><CardDescription>Configure which events trigger notifications</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'overdueInvoices', label: 'Overdue Invoice Alerts', desc: 'Get notified when invoices become overdue' },
                { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Alert when inventory falls below reorder point' },
                { key: 'payrollDue', label: 'Payroll Due Reminders', desc: 'Reminder before payroll processing deadline' },
                { key: 'loginAlerts', label: 'New Login Alerts', desc: 'Notify on login from new devices or locations' },
              ].map((n, i) => (
                <div key={n.key}>
                  {i > 0 && <Separator className="mb-6" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{n.label}</p>
                      <p className="text-sm text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[n.key as keyof typeof notifications]}
                      onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast({ title: 'Preferences saved' })}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <Card>
            <CardHeader><CardTitle>Subscription Plan</CardTitle><CardDescription>Manage your FinanceOS subscription</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-violet-500/5 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black">Enterprise Plan</h3>
                      <Badge>Active</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">Unlimited users, all modules, priority support</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">$299<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-sm text-muted-foreground">Next billing: Jan 1, 2025</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                  {['Unlimited Users', 'All 9 Modules', 'API Access', 'Priority Support'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-green-500">✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="w-full">Change Plan</Button>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-16 items-center justify-center rounded-lg border bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-xs">VISA</div>
                  <div>
                    <p className="font-semibold">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </MainLayout>
  );
}
