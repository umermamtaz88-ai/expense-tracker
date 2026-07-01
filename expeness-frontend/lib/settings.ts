export interface UserSettings {
  monthlyBudget: number;
  currency: string;
  displayName: string;
}

const STORAGE_KEY = "expenseflow_settings";

const DEFAULT_SETTINGS: UserSettings = {
  monthlyBudget: 3000,
  currency: "USD",
  displayName: "User",
};

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
