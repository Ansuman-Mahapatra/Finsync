"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ShoppingBag, Zap, Car } from "lucide-react"
import { transactionAPI } from "@/lib/api"

const iconMap: Record<string, any> = {
  Food: ShoppingBag,
  Income: ArrowUpRight,
  Utilities: Zap,
  Transportation: Car,
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (userId) {
          const data = await transactionAPI.getRecentTransactions(userId)
          setTransactions(data)
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Add transactions to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction: any) => {
        const Icon = iconMap[transaction.categoryName] || ShoppingBag
        const isIncome = transaction.type === 'INCOME'
        const formattedDate = new Date(transaction.date).toLocaleDateString()
        
        return (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isIncome ? "bg-secondary/10" : "bg-muted"
                }`}
              >
                <Icon className={`w-5 h-5 ${isIncome ? "text-secondary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.description || transaction.categoryName}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${isIncome ? "text-secondary" : "text-foreground"}`}>
                {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.categoryName}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
