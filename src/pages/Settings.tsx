import { useCallback, useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import BackButton from "../components/BackButton";
import useWallet from "../hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { formatWalletAddress } from "../lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const { privKey, clearStorage } = useWallet();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isPrivateKeyCopied, setIsPrivateKeyCopied] = useState(false);

  const copyAddressToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setIsPrivateKeyCopied(true);
    setTimeout(() => setIsPrivateKeyCopied(false), 2000); // Reset after 2 seconds
  }, []);

  return (
      <div className="retro-wallet relative px-4 py-6 flex flex-col items-center justify-between">

        <div className="retro-screen w-full">
          <div className="retro-header">
            <BackButton route={-1} />
            <span className="retro-title">SETTINGS</span>
          </div>

          <div className="space-y-4">
            <div className="retro-panel">
              <div className="retro-panel-header">WALLET INFO</div>
              <div className="space-y-3">
                <div>
                  <div className="retro-label-bold">WALLET VERSION</div>
                  <div className="text-retro-green font-mono">v1.0.0-RETRO</div>
                </div>
                <div>
                  <div className="retro-label-bold">NETWORK</div>
                  <div className="text-retro-green font-mono">MAINNET</div>
                </div>
                <div>
                  <div className="retro-label-bold">PRIVATE KEY</div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {showPrivateKey ? (
                        <span 
                          onClick={() => copyAddressToClipboard(privKey??"")} 
                          className={`cursor-pointer transition-all duration-300 ${
                            isPrivateKeyCopied 
                              ? "text-[var(--retro-green)] underline decoration-[var(--retro-green)]" 
                              : "text-[var(--retro-cyan)] underline decoration-[var(--retro-cyan)]"
                          }`}
                        >
                          {formatWalletAddress(privKey??"")}
                        </span>
                      ) : (
                        "••••••••••••••••••••"
                      )}
                    </span>
                    <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="retro-icon-btn">
                      {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="retro-panel">
              <div className="retro-panel-header">PREFERENCES</div>
              <div className="space-y-2">
                <div className="retro-setting-item">
                  <span>SOUND EFFECTS</span>
                  <span className="text-retro-green">ON</span>
                </div>
                <div className="retro-setting-item">
                  <span>AUTO-LOCK</span>
                  <span className="text-retro-green">5 MIN</span>
                </div>
              </div>
            </div>

            <div className="retro-panel">
              <div className="retro-panel-header">DANGER ZONE</div>
              <Button className="retro-btn retro-btn-danger w-full" onClick={() => {
                setTimeout(clearStorage, 10);
                navigate("/");
              }}>RESET WALLET</Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Settings
