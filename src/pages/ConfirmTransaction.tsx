import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { formatWalletAddress } from "../lib/utils";

interface TransactionDetails {
  txId: string;
  amount: string;
  address: string;
  memo: string;
  timestamp: string;
}

export default function ConfirmTransaction() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);

  useEffect(() => {
    // Get transaction details from session storage
    const storedTransaction = sessionStorage.getItem("pendingTransaction");
    if (storedTransaction) {
      setTransaction(JSON.parse(storedTransaction));
    } else {
      // No transaction found, redirect back
      navigate("/send-coins");
    }
  }, [navigate]);

  const handleConfirm = () => {
    if (transaction) {
      navigate("/sending");
    }
  };

  const handleCancel = () => {
    // Clear the stored transaction
    sessionStorage.removeItem("pendingTransaction");
    navigate("/send-coins");
  };

  if (!transaction) {
    return (
      <div className="retro-wallet relative">
        <div className="retro-screen">
          <div className="retro-header justify-start">
            <button onClick={() => navigate(-1)} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="text-white">Loading transaction details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="retro-wallet relative">
        <div className="retro-screen">
          {/* Header */}
          <div className="retro-header justify-start">
            <button onClick={() => navigate(-1)} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
          </div>

          {/* Confirmation */}
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="w-14 h-14 bg-[var(--retro-border)] rounded-full flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>

            <div className="text-[32px] font-bold text-white">{transaction.amount} RTC</div>
            <div className="text-[var(--retro-gray)] text-sm">
              {transaction.memo || "No memo"}
            </div>

            {/* Details */}
            <div className="w-full bg-[var(--retro-panel)] text-sm rounded-md border border-[var(--retro-border)]">
              <div className="flex justify-between p-3 border-b border-[var(--retro-border)]">
                <span className="text-[var(--retro-gray)]">To</span>
                <span className="text-white font-bold">{formatWalletAddress(transaction.address)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-[var(--retro-border)]">
                <span className="text-[var(--retro-gray)]">Network</span>
                <span className="text-white font-bold">Ergo Mainnet</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-[var(--retro-gray)]">Network fee</span>
                <span className="text-white font-bold">~0.001 ERG</span>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute bottom-6 w-full flex justify-between max-w-xs pt-1">
              <Button className="retro-btn retro-btn-secondary w-[48%] text-[12px]" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="retro-btn retro-btn-primary w-[48%] text-[12px]" onClick={handleConfirm}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
