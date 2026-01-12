"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { settingsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeZone: "UTC",
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: "en",
    monthlyBudgetLimit: 0,
    twoFactorAuth: false,
  })

  const fetchSettings = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await settingsAPI.getSettings(userId)
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const userId = localStorage.getItem("userId")
      if (!userId) return

      await settingsAPI.updateSettings(userId, settings)
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetSettings = async () => {
    try {
      setSaving(true)
      const userId = localStorage.getItem("userId")
      if (!userId) return

      const defaultSettings = await settingsAPI.resetSettings(userId)
      setSettings(defaultSettings)
      toast({
        title: "Success",
        description: "Settings reset to defaults",
      })
    } catch (error) {
      console.error("Error resetting settings:", error)
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", !!settings.darkMode)
  }, [settings.darkMode])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Loading settings...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyBudgetLimit">Monthly Budget Limit</Label>
                <Input
                  id="monthlyBudgetLimit"
                  type="number"
                  value={settings.monthlyBudgetLimit}
                  onChange={(e) => setSettings({...settings, monthlyBudgetLimit: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, emailAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          <Button variant="outline" onClick={resetSettings} disabled={saving}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}