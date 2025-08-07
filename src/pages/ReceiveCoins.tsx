import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "../components/ui/button";
import useWallet from "../hooks/useWallet";


export default function ReceiveCoins() {
  const navigate = useNavigate();
  const { address } = useWallet();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
      <div className="retro-wallet">
        <div className="retro-screen">
          <div className="retro-header">
            <button onClick={() => navigate("/dashboard")} className="retro-back-btn">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <span className="retro-title">RECEIVE COINS</span>
          </div>

          <div className="retro-panel text-center">
            <div className="retro-qr-placeholder">
              <div className="retro-qr-code">
                {/* ASCII QR Code representation */}
                <pre className="text-xs leading-none">
                  {`██████████████  ██  ██████████████
██          ██  ██  ██          ██
██  ██████  ██████  ██  ██████  ██
██  ██████  ██  ██  ██  ██████  ██
██  ██████  ██████  ██  ██████  ██
██          ██████  ██          ██
██████████████████████████████████
                ██                
██████  ██████████████  ██████████
██  ██████  ██████████████  ██████
██████████████  ██████████████  ██
██████  ██████████████████████████
██  ██████████████████████████  ██
                ██                
██████████████  ██████████████████
██          ██████████          ██
██  ██████  ██████████  ██████  ██
██  ██████  ██████████  ██████  ██
██  ██████  ██████████  ██████  ██
██          ██████████          ██
██████████████████████████████████`}
                </pre>
              </div>
            </div>

            <div className="mt-4">
              <div className="retro-label-bold">YOUR WALLET ADDRESS</div>
              <div className="retro-address-display flex flex-col align-items justify-center">
                <div className="font-mono text-sm break-all">{address??""}</div>
                <Button onClick={() => copyToClipboard(address??"")} className="retro-btn retro-btn-secondary mt-2">
                  <Copy className="w-4 h-4 mr-2" />
                  COPY ADDRESS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}