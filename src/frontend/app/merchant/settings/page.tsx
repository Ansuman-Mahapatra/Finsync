"use client"

import { useState } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  Shield, 
  Mail,
  Smartphone,
  Save,
  AlertTriangle
} from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Business
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
    fiscalYearStart: "January",
    
    // Payment
    autoPayoutEnabled: true,
    payoutSchedule: "weekly",
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // In a real app, call API endpoint here
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your business preferences and configurations</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggle("smsNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new transactions</p>
                </div>
              </div>
              <Switch
                id="transactionAlerts"
                checked={settings.transactionAlerts}
                onCheckedChange={() => handleToggle("transactionAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly business summary</p>
              </div>
              <Switch
                id="weeklyReports"
                checked={settings.weeklyReports}
                onCheckedChange={() => handleToggle("weeklyReports")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle("marketingEmails")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Protect your account and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle("twoFactorAuth")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loginAlerts">Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
              </div>
              <Switch
                id="loginAlerts"
                checked={settings.loginAlerts}
                onCheckedChange={() => handleToggle("loginAlerts")}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Business Preferences
            </CardTitle>
            <CardDescription>Customize your business settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                <Select value={settings.fiscalYearStart} onValueChange={(value) => handleChange("fiscalYearStart", value)}>
                  <SelectTrigger id="fiscalYearStart">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Manage payment and payout preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoPayoutEnabled">Automatic Payouts</Label>
                <p className="text-sm text-muted-foreground">Enable automatic fund transfers</p>
              </div>
              <Switch
                id="autoPayoutEnabled"
                checked={settings.autoPayoutEnabled}
                onCheckedChange={() => handleToggle("autoPayoutEnabled")}
              />
            </div>

            {settings.autoPayoutEnabled && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                <Select value={settings.payoutSchedule} onValueChange={(value) => handleChange("payoutSchedule", value)}>
                  <SelectTrigger id="payoutSchedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Deactivate Account
            </Button>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  )
}
