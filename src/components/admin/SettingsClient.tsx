'use client';

import { useTransition } from 'react';
import { SiteSettings } from '@/lib/settings';
import { updateSettings } from '@/app/admin/settings/actions';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function SettingsClient({ initialSettings }: { initialSettings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await updateSettings(formData);
        toast.success("Settings saved successfully.");
      } catch {
        toast.error("Failed to save settings.");
      }
    });
  };

  return (
    <Card className="rounded-[20px] shadow-sm border-[var(--border-subtle)]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-display">Profile Information</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Your Name</Label>
              <Input 
                id="ownerName" 
                name="ownerName" 
                defaultValue={initialSettings.ownerName} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                name="contactEmail" 
                type="email"
                defaultValue={initialSettings.contactEmail} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea 
              id="tagline" 
              name="tagline" 
              defaultValue={initialSettings.tagline} 
              rows={2}
              required 
            />
            <p className="text-xs text-[var(--text-secondary)]">
              This appears on the main landing page below your name.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)]">
            <div className="space-y-0.5">
              <Label htmlFor="availableForWork" className="text-base font-semibold">
                Available for work
              </Label>
              <p className="text-sm text-[var(--text-secondary)]">
                Shows a blinking indicator on the landing page footer.
              </p>
            </div>
            <Switch 
              id="availableForWork" 
              name="availableForWork" 
              defaultChecked={initialSettings.availableForWork} 
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="font-display font-semibold text-[var(--text-primary)]">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input 
                  id="instagramUrl" 
                  name="instagramUrl" 
                  type="url"
                  placeholder="https://instagram.com/..."
                  defaultValue={initialSettings.instagramUrl} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                <Input 
                  id="linkedInUrl" 
                  name="linkedInUrl" 
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  defaultValue={initialSettings.linkedInUrl} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input 
                  id="twitterUrl" 
                  name="twitterUrl" 
                  type="url"
                  placeholder="https://twitter.com/..."
                  defaultValue={initialSettings.twitterUrl} 
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-[var(--border-subtle)] bg-[#FAFAF8] rounded-b-[20px] py-4 flex justify-end">
          <Button 
            type="submit" 
            variant="primary"
            size="md"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
