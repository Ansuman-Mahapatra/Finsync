"use client"

import { useEffect, useState } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, Phone, MapPin, Globe, Save, Edit } from "lucide-react"

export default function BusinessProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    description: "",
    taxId: "",
    industry: "",
  })

  useEffect(() => {
    // Load profile data
    const userName = localStorage.getItem("userName") || "Business Name"
    const userEmail = localStorage.getItem("userEmail") || ""
    
    setProfile({
      businessName: userName,
      email: userEmail,
      phone: "+1 (555) 123-4567",
      address: "123 Business Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      website: "www.yourbusiness.com",
      description: "Your business description goes here. Tell customers what makes your business unique.",
      taxId: "XX-XXXXXXX",
      industry: "Retail",
    })
  }, [])

  const handleSave = () => {
    // Save profile logic here
    console.log("Saving profile:", profile)
    setIsEditing(false)
    // In a real app, you'd call an API endpoint here
  }

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your business information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Business Information
            </CardTitle>
            <CardDescription>Basic details about your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={profile.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Retail, Services, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Describe what your business does..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                value={profile.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                disabled={!isEditing}
                placeholder="XX-XXXXXXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
                disabled={!isEditing}
                placeholder="www.yourbusiness.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </CardTitle>
            <CardDescription>Your business location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={profile.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MerchantLayout>
  )
}
