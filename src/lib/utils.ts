import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getKeyFromPassword, encrypt, decrypt } from "dha-encryption";
import browser from "webextension-polyfill";

const ENCRYPTION_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY || "encryption_key";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const formatWalletAddress = (address: string, startLength: number = 10, endLength: number = 10): string => {
  return `${address.slice(0, startLength)}....${address.slice(-endLength)}`;
};

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

const hexToArrayBuffer = (hex: string): ArrayBuffer => {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  return bytes.buffer;
}

const saveToBrowserStorage = async (key: string, value: string | null): Promise<void> => {
  try {
    const keyObject = await getKeyFromPassword(ENCRYPTION_KEY);
    const encryptedValue = value ? await encrypt(value, keyObject) : null;
    const hexValue = encryptedValue ? arrayBufferToHex(encryptedValue) : null;

    browser.storage.local.set({ [key]: hexValue }).then(() => {
      console.log(`${key} saved to browser storage`);
    }).catch((error: unknown) => {
      console.error(`Error saving ${key} to browser storage:`, error);
    });
  } catch (error) {
    console.error(`Error saving ${key} to browser storage:`, error);
  }
};

const decryptValue = async (value: string | undefined): Promise<string | null> => {
  const keyObject = await getKeyFromPassword(ENCRYPTION_KEY);
  const arrayBuffer = value ? hexToArrayBuffer(value) : null;
  const decryptedValue = arrayBuffer ? await decrypt(arrayBuffer, keyObject) : null;
  return decryptedValue;
};

const loadFromChromeStorage = (key: string, callback: (value: string | null) => void): void => {
  try {
    browser.storage.local.get(key).then((result: Record<string, unknown>) => {
      console.log("***** result", result);
      decryptValue(result[key] as string | undefined).then((decryptedValue) => {
        callback(decryptedValue);
      }).catch((error: unknown) => {
        console.error(`Error decrypting ${key} from browser storage:`, error);
      });
    }).catch((error: unknown) => {
      console.error(`Error loading ${key} from browser storage:`, error);
    });
  } catch (error) {
    console.error(`Error loading ${key} from browser storage:`, error);
  }
};

const clearBrowserStorage = async (): Promise<void> => {
  try {
    await browser.storage.local.clear();
    console.log("All browser storage cleared successfully");
  } catch (error) {
    console.error("Error clearing browser storage:", error);
  }
};

export {
  cn, formatWalletAddress, saveToBrowserStorage, loadFromChromeStorage, clearBrowserStorage
}