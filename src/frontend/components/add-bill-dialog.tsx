"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface AddBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBillDialog({ open, onOpenChange }: AddBillDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    recurring: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { billsAPI } = await import("@/lib/api")
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId in storage")
      await billsAPI.createBill({
        name: formData.name,
        amount: Number(formData.amount || 0),
        dueDate: formData.dueDate,
        category: formData.category,
        status: "upcoming",
        recurring: !!formData.recurring,
        recurringPeriod: "monthly",
        userId,
      })
      onOpenChange(false)
      window.location.reload()
    } catch (err) {
      console.error("Error creating bill", err)
    } finally {
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        category: "",
        recurring: true,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
          <DialogDescription>Add a new bill or payment reminder</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bill Name</Label>
            <Input
              id="name"
              placeholder="e.g., Electric Bill"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked as boolean })}
            />
            <Label htmlFor="recurring" className="text-sm font-normal cursor-pointer">
              This is a recurring bill
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Bill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
