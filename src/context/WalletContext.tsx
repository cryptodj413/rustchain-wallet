import React, { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as bip39 from "bip39";
import { ethers } from "ethers";
import { Address } from "@coinbarn/ergo-ts";
import { loadFromChromeStorage, saveToBrowserStorage, clearBrowserStorage } from "../lib/utils";

interface WalletContextProps { 
  mnemonic: string | null;
  privKey: string | null;
  address: string | null;
  token: string | null;
  password: string | null;
  setMnemonicState: (mnemonic: string | null) => void;
  setPrivKeyState: (privKey: string | null) => void;
  newWallet: () => void;
  importWallet: (mnemonic: string) => void;
  setTokenState: () => void;
  clearTokenState: () => void;
  setPasswordState: (password: string) => void;
  clearStorage: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [privKey, setPrivKey] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const newWallet = async (): Promise<void> => {
    try {
      const mnemonic = bip39.generateMnemonic();
      const rootNode = ethers.HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/429'/0'/0");
      const childNode = rootNode.deriveChild(0);
      const address = Address.fromPk(childNode.publicKey.toString().slice(2)).address;
      const privateKey = childNode.privateKey;
      
      setMnemonicState(mnemonic);
      setPrivKeyState(privateKey);
      setAddressState(address);
      
    } catch (error) {
      console.log("Error creating new wallet:", error);
    }
  };

  const importWallet = async (mnemonic: string): Promise<void> => {
    try {
      const rootNode = ethers.HDNodeWallet.fromPhrase(mnemonic, "", "m/44'/429'/0'/0");
      const childNode = rootNode.deriveChild(0);
      const address = Address.fromPk(childNode.publicKey.toString().slice(2)).address;
      const privateKey = childNode.privateKey;
      
      setMnemonicState(mnemonic);
      setPrivKeyState(privateKey);
      setAddressState(address);
      
    } catch (error) {
      console.log("Error creating new wallet:", error);
    }
  };

  const setTokenState = (): void => {
    const token = Date.now() + 5 * 60 * 1000; // 15 mins
    setToken(token.toString());
    saveToBrowserStorage("token", token.toString());
  };

  const clearTokenState = (): void => {
    setToken("0");
    saveToBrowserStorage("token", "0");
  };

  const setPasswordState = (password: string): void => {
    setPassword(password);
    saveToBrowserStorage("password", password);
  };

  const setMnemonicState = (mnemonic: string | null): void => {
    setMnemonic(mnemonic);
    saveToBrowserStorage("mnemonic", mnemonic);
  };

  const setPrivKeyState = (privKey: string | null): void => {
    setPrivKey(privKey);
    saveToBrowserStorage("privKey", privKey);
  };

  const setAddressState = (address: string | null): void => {
    setAddress(address);
    saveToBrowserStorage("address", address);
  };

  const clearStorage = async (): Promise<void> => {
    try {
      // Clear all browser storage
      await clearBrowserStorage();
      
      // Reset all state variables
      setMnemonic(null);
      setPrivKey(null);
      setAddress(null);
      setToken(null);
      setPassword(null);
      
      console.log("All wallet data cleared successfully");
    } catch (error) {
      console.error("Error clearing wallet storage:", error);
    }
  };

  useEffect(() => {
    loadFromChromeStorage("mnemonic", setMnemonic);
    loadFromChromeStorage("privKey", setPrivKey);
    loadFromChromeStorage("password", setPassword);
    loadFromChromeStorage("token", setToken);
    loadFromChromeStorage("address", setAddress);
  }, []);

  return (
    <WalletContext.Provider
      value={
        { 
          mnemonic, 
          privKey, 
          address, 
          token, 
          password, 
          setMnemonicState, 
          setPrivKeyState,
          newWallet, 
          importWallet, 
          setTokenState, 
          clearTokenState, 
          setPasswordState, 
          clearStorage 
        }
      }
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletContext;