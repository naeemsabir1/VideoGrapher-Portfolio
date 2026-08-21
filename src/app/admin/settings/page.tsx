import { getSettings } from '@/lib/settings';
import { SettingsClient } from '@/components/admin/SettingsClient';

export default function SettingsPage() {
  const settings = getSettings();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Manage your portfolio&apos;s public profile and contact information.
        </p>
      </div>
      
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
