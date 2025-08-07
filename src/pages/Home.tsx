import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import rustchainLogo from "/rustchain_logo_green.png";

const Home = () => {
  const navigate = useNavigate();

  const createNewWallet = () => {
    navigate('/create-wallet');
    console.log("createNewWallet");
  };

  const importExistingWallet = () => {
    navigate('/import-wallet');
    console.log("importExistingWallet");
  };

  return (
      <div className="retro-wallet flex flex-col justify-between py-10 px-6 text-center">
        <div className="mt-2 flex flex-col items-center justify-center">
            <img
              src={rustchainLogo}
              alt="RustChain"
              className="w-40 h-40 mt-4 retro-green-shadow"
            />
            <h1 className="text-4xl font-black text-[var(--retro-green)] drop-shadow-lg mt-2 mb-1 retro-title-green-shadow">
              RUSTCHAIN
            </h1>
            <p className="text-sm mt-1 text-[var(--retro-cyan)] tracking-widest uppercase">
              Classic Wallet Experience
            </p>
        </div>
        <div className="w-full flex flex-col space-y-4 px-4 pb-4">
          <Button
            onClick={createNewWallet}
            className="retro-btn retro-btn-primary text-base py-3"
          >
            Create a new wallet
          </Button>
          <Button
            onClick={importExistingWallet}
            className="retro-btn retro-btn-secondary text-base py-3"
          >
            Import an existing wallet
          </Button>
        </div>
      </div>
  );
};

export default Home;
