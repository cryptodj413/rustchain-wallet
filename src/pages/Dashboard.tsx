import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Download, Settings, Copy } from "lucide-react";
import { Button } from "../components/ui/button";
import mockWalletData from "../mockdata.json"
import useWallet from "../hooks/useWallet";
import { formatWalletAddress } from "../lib/utils";
import { ErgoService } from "../services/ergoService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, clearTokenState } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [rtcBalance, setRtcBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const closeDropdown = () => setShowDropdown(false);

  const copyAddressToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500);
  }, []);

  const walletData = mockWalletData;

  const [activeTab, setActiveTab] = useState<"coins" | "activity">("coins");

  // Fetch RTC balance when component mounts or address changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          setIsLoadingBalance(true);
          const balance = await ErgoService.getRTCBalance(address);
          setRtcBalance(balance);
        } catch (error) {
          console.error("Failed to fetch RTC balance:", error);
          setRtcBalance(0);
        } finally {
          setIsLoadingBalance(false);
        }
      }
    };

    fetchBalance();
  }, [address]);

  return (
      <div className="retro-wallet">
        <div className="retro-screen relative space-y-4">
          {/* Header */}
          <div className="flex relative items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[var(--retro-cyan)] text-black flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--retro-white)]">Account 0</span>
                <div className="flex items-center justify-center">
                  <span className="text-xs font-mono text-[var(--retro-gray)]">{formatWalletAddress(address??"")}</span>
                  <button className="retro-icon-btn ml-1" onClick={() => copyAddressToClipboard(address??"")}>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
            <button className="retro-icon-btn" onClick={toggleDropdown}>
              <Settings className="w-5 h-5" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-10 mt-2 w-40 bg-[var(--retro-surface)] border border-[var(--retro-green)] rounded shadow-md z-20">
                <button
                  onClick={() => {
                    navigate("/settings");
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--retro-white)] hover:bg-[var(--retro-border)]"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    clearTokenState();
                    navigate("/locked");
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--retro-red)] hover:bg-[var(--retro-border)]"
                >
                  Lock Wallet
                </button>
              </div>
            )}
          </div>

          <button 
            className="text-[var(--retro-cyan)] text-xs underline mt-0.5 text-left hover:text-[var(--retro-white)]"
            onClick={() => {
              if (address) {
                window.open(`https://ergoscan.io/address/${address}`, '_blank');
              }
            }}
          >
            View on explorer
          </button>

          {/* Balance */}
          <div className="text-center my-4">
            <div className="text-3xl font-bold text-[var(--retro-green)]">
              {isLoadingBalance ? "Loading..." : `${rtcBalance.toFixed(2)} RTC`}
            </div>
            <div className="text-sm text-[var(--retro-gray)]">0.00 USD</div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-4">
            <Button onClick={() => navigate("/send-coins")} className="retro-btn retro-btn-primary w-1/2">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
            <Button onClick={() => navigate("/receive-coins")} className="retro-btn retro-btn-secondary w-1/2">
              <Download className="w-4 h-4 mr-2" />
              Receive
            </Button>
          </div>

          {/* Token / Activity Tabs */}
          <div className="mt-10">
            <div className="flex justify-between text-sm font-semibold border-b border-gray-500">
              <button
                className={`px-2 pb-1 w-1/2 ${activeTab === "coins" ? "text-white border-b-2 border-yellow-400" : "text-retro-gray"}`}
                onClick={() => setActiveTab("coins")}
              >
                Coins
              </button>
              <button
                className={`px-2 pb-1 w-1/2 ${activeTab === "activity" ? "text-white border-b-2 border-yellow-400" : "text-retro-gray"}`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </div>

            {/* Token / Activity Content */}
            <div className="mt-3 text-sm">
              {activeTab === "coins" ? (
                <div className="flex justify-between font-mono text-white">
                  <div className="flex items-center gap-2">
                    <img src="/rtc-coin.png" alt="RTC" className="w-5 h-5" />
                    RTC
                  </div>
                  <div className="text-right">
                    <div>{isLoadingBalance ? "..." : rtcBalance.toFixed(2)}</div>
                    <div className="text-[var(--retro-gray)] text-xs">$0.00</div>
                  </div>
                </div>
              ) : (
                <div className="text-retro-gray text-xs font-mono">
                  <div className="space-y-2">
                    {walletData.transactions.map((tx) => (
                      <div key={tx.id} className="retro-transaction-detailed">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`font-mono font-bold ${tx.type === "receive" ? "text-retro-green" : "text-retro-red"}`}
                              >
                                {tx.amount}
                              </span>
                              <span className="retro-transaction-type">{tx.type.toUpperCase()}</span>
                            </div>
                            <div className="text-xs text-retro-gray font-mono">{tx.address}</div>
                            <div className="text-xs text-retro-gray">{tx.timestamp}</div>
                          </div>
                          <div className={`retro-status-badge ${tx.status}`}>{tx.status.toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={`absolute bottom-12 left-1/3 text-xs bg-[var(--retro-bg)] ${isCopied ? "px-3 py-2" : "p-0"
              }`}
          >
            {isCopied ? "Address is copied!" : ""}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
