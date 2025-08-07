import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { formatWalletAddress } from "../lib/utils";

interface TransactionResult {
  success: boolean;
  txId?: string;
  amount: string;
  address: string;
  explorerUrl?: string;
  error?: string;
}

export default function TransactionStatus() {
  const navigate = useNavigate();
  const [result, setResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    // Get transaction result from session storage
    const storedResult = sessionStorage.getItem("transactionResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // No result found, redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleClose = () => {
    // Clear stored data
    sessionStorage.removeItem("pendingTransaction");
    sessionStorage.removeItem("transactionResult");
    navigate("/dashboard");
  };

  if (!result) {
    return (
      <div className="retro-wallet relative">
        <div className="retro-screen">
          <div className="retro-header justify-start">
            <button onClick={() => navigate(-1)} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
          </div>
          <div className="flex flex-col justify-center items-center space-y-6 py-10 px-4 text-center">
            <div className="text-white">Loading transaction result...</div>
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

          {/* Main Content */}
          <div className="flex flex-col justify-center items-center space-y-6 py-10 px-4 text-center">

            {/* Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center
              ${result.success ? "bg-green-900/40" : "bg-red-900/40"}`}>
              {result.success ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>

            {/* Message */}
            <div>
              <div className="text-white text-2xl font-bold mb-1">
                {result.success ? "Sent!" : "Failed"}
              </div>
              <div className="text-sm text-[var(--retro-gray)]">
                {result.success ? (
                  <>
                    <span className="text-white font-bold">{result.amount} RTC</span> was successfully sent to{" "}
                    <span className="text-white font-bold">{formatWalletAddress(result.address)}</span>
                  </>
                ) : (
                  <>Something went wrong while sending <span className="text-white font-bold">{result.amount} RTC</span></>
                )}
              </div>
              {result.success && result.explorerUrl && (
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--retro-cyan)] underline text-sm mt-2 inline-block"
                >
                  View transaction
                </a>
              )}
              {!result.success && result.error && (
                <div className="text-red-400 text-xs mt-2">
                  Error: {result.error}
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleClose}
              className="!absolute bottom-6 w-[90%] retro-btn retro-btn-secondary mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
  );
}
