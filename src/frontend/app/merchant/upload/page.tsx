"use client"

import type React from "react"

import { useState } from "react"
import { MerchantLayout } from "@/components/merchant-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react"

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    
    try {
      const userId = localStorage.getItem("userId")
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId || "")

      const response = await fetch("/api/merchant/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadStatus("success")
        setUploadMessage(result.message || "File uploaded successfully!")
      } else {
        setUploadStatus("error")
        setUploadMessage(result.message || "Upload failed. Please try again.")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadStatus("error")
      setUploadMessage("Upload failed. Please check the file format and try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = "Date,Description,Amount,Category\n01/15/2025,Sale #1234,299.99,Products\n01/16/2025,Service Payment,150.00,Services\n01/17/2025,Office Supplies,-45.50,Expenses"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transaction_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <MerchantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Transaction Upload</h1>
          <p className="text-muted-foreground mt-1">Upload Excel or CSV files to import multiple transactions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select an Excel (.xlsx, .xls) or CSV file to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {file ? file.name : "Choose a file or drag it here"}
                    </p>
                    <p className="text-xs text-muted-foreground">Excel (.xlsx, .xls) or CSV files only</p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {file && (
                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? "Uploading..." : "Upload Transactions"}
                </Button>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 p-3 rounded-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              {uploadStatus === "error" && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <span>{uploadMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File Format Requirements</CardTitle>
              <CardDescription>Your file should include the following columns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Required Columns</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Date (MM/DD/YYYY format)</li>
                      <li>• Description</li>
                      <li>• Amount (positive for income, negative for expenses)</li>
                      <li>• Category</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Example Format</p>
                  <div className="bg-muted p-3 rounded-md text-xs font-mono">
                    <div className="grid grid-cols-4 gap-2 mb-1 font-semibold">
                      <span>Date</span>
                      <span>Description</span>
                      <span>Amount</span>
                      <span>Category</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-muted-foreground">
                      <span>01/15/2025</span>
                      <span>Sale #1234</span>
                      <span>299.99</span>
                      <span>Products</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadTemplate}>
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MerchantLayout>
  )
}
