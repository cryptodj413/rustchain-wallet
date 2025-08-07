import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useWallet from "../hooks/useWallet";
import { ErgoService } from "../services/ergoService";

export default function SendCoins() {
  const navigate = useNavigate();
  const { address, privKey } = useWallet();
  
  const [sendForm, setSendForm] = useState({
    address: "",
    amount: "",
    memo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const validateForm = () => {
    if (!sendForm.address.trim()) {
      setError("Recipient address is required");
      return false;
    }

    if (!ErgoService.isValidAddress(sendForm.address.trim())) {
      setError("Invalid Ergo address format");
      return false;
    }

    if (!sendForm.amount || parseFloat(sendForm.amount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    if (sendForm.address.trim() === address) {
      setError("Cannot send to your own address");
      return false;
    }

    setError("");
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    if (!address || !privKey) {
      setError("Wallet not properly initialized");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const amount = parseFloat(sendForm.amount);
      
      // Send transaction using ErgoService
      const txId = await ErgoService.sendTransaction(
        address,
        sendForm.address.trim(),
        amount,
        privKey,
        sendForm.memo.trim()
      );

      // Store transaction details for confirmation page
      const transactionDetails = {
        txId,
        amount: sendForm.amount,
        address: sendForm.address.trim(),
        memo: sendForm.memo.trim(),
        timestamp: new Date().toISOString()
      };

      // Store in session storage for the confirmation flow
      sessionStorage.setItem("pendingTransaction", JSON.stringify(transactionDetails));

      // Reset form
      setSendForm({ address: "", amount: "", memo: "" });
      
      // Navigate to confirmation
      navigate("/confirm-tx");
    } catch (error) {
      console.error("Transaction failed:", error);
      setError(error instanceof Error ? error.message : "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="retro-wallet">
        <div className="retro-screen">
          <div className="retro-header">
            <button onClick={() => navigate("/dashboard")} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </button>
            <span className="retro-title">SEND COINS</span>
          </div>

          <div className="retro-panel">
            <div className="space-y-4">
              {error && (
                <div className="text-red-400 bg-red-900/20 px-3 py-2 rounded-md border border-red-500/30 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="retro-label-bold">RECIPIENT ADDRESS</label>
                <Input
                  value={sendForm.address}
                  onChange={(e) => {
                    setSendForm((prev) => ({ ...prev, address: e.target.value }));
                    setError(""); // Clear error when user types
                  }}
                  placeholder="9fMM6ewgUmT994JuZp6m5aRn3LjjNvcPgcVywipWcz7iP4LzBFC"
                  className="retro-input"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="retro-label-bold">AMOUNT (RTC)</label>
                <Input
                  type="number"
                  value={sendForm.amount}
                  onChange={(e) => {
                    setSendForm((prev) => ({ ...prev, amount: e.target.value }));
                    setError(""); // Clear error when user types
                  }}
                  placeholder="0.00"
                  className="retro-input"
                  disabled={isLoading}
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="retro-label-bold">MEMO (OPTIONAL)</label>
                <Input
                  value={sendForm.memo}
                  onChange={(e) => setSendForm((prev) => ({ ...prev, memo: e.target.value }))}
                  placeholder="Transaction note..."
                  className="retro-input"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleSend}
                disabled={!sendForm.address || !sendForm.amount || isLoading}
                className="retro-btn retro-btn-primary w-full"
              >
                {isLoading ? "SENDING..." : "SEND TRANSACTION"}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}