"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { accountsAPI } from "@/lib/api"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [accounts, setAccounts] = useState<any[]>([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [formData, setFormData] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    account: "",
  })

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) return
        const data = await accountsAPI.getAccounts(userId)
        setAccounts(data || [])
        // Preselect first account if available
        if ((data || []).length > 0) {
          setFormData((prev) => ({ ...prev, account: prev.account || data[0].id || data[0].name }))
        }
      } catch (err) {
        console.error("Error loading accounts for transaction", err)
      } finally {
        setAccountsLoading(false)
      }
    }

    if (open) {
      loadAccounts()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { transactionAPI } = await import("@/lib/api")
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId in storage")
      await transactionAPI.createTransaction({
        type: (formData.type || "expense").toUpperCase(),
        amount: Number(formData.amount || 0),
        description: formData.description,
        userId,
        categoryId: "",
        categoryName: formData.category,
        accountId: formData.account,
      })
      onOpenChange(false)
      // quick refresh
      window.location.reload()
    } catch (err) {
      console.error("Error creating transaction", err)
    } finally {
      setFormData({
        type: "expense",
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        account: "",
      })
    }
  }

  const accountSelectDisabled = accountsLoading || accounts.length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Enter the details of your transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="font-normal cursor-pointer">
                    Income
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="font-normal cursor-pointer">
                    Expense
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                {formData.type === "income" ? (
                  <>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Other Income">Other Income</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.account}
              onValueChange={(value) => setFormData({ ...formData, account: value })}
              disabled={accountSelectDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={accountsLoading ? "Loading accounts..." : "Select account"} />
              </SelectTrigger>
              <SelectContent>
                {accounts.length === 0 ? (
                  <SelectItem disabled value="no-accounts">
                    No accounts found. Please create one first.
                  </SelectItem>
                ) : (
                  accounts.map((account) => (
                    <SelectItem key={account.id || account.name} value={account.id || account.name}>
                      {account.name || "Unnamed Account"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {accounts.length === 0 && !accountsLoading && (
              <p className="text-xs text-muted-foreground">Create an account to record income or expenses.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!formData.account || accountSelectDisabled}>
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
