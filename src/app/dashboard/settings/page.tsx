"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Moon, Bell } from "lucide-react"

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      desktop: false,
    },
    sound: true,
  })

  const handleSave = async () => {
    // TODO: Implement API call
    console.log("Save settings:", settings)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">General Settings</h1>
          <p className="text-gray-400">Manage your basic preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Moon className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Theme</Label>
                <p className="text-sm text-gray-400">
                  Use dark theme across the application
                </p>
              </div>
              <Switch
                checked={settings.theme === "dark"}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, theme: checked ? "dark" : "light" })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-none">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-gray-400">
                  Show notifications on your desktop
                </p>
              </div>
              <Switch
                checked={settings.notifications.desktop}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, desktop: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notification Sounds</Label>
                <p className="text-sm text-gray-400">
                  Play sounds for notifications
                </p>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, sound: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
} 