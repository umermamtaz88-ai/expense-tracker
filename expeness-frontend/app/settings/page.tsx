"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSettings, saveSettings, type UserSettings } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(getSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      saveSettings(settings);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your preferences"
    >
      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <Input
              label="Display Name"
              placeholder="Your name"
              value={settings.displayName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, displayName: e.target.value }))
              }
            />
            <Input
              label="Monthly Budget"
              type="number"
              min="0"
              step="100"
              placeholder="3000"
              value={settings.monthlyBudget}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  monthlyBudget: parseFloat(e.target.value) || 0,
                }))
              }
              hint="Used to calculate remaining budget on the dashboard"
            />
            <Input
              label="Currency"
              placeholder="USD"
              value={settings.currency}
              onChange={(e) =>
                setSettings((s) => ({ ...s, currency: e.target.value }))
              }
              hint="Display currency code (e.g. USD, EUR, GBP)"
            />
            <div className="pt-2">
              <Button type="submit" loading={saving}>
                Save Settings
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 mt-6">
          <h3 className="text-sm font-semibold mb-2">About</h3>
          <p className="text-sm text-muted-foreground">
            ExpenseFlow connects to your local Expense Tracker API. Settings
            are stored locally in your browser. Budget tracking is computed
            client-side since no backend settings endpoint exists.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
