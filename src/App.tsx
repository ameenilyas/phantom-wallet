import { useState } from "react";

import ConnectWallet from "./ConnectWallet";
import MintToken from "./MintToken";
import { useToasts } from "react-toast-notifications";

function App() {
  const [walletKey, setWalletKey] = useState<string>("API_KEY");
  const { addToast } = useToasts();

  function connectWallet(publicKey: string) {
    addToast("Connected Successfully", {
      appearance: "success",
      autoDismiss: true,
    });
    setWalletKey(publicKey);
  }

  return (
    <main>
      {walletKey?.length < 8 ? (
        <ConnectWallet setToWallet={connectWallet} />
      ) : (
        <MintToken walletKey={walletKey} />
      )}
    </main>
  );
}

export default App;
