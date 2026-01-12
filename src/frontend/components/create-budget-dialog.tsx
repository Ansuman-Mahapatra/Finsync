"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateBudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBudgetDialog({ open, onOpenChange }: CreateBudgetDialogProps) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { budgetsAPI } = await import("@/lib/api")
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId in storage")
      await budgetsAPI.createBudget({
        category: formData.category,
        budgeted: Number(formData.amount || 0),
        spent: 0,
        color: "bg-primary",
        userId,
      })
      onOpenChange(false)
    } catch (err) {
      console.error("Error creating budget", err)
    } finally {
      setFormData({
        category: "",
        amount: "",
        period: "monthly",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>Set a spending limit for a category</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Budget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
