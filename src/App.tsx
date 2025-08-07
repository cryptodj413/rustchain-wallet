import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LockScreen from "./pages/LockScreen";
import ReceiveCoins from "./pages/ReceiveCoins";
import SendCoins from "./pages/SendCoins";
import CreateWallet from "./pages/CreateWallet";
import VerifyMnemonic from "./pages/VerifyMnemonic";
import ImportWallet from "./pages/ImportWallet";
import CreatePassword from "./pages/CreatePassword";
import Settings from "./pages/Settings";
import ConfirmTransaction from "./pages/ConfirmTransaction";
import SendingPage from "./pages/Sending";
import TransactionStatus from "./pages/TransantionStatus";
import { useEffect, useState } from "react";
import useWallet from "./hooks/useWallet";

function App() {
  const navigate = useNavigate();
  const { mnemonic, password, token, clearTokenState } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Immediate check when component mounts
    if (mnemonic && password) {
      const expirationTime = token ? parseInt(token, 10) : 0;
      if (Date.now() >= expirationTime) {
        clearTokenState();
        navigate("/locked");
      } else {
        // Only navigate to dashboard if we're on the home page
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "/home") {
          navigate("/dashboard");
        }
      }
    }
    setIsLoading(false);
  }, [mnemonic, password, token, clearTokenState, navigate]);

  useEffect(() => {
    // Periodic check for token expiration
    const interval = setInterval(() => {
      if (mnemonic && password) {
        const expirationTime = token ? parseInt(token, 10) : 0;
        console.log(`expirationTime`, expirationTime);
        console.log(`Date.now`, Date.now());
        if (Date.now() >= expirationTime) {
          clearTokenState();
          navigate("/locked");
        }
      }
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [token, mnemonic, password, clearTokenState, navigate]);

  // Show loading or Home based on authentication state
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  // Only show Home if user is not authenticated
  if (!mnemonic || !password) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/verify-mnemonic" element={<VerifyMnemonic />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path="/create-password" element={<CreatePassword />} />
      </Routes>
    );
  }

  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/locked" element={<LockScreen />} />
        <Route path="/receive-coins" element={<ReceiveCoins />} />
        <Route path="/send-coins" element={<SendCoins />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/verify-mnemonic" element={<VerifyMnemonic />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/confirm-tx" element={<ConfirmTransaction />} />
        <Route path="/sending" element={<SendingPage />} />
        <Route path="/tx-status" element={<TransactionStatus />} />
      </Routes>
  );
}

export default App;
