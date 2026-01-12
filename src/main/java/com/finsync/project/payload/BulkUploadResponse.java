package com.finsync.project.payload;

public class BulkUploadResponse {
    private boolean success;
    private int processedCount;
    private int successCount;
    private int errorCount;
    private String message;

    public BulkUploadResponse() {}

    public BulkUploadResponse(boolean success, int processedCount, int successCount, int errorCount, String message) {
        this.success = success;
        this.processedCount = processedCount;
        this.successCount = successCount;
        this.errorCount = errorCount;
        this.message = message;
    }

    // Getters
    public boolean isSuccess() { return success; }
    public int getProcessedCount() { return processedCount; }
    public int getSuccessCount() { return successCount; }
    public int getErrorCount() { return errorCount; }
    public String getMessage() { return message; }

    // Setters
    public void setSuccess(boolean success) { this.success = success; }
    public void setProcessedCount(int processedCount) { this.processedCount = processedCount; }
    public void setSuccessCount(int successCount) { this.successCount = successCount; }
    public void setErrorCount(int errorCount) { this.errorCount = errorCount; }
    public void setMessage(String message) { this.message = message; }
}
