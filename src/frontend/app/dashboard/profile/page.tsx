"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { userAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Save, Upload, X } from "lucide-react"

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
  })
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    const profileData = {
      name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      phone: localStorage.getItem("userPhone") || "",
      userType: localStorage.getItem("userType") || "",
    }
    setProfile(profileData)
    setEditedProfile({
      name: profileData.name,
      email: profileData.email,
    })
    setAvatar(localStorage.getItem("userAvatar") || "")
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile({
      name: profile.name,
      email: profile.email,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile({
      name: profile.name,
      email: profile.email,
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId")
      if (!userId) return

      await userAPI.updateProfile(userId, editedProfile)
      
      // Update local storage
      localStorage.setItem("userName", editedProfile.name)
      localStorage.setItem("userEmail", editedProfile.email)
      
      // Update state
      setProfile({
        ...profile,
        name: editedProfile.name,
        email: editedProfile.email,
      })
      
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatar(result)
      localStorage.setItem("userAvatar", result)
      toast({
        title: "Profile photo updated",
        description: "Saved locally for this device.",
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Your account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-muted-foreground">No photo</span>
                  )}
                </div>
                Personal Details
              </span>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Photo</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                  <p className="text-xs text-muted-foreground">Stored locally on this device.</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{profile.phone || "-"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Phone cannot be changed for security reasons</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="text-sm text-foreground capitalize">{profile.userType || "-"}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={loading} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={loading} size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm text-foreground">{profile.name || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{profile.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{profile.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="text-sm text-foreground capitalize">{profile.userType || "-"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
