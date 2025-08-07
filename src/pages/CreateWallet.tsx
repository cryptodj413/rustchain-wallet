import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import BackButton from "../components/BackButton";
import useWallet from "../hooks/useWallet";
import { saveToBrowserStorage } from "../lib/utils";

const CreateWallet = () => {
  const navigate = useNavigate();
  const { mnemonic, newWallet } = useWallet();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500);
  }, []);


  useEffect(() => { 
    const initializeWallet = async () => {
      // If no saved phrase exists, create a new wallet
      if (!mnemonic) {
        newWallet();
      }
    };

    initializeWallet();
  }, []);

  // Save the mnemonic to storage when it changes
  useEffect(() => {
    if (mnemonic) {
      saveToBrowserStorage("seedPhrase", mnemonic);
    }
  }, [mnemonic]);

  return (
      <div className="retro-wallet relative px-4 py-6 flex flex-col items-center justify-between">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-around items-center -left-6">
            <BackButton route={-1} />
            <h2 className="text-[16px] mt-4 font-bold text-[var(--retro-green)]">
              This Is Your Recovery Phrase
            </h2>
          </div>
          <p className="text-[11px] text-[var(--retro-white)] leading-tight pt-1">
            Make sure to write it down or copy it as shown here.<br />
            You have to verify this later.
          </p>
        </div>

        {/* Seed Words Grid */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
          {mnemonic?.split(' ').map((word, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 mb-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--retro-border)]"
            >
              <span className="text-[var(--retro-cyan)] font-bold text-xs w-5 text-right mr-2">
                {index + 1}
              </span>
              <input
                readOnly
                value={word}
                className="my-1 mx-1 text-[14px] text-[var(--retro-white)] p-4 bg-transparent border-none shadow-none focus:outline-none focus:border-none focus:ring-0 px-0 py-0 h-auto"
              />
            </div>
          ))}
        </div>


        {/* Copy Link */}
        <button
          onClick={() => copyToClipboard(mnemonic??"")}
          className="text-[11px] text-[var(--retro-cyan)] underline hover:text-[var(--retro-white)]"
        >
          {isCopied ? "Copied!" : "Copy Seedphrase"}
        </button>

        {/* Action Buttons */}
        <div className="w-full flex justify-between max-w-xs pt-1">
          <Button className="retro-btn retro-btn-secondary w-[48%] text-[12px]">
            Backup
          </Button>
          <Button className="retro-btn retro-btn-primary w-[48%] text-[12px]" onClick={() => navigate('/verify-mnemonic')}>
            Verify
          </Button>
        </div>
      </div>
  );
};

export default CreateWallet;
