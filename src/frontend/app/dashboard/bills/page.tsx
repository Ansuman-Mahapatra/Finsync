"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { AddBillDialog } from "@/components/add-bill-dialog"
import { billsAPI } from "@/lib/api"

export default function BillsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bills, setBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) return
      const data = await billsAPI.getBills(userId)
      setBills(data)
    } catch (error) {
      console.error("Error fetching bills:", error)
    } finally {
      setLoading(false)
    }
  }

  const markPaid = async (id: string) => {
    try {
      await billsAPI.markBillAsPaid(id)
      await fetchBills()
    } catch (e) {
      console.error("Error marking bill as paid", e)
    }
  }

  const upcomingBills = bills.filter((b) => b.status === "upcoming")
  const overdueBills = bills.filter((b) => b.status === "overdue")
  const totalUpcoming = upcomingBills.reduce((sum, b) => sum + b.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bills & Reminders</h1>
            <p className="text-muted-foreground mt-1">Track and manage your recurring bills</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bills</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "..." : upcomingBills.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Due this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Due</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${loading ? "..." : totalUpcoming.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Upcoming payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
              <AlertCircle className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{loading ? "..." : overdueBills.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overdueBills.length === 0 ? "All up to date" : "Needs attention"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Bills Alert */}
        {!loading && overdueBills.length > 0 && (
          <Card className="border-chart-3">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-chart-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Overdue Bills</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {overdueBills.length} overdue {overdueBills.length === 1 ? "bill" : "bills"}. Please pay
                    them as soon as possible to avoid late fees.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bills List */}
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading bills...</div>
            ) : bills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No bills yet</p>
                <p className="text-xs mt-1">Add your first bill to start tracking</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill) => {
                  const daysUntilDue = Math.ceil(
                    (new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            bill.status === "paid"
                              ? "bg-secondary/10"
                              : bill.status === "overdue"
                                ? "bg-chart-3/10"
                                : "bg-primary/10"
                          }`}
                        >
                          {bill.status === "paid" ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : bill.status === "overdue" ? (
                            <AlertCircle className="w-5 h-5 text-chart-3" />
                          ) : (
                            <Calendar className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{bill.name}</p>
                            {bill.recurring && (
                              <Badge variant="outline" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{bill.category}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              Due {new Date(bill.dueDate).toLocaleDateString()}
                            </span>
                            {bill.status === "upcoming" && daysUntilDue <= 7 && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-chart-3">
                                  {daysUntilDue === 0
                                    ? "Due today"
                                    : daysUntilDue === 1
                                      ? "Due tomorrow"
                                      : `Due in ${daysUntilDue} days`}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">${bill.amount.toFixed(2)}</p>
                          <Badge
                            variant={
                              bill.status === "paid"
                                ? "secondary"
                                : bill.status === "overdue"
                                  ? "destructive"
                                  : "default"
                            }
                            className="text-xs"
                          >
                            {bill.status === "paid" ? "Paid" : bill.status === "overdue" ? "Overdue" : "Upcoming"}
                          </Badge>
                        </div>
                        {bill.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => markPaid(bill.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddBillDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  )
}
