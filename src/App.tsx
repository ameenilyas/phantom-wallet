import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import ConnectWallet from "./ConnectWallet";
import MintToken from "./MintToken";
import { useToasts } from "react-toast-notifications";

function App() {
  const [walletKey, setWalletKey] = useState<string>("API_KEY");
  const history = useHistory();
  const { addToast } = useToasts();

  useEffect(() => {
    if (walletKey.length < 8) return history.replace("/");
    addToast("Connected Successfully", {
      appearance: "success",
      autoDismiss: true,
    });
    history.replace("/token-options");
  }, [walletKey, history, addToast]);

  function connectWallet(publicKey: string) {
    setWalletKey(publicKey);
  }

  return (
    <main>
      <Switch>
        <Route exact path="/">
          <ConnectWallet setToWallet={connectWallet} />
        </Route>

        <Route exact path="/token-options">
          <MintToken walletKey={walletKey} />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
