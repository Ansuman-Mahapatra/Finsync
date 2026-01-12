"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit } from "lucide-react"
import { accountsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AccountsPage() {
    const { toast } = useToast()
    const [accounts, setAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAccount, setNewAccount] = useState({
        name: "",
        type: "",
        balance: 0,
        color: "bg-primary"
    })

    const iconColor = (color: string) => color?.replace("bg-", "text-") || "text-primary"
    const bgTint = (color: string) => `${color || "bg-primary"}/10`

    const fetchAccounts = async () => {
        try {
            const userId = localStorage.getItem("userId")
            if (!userId) return
            const data = await accountsAPI.getAccounts(userId)
            setAccounts(data)
        } catch (e) {
            console.error("Error fetching accounts", e)
        } finally {
            setLoading(false)
        }
    }

    const createAccount = async () => {
        try {
            const userId = localStorage.getItem("userId")
            if (!userId) return
            
            const accountData = {
                ...newAccount,
                userId,
                accountName: newAccount.name,
                accountType: newAccount.type
            }
            
            await accountsAPI.createAccount(accountData)
            setNewAccount({ name: "", type: "", balance: 0, color: "bg-primary" })
            setIsDialogOpen(false)
            fetchAccounts()
            toast({
                title: "Success",
                description: "Account created successfully",
            })
        } catch (error) {
            console.error("Error creating account:", error)
            toast({
                title: "Error",
                description: "Failed to create account",
                variant: "destructive",
            })
        }
    }

    const deleteAccount = async (accountId: string) => {
        try {
            await accountsAPI.deleteAccount(accountId)
            fetchAccounts()
            toast({
                title: "Success",
                description: "Account deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting account:", error)
            toast({
                title: "Error",
                description: "Failed to delete account",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Bank Accounts</h1>
                        <p className="text-muted-foreground mt-1">Manage your linked bank accounts</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Account</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountName">Account Name</Label>
                                    <Input
                                        id="accountName"
                                        value={newAccount.name}
                                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                                        placeholder="e.g., Main Checking"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountType">Account Type</Label>
                                    <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Checking">Checking</SelectItem>
                                            <SelectItem value="Savings">Savings</SelectItem>
                                            <SelectItem value="Credit">Credit Card</SelectItem>
                                            <SelectItem value="Investment">Investment</SelectItem>
                                            <SelectItem value="Loan">Loan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="balance">Initial Balance</Label>
                                    <Input
                                        id="balance"
                                        type="number"
                                        step="0.01"
                                        value={newAccount.balance}
                                        onChange={(e) => setNewAccount({...newAccount, balance: parseFloat(e.target.value) || 0})}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="color">Color Theme</Label>
                                    <Select value={newAccount.color} onValueChange={(value) => setNewAccount({...newAccount, color: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bg-primary">Blue</SelectItem>
                                            <SelectItem value="bg-secondary">Gray</SelectItem>
                                            <SelectItem value="bg-green-500">Green</SelectItem>
                                            <SelectItem value="bg-red-500">Red</SelectItem>
                                            <SelectItem value="bg-purple-500">Purple</SelectItem>
                                            <SelectItem value="bg-orange-500">Orange</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button onClick={createAccount} disabled={!newAccount.name || !newAccount.type}>
                                        Create Account
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Accounts Grid */}
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No linked accounts</p>
                                <p className="text-xs mt-1">Use API or future UI to add accounts</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {accounts.map((account) => (
                            <Card key={account.id}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-base font-medium">{account.name || 'Unnamed Account'}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-10 h-10 ${bgTint(account.color)} rounded-lg flex items-center justify-center`}>
                                            <div className={`w-5 h-5 rounded-full ${iconColor(account.color)}`} />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteAccount(account.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground">{account.type || 'Unknown'}</p>
                                        <p className={`text-2xl font-bold ${account.balance < 0 ? "text-destructive" : "text-foreground"}`}>
                                            ${Math.abs(account.balance).toFixed(2)}
                                        </p>
                                        {account.balance < 0 && (
                                            <p className="text-xs text-destructive">Outstanding Balance</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
