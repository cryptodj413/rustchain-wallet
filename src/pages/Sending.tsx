import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ErgoService } from "../services/ergoService";
import { formatWalletAddress } from "../lib/utils";

interface TransactionDetails {
  txId: string;
  amount: string;
  address: string;
  memo: string;
  timestamp: string;
}

export default function SendingPage() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [status, setStatus] = useState<"sending" | "success" | "failed">("sending");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Get transaction details from session storage
    const storedTransaction = sessionStorage.getItem("pendingTransaction");
    if (storedTransaction) {
      const txDetails = JSON.parse(storedTransaction);
      setTransaction(txDetails);
      
      // Simulate transaction sending process
      simulateTransactionSending(txDetails);
    } else {
      // No transaction found, redirect back
      navigate("/send-coins");
    }
  }, [navigate]);

  const simulateTransactionSending = async (txDetails: TransactionDetails) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Create the transaction using Ergo SDK
      // 2. Sign it with the private key
      // 3. Submit it to the network
      // 4. Wait for confirmation
      
      // For now, we'll simulate success
      setStatus("success");
      
      // Store transaction result for status page
      const result = {
        success: true,
        txId: txDetails.txId,
        amount: txDetails.amount,
        address: txDetails.address,
        explorerUrl: ErgoService.getTransactionUrl(txDetails.txId)
      };
      
      sessionStorage.setItem("transactionResult", JSON.stringify(result));
      
      // Navigate to success page after a brief delay
      setTimeout(() => {
        navigate("/tx-status");
      }, 1500);
      
    } catch (error) {
      console.error("Transaction failed:", error);
      setStatus("failed");
      setError(error instanceof Error ? error.message : "Transaction failed");
      
      // Store error result
      const result = {
        success: false,
        error: error instanceof Error ? error.message : "Transaction failed",
        amount: txDetails.amount,
        address: txDetails.address
      };
      
      sessionStorage.setItem("transactionResult", JSON.stringify(result));
    }
  };

  if (!transaction) {
    return (
      <div className="retro-wallet">
        <div className="retro-screen flex flex-col h-full">
          <div className="retro-header justify-start">
            <button onClick={() => navigate(-1)} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="retro-wallet">
        <div className="retro-screen flex flex-col h-full">

          {/* Header */}
          <div className="retro-header justify-start">
            <button onClick={() => navigate(-1)} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            {/* Spinner */}
            <div className="w-20 h-20 rounded-full bg-[var(--retro-border)] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--retro-purple)] animate-spin" />
            </div>

            {/* Status Text */}
            <div className="text-center">
              <div className="text-white text-xl font-bold">
                {status === "sending" && "Sending..."}
                {status === "success" && "Sent Successfully!"}
                {status === "failed" && "Transaction Failed"}
              </div>
              <div className="text-[var(--retro-cyan)] text-sm pt-1">
                {transaction.amount} RTC to {formatWalletAddress(transaction.address)}
              </div>
              {error && (
                <div className="text-red-400 text-xs mt-2">
                  {error}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
  );
}
