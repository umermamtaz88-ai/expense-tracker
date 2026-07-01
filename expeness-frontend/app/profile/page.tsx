"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getSettings, saveSettings, type UserSettings } from "@/lib/settings";

export default function ProfilePage() {
  const [settings, setSettings] = useState<UserSettings>(getSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      saveSettings(settings);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile" description="Your account information">
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={settings.displayName} size="lg" />
            <div>
              <h2 className="text-lg font-semibold">{settings.displayName}</h2>
              <p className="text-sm text-muted-foreground">
                Expense Tracker User
              </p>
            </div>
          </div>
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
              label="Currency"
              placeholder="USD"
              value={settings.currency}
              onChange={(e) =>
                setSettings((s) => ({ ...s, currency: e.target.value }))
              }
              hint="Display currency code (e.g. USD, EUR, GBP)"
            />
            <Button type="submit" loading={saving}>
              Save Profile
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
