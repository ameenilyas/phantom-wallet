import { PublicKey, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}
interface Props {
  setToWallet: Function;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

function ConnectWallet({ setToWallet }: Props) {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  // const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
  //   undefined
  // );

  // detect phantom provider exists
  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  /**
   * @description gets Phantom provider, if it exists
   */
  const getProvider = (): PhantomProvider | undefined => {
    if ("solana" in window) {
      // @ts-ignore
      const provider = window.solana as any;
      if (provider.isPhantom) return provider as PhantomProvider;
    }
  };

  /**
   * @description prompts user to connect wallet if it exists
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        console.log("wallet account ", response.publicKey.toString());
        setToWallet(response.publicKey.toString());
        // setWalletKey(response.publicKey.toString());
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <h2>Connect to Phantom Wallet</h2> */}

        {provider ? (
          <button
            style={{
              fontSize: "16px",
              padding: "15px",
              fontWeight: "bold",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={connectWallet}
          >
            Connect to Phantom Wallet
          </button>
        ) : (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}
      </header>
    </div>
  );
}

export default ConnectWallet;
