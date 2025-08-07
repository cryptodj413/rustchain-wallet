interface MnemonicInputsProps {
  mockSeedWords: string[];
}

const MnemonicInputs = ({ mockSeedWords }: MnemonicInputsProps) => {
  return (
    <>
      {mockSeedWords.map((word: string, index: number) => (
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
            className="my-1 text-[14px] text-[var(--retro-white)] p-4 bg-transparent border-none shadow-none focus:outline-none focus:border-none focus:ring-0 px-0 py-0 h-auto"
          />
        </div>
      ))}
    </>
  );
};

export default MnemonicInputs;
