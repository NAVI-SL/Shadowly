"use client";

import { useAppStore } from "@/store/useAppStore";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-playfair text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden">
        
        {/* Practice Target */}
        <div className="p-6 border-b border-border">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Daily Practice Target</h2>
            <p className="text-sm text-muted-foreground">Set a goal for how many minutes you want to practice each day.</p>
          </div>
          <div className="flex items-center gap-4">
            <Slider 
              value={[settings.dailyTargetMinutes]} 
              min={5} 
              max={60} 
              step={5}
              onValueChange={(val: number[]) => updateSettings({ dailyTargetMinutes: val[0] })}
              className="flex-1"
            />
            <span className="w-16 text-right font-medium text-primary">{settings.dailyTargetMinutes} min</span>
          </div>
        </div>

        {/* Playback Settings */}
        <div className="p-6 border-b border-border">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Playback & Transcript</h2>
            <p className="text-sm text-muted-foreground">Adjust how videos and text are displayed during practice.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-scroll" className="text-base">Auto-scroll transcript</Label>
              <Switch 
                id="auto-scroll" 
                checked={settings.autoScroll} 
                onCheckedChange={(val: boolean) => updateSettings({ autoScroll: val })}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize the look and feel of Shadowly.</p>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-base">Dark Mode (Coming soon)</Label>
            <Switch 
              id="dark-mode" 
              checked={settings.darkMode} 
              disabled
              onCheckedChange={(val: boolean) => updateSettings({ darkMode: val })}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
