import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import BackButton from "../components/BackButton";
import rustchainLogo from "/rustchain_logo_green.png";
import useWallet from "../hooks/useWallet";

export default function LockScreen() {
  const navigate = useNavigate();
  const { password, setTokenState } = useWallet();
  const [inputedPassword, setInputedPassword] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const handleContinue = () => {
    console.log(`inputedPassword: `, inputedPassword);
    console.log(`Real password: `, password);
    if (inputedPassword === password) {
      setTokenState();
      navigate("/dashboard");
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // Hide warning after 3 seconds
    }
  };

  return (
      <div className="retro-wallet relative">
        <div className="retro-screen">
          <BackButton route={-1} />

          {/* Header */}
          <div className="text-center space-y-1">
            <div className="flex flex-col justify-around items-center">
              <img
                src={rustchainLogo}
                alt="RustChain"
                className="w-40 h-40 mt-4 retro-green-shadow"
              />
              <h2 className="top-8 text-[20px] font-bold text-[var(--retro-green)]">
                Welcome !
              </h2>
              <p className="text-[12px] mt-1 text-[var(--retro-cyan)] opacity-70 tracking-widest">
                Please enter your password to access your account.
              </p>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between mt-10">
            <div>
              <label className="retro-label">Enter password</label>
              <Input
                placeholder="password..."
                className="retro-input relative"
                type="password"
                value={inputedPassword}
                onChange={(e) => setInputedPassword(e.target.value)}
              />
              <label className="right-0 top-0 retro-label mt-2 text-right">Forgot Password?</label>
            </div>
            
            {/* Warning Message */}
            {showWarning && (
              <div className="text-center">
                <p className="text-red-500 text-sm font-bold">
                  Incorrect password! Please try again.
                </p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-3 w-[90%]">
            <Button
              onClick={handleContinue}
              className="retro-btn retro-btn-primary w-full mb-3"
            >
              Continue
            </Button>
            <label className="retro-label-bold text-center">Need help? <a
              href="https://discord.gg/your-server" // Replace with your actual link
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--retro-green)] hover:underline"
            >
              Join our Discord
            </a></label>
          </div>
        </div>
      </div>
  );
}