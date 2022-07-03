import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import MintToken from "./MintToken";
import { useToasts } from "react-toast-notifications";

function App() {
  const [walletKey, setWalletKey] = useState<string>("API_KEY");
  const navigate = useNavigate();
  const { addToast } = useToasts();

  useEffect(() => {
    if (walletKey.length < 8) return navigate("/");
    addToast("Connected Successfully", {
      appearance: "success",
      autoDismiss: true,
    });
    navigate("/token-options");
  }, [walletKey, navigate, addToast]);

  function connectWallet(publicKey: string) {
    setWalletKey(publicKey);
  }

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={<ConnectWallet setToWallet={connectWallet} />}
        />
        <Route
          path="/token-options"
          element={<MintToken walletKey={walletKey} />}
        />
      </Routes>
    </main>
  );
}

export default App;
