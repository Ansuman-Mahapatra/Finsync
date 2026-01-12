"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Send, Sparkles, Bot, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  accountsAPI,
  billsAPI,
  budgetsAPI,
  dashboardAPI,
  goalsAPI,
  settingsAPI,
  transactionAPI,
  aiAPI,
} from "@/lib/api"

type CommandId =
  | "overview"
  | "transactions"
  | "bills"
  | "budgets"
  | "accounts"
  | "goals"
  | "settings"
  | "support"

type ChatMessage = {
  id: string
  role: "user" | "bot"
  text: string
}

type CommandDefinition = {
  id: CommandId
  label: string
  description: string
  keywords: string[]
  requiresAuth: boolean
  handler: (context: { userId: string | null }) => Promise<string>
}

const supportNumbers = [
  "+1-833-555-1010",
  "+1-866-410-8899",
  "+1-877-222-9145",
  "+1-844-930-7722",
]

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "$0.00"
  }
  return formatter.format(value)
}

const formatDate = (value?: string) => {
  if (!value) return "TBD"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

const createMessageId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

const commandDefinitions: CommandDefinition[] = [
  {
    id: "overview",
    label: "Financial overview",
    description: "Balance, income, expenses, and savings",
    keywords: ["overview", "summary", "balance", "insight"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const summary = await dashboardAPI.getSummary(userId as string)
      if (!summary) {
        return "I could not find any dashboard data yet."
      }
      return [
        "Here is your latest snapshot:",
        `- Balance: ${formatCurrency(summary.totalBalance)}`,
        `- Income: ${formatCurrency(summary.income)}`,
        `- Expenses: ${formatCurrency(summary.expenses)}`,
        `- Savings: ${formatCurrency(summary.savings)} (${summary.savingsPercentage ?? 0}% of income)`,
      ].join("\n")
    },
  },
  {
    id: "transactions",
    label: "Recent transactions",
    description: "Latest credits and debits",
    keywords: ["transaction", "spend", "expense", "income", "payment", "history"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const transactions = await transactionAPI.getRecentTransactions(userId as string)
      const items = Array.isArray(transactions) ? transactions.slice(0, 5) : []
      if (!items.length) {
        return "No recent transactions yet. Try adding one in the Transactions tab."
      }
      const lines = items.map((tx: any) => {
        return `- ${formatDate(tx.date)}: ${tx.type || "TRANSACTION"} ${formatCurrency(tx.amount)} for ${
          tx.description || tx.categoryName || "unspecified"
        }`
      })
      return `Here are your latest ${items.length} transactions:\n${lines.join("\n")}`
    },
  },
  {
    id: "bills",
    label: "Bills & dues",
    description: "Upcoming and overdue bills",
    keywords: ["bill", "due", "invoice", "pay", "utility"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const [upcoming, overdue] = await Promise.all([
        billsAPI.getUpcomingBills(userId as string),
        billsAPI.getOverdueBills(userId as string),
      ])
      const upcomingLines = (Array.isArray(upcoming) ? upcoming : []).slice(0, 3).map((bill: any) => {
        return `- ${bill.name || "Bill"}: ${formatCurrency(bill.amount)} due ${formatDate(bill.dueDate)}`
      })
      const overdueLines = (Array.isArray(overdue) ? overdue : []).slice(0, 2).map((bill: any) => {
        return `- ${bill.name || "Bill"}: ${formatCurrency(bill.amount)} overdue since ${formatDate(bill.dueDate)}`
      })
      if (!upcomingLines.length && !overdueLines.length) {
        return "All clear! You have no upcoming or overdue bills."
      }
      const parts = []
      if (upcomingLines.length) {
        parts.push("Upcoming bills:", ...upcomingLines)
      }
      if (overdueLines.length) {
        parts.push("Overdue bills:", ...overdueLines)
      }
      return parts.join("\n")
    },
  },
  {
    id: "budgets",
    label: "Budgets",
    description: "Spend versus limit by category",
    keywords: ["budget", "limit", "spending", "allocation"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const budgets = await budgetsAPI.getBudgets(userId as string)
      const items = Array.isArray(budgets) ? budgets.slice(0, 4) : []
      if (!items.length) {
        return "You do not have budgets yet. Create one to start tracking limits."
      }
      const lines = items.map((budget: any) => {
        return `- ${budget.category || "Category"}: ${formatCurrency(budget.spent)} of ${formatCurrency(budget.budgeted)} used`
      })
      return `Budget highlights:\n${lines.join("\n")}`
    },
  },
  {
    id: "accounts",
    label: "Accounts",
    description: "Balances per account",
    keywords: ["account", "bank", "card", "wallet"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const accounts = await accountsAPI.getAccounts(userId as string)
      const items = Array.isArray(accounts) ? accounts.slice(0, 5) : []
      if (!items.length) {
        return "No accounts are linked yet. Add one to keep balances in sync."
      }
      const lines = items.map((account: any) => {
        return `- ${account.name || "Account"} (${account.type || "N/A"}): ${formatCurrency(account.balance)}`
      })
      return `Here are your tracked accounts:\n${lines.join("\n")}`
    },
  },
  {
    id: "goals",
    label: "Goals",
    description: "Progress toward savings goals",
    keywords: ["goal", "target", "milestone", "progress"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const goals = await goalsAPI.getGoals(userId as string)
      const items = Array.isArray(goals) ? goals.slice(0, 4) : []
      if (!items.length) {
        return "You have not created any goals yet. Set one to start tracking progress."
      }
      const lines = items.map((goal: any) => {
        const progress = goal.target ? Math.round(((goal.current || 0) / goal.target) * 100) : 0
        return `- ${goal.name || "Goal"}: ${formatCurrency(goal.current)} of ${formatCurrency(goal.target)} (${progress}% complete)`
      })
      return `Goal progress:\n${lines.join("\n")}`
    },
  },
  {
    id: "settings",
    label: "Preferences",
    description: "User settings and limits",
    keywords: ["setting", "preference", "limits", "language", "currency"],
    requiresAuth: true,
    handler: async ({ userId }) => {
      const settings = await settingsAPI.getSettings(userId as string)
      if (!settings) {
        return "Settings are not configured yet. Save your preferences in the Settings tab."
      }
      return [
        "Your current preferences:",
        `- Currency: ${settings.currency || "USD"}`,
        `- Time zone: ${settings.timeZone || "UTC"}`,
        `- Language: ${settings.language || "en"}`,
        `- Notifications: ${settings.notifications ? "On" : "Off"}`,
        `- Email alerts: ${settings.emailAlerts ? "On" : "Off"}`,
        `- Monthly limit: ${formatCurrency(settings.monthlyBudgetLimit)}`,
        `- 2FA: ${settings.twoFactorAuth ? "Enabled" : "Disabled"}`,
      ].join("\n")
    },
  },
  {
    id: "support",
    label: "Support number",
    description: "Contact a human",
    keywords: ["support", "help", "contact", "human", "number", "phone"],
    requiresAuth: false,
    handler: async () => {
      const number = supportNumbers[Math.floor(Math.random() * supportNumbers.length)]
      return `You can reach our customer care at ${number}. They are available 24/7.`
    },
  },
]

const keywordMap = commandDefinitions.map((command) => ({
  id: command.id,
  keywords: command.keywords,
}))

const findMatchingCommand = (prompt: string) => {
  const normalized = prompt.trim().toLowerCase()
  if (!normalized) return null
  const found = keywordMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
  if (!found) return null
  return commandDefinitions.find((command) => command.id === found.id) ?? null
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: "bot",
      text: "Hi! I am your FinSync assistant. Ask about budgets, bills, transactions, or type 'support' for a customer care number.",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [loadingCommand, setLoadingCommand] = useState<CommandId | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    setUserId(localStorage.getItem("userId"))
  }, [])

  const availableCommands = useMemo(() => commandDefinitions, [])

  const appendMessage = (role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [...prev, { id: createMessageId(), role, text }])
  }

  const runCommand = async (command: CommandDefinition) => {
    setLoadingCommand(command.id)
    try {
      if (command.requiresAuth && !userId) {
        appendMessage("bot", "I need your user session before I can access that data. Please log in again.")
        return
      }
      const reply = await command.handler({ userId })
      appendMessage("bot", reply)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      appendMessage("bot", `Sorry, I could not complete that request. ${message}`)
    } finally {
      setLoadingCommand(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inputValue.trim()) return
    const prompt = inputValue.trim()
    appendMessage("user", prompt)
    setInputValue("")

    // First try to match a command
    const matchedCommand = findMatchingCommand(prompt)
    if (matchedCommand) {
      await runCommand(matchedCommand)
      return
    }

    // If no command matched, try AI chat
    if (userId) {
      setLoadingCommand("overview") // Use a loading state
      try {
        const response = await aiAPI.chat(userId, prompt)
        appendMessage("bot", response.response || response)
      } catch (error) {
        appendMessage(
          "bot",
          "I can help with accounts, bills, budgets, goals, transactions, settings, and support. Try asking, for example, 'Show my upcoming bills' or ask me a question about your finances.",
        )
      } finally {
        setLoadingCommand(null)
      }
    } else {
      appendMessage(
        "bot",
        "I can help with accounts, bills, budgets, goals, transactions, settings, and support. Try asking, for example, 'Show my upcoming bills'.",
      )
    }
  }

  const handleQuickCommand = async (command: CommandDefinition) => {
    appendMessage("user", command.label)
    await runCommand(command)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Chat Assistant</CardTitle>
          </div>
          <Bot className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Ask natural language questions about your finances or tap a quick command.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ScrollArea className="h-72 rounded-md border bg-muted/30 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="text-sm">
                <p className="font-semibold text-foreground">{message.role === "bot" ? "FinSync" : "You"}</p>
                <p className="whitespace-pre-line text-muted-foreground">{message.text}</p>
              </div>
            ))}
            {loadingCommand && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Working on it...
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick commands</p>
          <div className="flex flex-wrap gap-2">
            {availableCommands.map((command) => (
              <Button
                key={command.id}
                variant="secondary"
                size="sm"
                disabled={Boolean(loadingCommand)}
                onClick={() => handleQuickCommand(command)}
                title={command.description}
              >
                {command.label}
              </Button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Ask me about budgets, bills, goals, or type 'support'..."
          />
          <Button type="submit" disabled={!inputValue.trim() || Boolean(loadingCommand)}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

