import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import BackButton from "../components/BackButton";
import { saveToBrowserStorage } from "../lib/utils";
import useWallet from "../hooks/useWallet";

const ImportWallet = () => {
  const navigate = useNavigate();
  const { importWallet } = useWallet();
  const [copiedText, setCopiedText] = useState<string>("");
  const [displayWords, setDisplayWords] = useState<string[]>(Array(12).fill(""));

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('Text');
    console.log("PastedText~~~~~~~", pastedText)
    setCopiedText(pastedText);
  };

  const nextStep = () => {
    saveToBrowserStorage("seedPhrase", copiedText);
    importWallet(copiedText);
    navigate('/create-password');
  }

  useEffect(() => {
    // Create an array of 12 words, filling with empty strings if copiedText is empty
    const words = copiedText ? copiedText.split(" ") : Array(12).fill("");
    // Ensure we always have exactly 12 words
    const wordList = [...words, ...Array(12 - words.length).fill("")].slice(0, 12);
    setDisplayWords(wordList);
  }, [copiedText]);

  return (
      <div className="retro-wallet relative px-4 py-6 flex flex-col items-center justify-between">
        {/* Header */}
        <div className="text-center mt-4 space-y-1">
          <div className="flex justify-around items-center">
            <h2 className="top-8 text-[20px] font-bold text-[var(--retro-green)]">
              Import your wallet
            </h2>
          </div>
          <BackButton route={-1}/>
        </div>

        {/* Seed Words Grid */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs" onPaste={handlePaste}>
          {displayWords.map((word, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 mb-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--retro-border)]"
            >
              <span className="text-[var(--retro-cyan)] font-bold text-xs w-5 text-right mr-2">
                {index + 1}
              </span>
              <input
                value={word}
                className="my-1 text-[14px] text-[var(--retro-white)] p-4 bg-transparent border-none shadow-none focus:outline-none focus:border-none focus:ring-0 px-0 py-0 h-auto"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col space-y-4 px-4 pb-4">
          <Button
            onClick={()=> nextStep()}
            className="retro-btn retro-btn-primary text-base py-3"
          >
            Continue
          </Button>
        </div>
      </div>
  );
};

export default ImportWallet;
