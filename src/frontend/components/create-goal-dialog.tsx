"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    category: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { goalsAPI } = await import("@/lib/api")
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId in storage")
      await goalsAPI.createGoal({
        name: formData.name,
        target: Number(formData.target || 0),
        current: Number(formData.current || 0),
        deadline: formData.deadline,
        category: formData.category,
        color: "bg-primary",
        userId,
      })
      onOpenChange(false)
      // Let parent refresh list
    } catch (err) {
      console.error("Error creating goal", err)
    } finally {
      setFormData({
        name: "",
        target: "",
        current: "",
        deadline: "",
        category: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Financial Goal</DialogTitle>
          <DialogDescription>Set a new financial goal to track your progress</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current Amount</Label>
              <Input
                id="current"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
