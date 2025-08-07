import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import BackButton from "../components/BackButton";
import useWallet from "../hooks/useWallet";

const VerifyMnemonic = () => {
  const navigate = useNavigate();
  const { mnemonic } = useWallet();
  const [displayWords, setDisplayWords] = useState<string[]>(Array(12).fill(""));
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Get the expected mnemonic words
  const expectedWords = mnemonic ? mnemonic.split(" ") : [];

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('Text');
    console.log("PastedText~~~~~~~", pastedText);
    
    // Split the pasted text into words and fill the array
    const words = pastedText.trim().split(/\s+/);
    const wordList = [...words, ...Array(12 - words.length).fill("")].slice(0, 12);
    setDisplayWords(wordList);
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...displayWords];
    newWords[index] = value;
    setDisplayWords(newWords);
  };

  const verifyMnemonic = () => {
    if (!mnemonic) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const userMnemonic = displayWords.join(" ").trim();
    const isCorrect = userMnemonic === mnemonic;
    
    if (isCorrect) {
      setIsValid(true);
      // Navigate to create password after a brief delay to show success
      setTimeout(() => {
        navigate('/create-password');
      }, 1000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  // Check if all words are filled and valid
  useEffect(() => {
    const allWordsFilled = displayWords.every(word => word.trim() !== "");
    setIsValid(allWordsFilled);
  }, [displayWords]);

  return (
    <div className="retro-wallet relative px-4 py-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="text-center mt-4 space-y-1">
        <div className="flex justify-around items-center">
          <h2 className="top-8 text-[20px] font-bold text-[var(--retro-green)]">
            Repeat the words
          </h2>
        </div>
        <BackButton route={-1} />
        <p className="text-[11px] text-[var(--retro-white)] leading-tight pt-1">
          Enter your recovery phrase to verify you've saved it correctly
        </p>
      </div>

      {/* Error Message */}
      {showError && (
        <div className="text-[12px] text-red-400 bg-red-900/20 px-3 py-2 rounded-md border border-red-500/30">
          Incorrect recovery phrase. Please check your words and try again.
        </div>
      )}

      {/* Success Message */}
      {isValid && !showError && (
        <div className="text-[12px] text-green-400 bg-green-900/20 px-3 py-2 rounded-md border border-green-500/30">
          ✓ Recovery phrase verified successfully!
        </div>
      )}

      {/* Seed Words Grid */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs" onPaste={handlePaste}>
        {displayWords.map((word, index) => (
          <div
            key={index}
            className={`flex items-center px-3 py-2 mb-1 rounded-full bg-[rgba(255,255,255,0.05)] border ${
              word.trim() !== "" && expectedWords[index] && word.trim() === expectedWords[index]
                ? "border-green-500/50"
                : word.trim() !== "" && expectedWords[index] && word.trim() !== expectedWords[index]
                ? "border-red-500/50"
                : "border-[var(--retro-border)]"
            }`}
          >
            <span className="text-[var(--retro-cyan)] font-bold text-xs w-5 text-right mr-2">
              {index + 1}
            </span>
            <input
              value={word}
              onChange={(e) => handleWordChange(index, e.target.value)}
              placeholder="Enter word"
              className="my-1 text-[14px] text-[var(--retro-white)] p-4 bg-transparent border-none shadow-none focus:outline-none focus:border-none focus:ring-0 px-0 py-0 h-auto placeholder:text-gray-500"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex justify-between max-w-xs pt-1">
        <Button className="retro-btn retro-btn-secondary w-[48%] text-[12px]" onClick={() => navigate(-1)}>
          Show me again
        </Button>
        <Button 
          className={`retro-btn w-[48%] text-[12px] ${
            isValid ? "retro-btn-primary" : "retro-btn-secondary opacity-50"
          }`} 
          onClick={verifyMnemonic}
          disabled={!isValid}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};

export default VerifyMnemonic;
