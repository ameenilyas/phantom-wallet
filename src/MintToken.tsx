import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount,
} from "@solana/spl-token";
import "./App.css";

interface Props {
  walletKey: string;
}

// Special setup to add a Buffer class, because it's missing
window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken({ walletKey }: Props) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const fromWallet = Keypair.generate();
  const toWallet = new PublicKey(walletKey);
  let mint: PublicKey;
  let fromTokenAccount: Account;

  async function createToken() {
    const fromAirdropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirdropSignature);

    // Create new Token Mint
    mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      9 // means here we have a decimal of 9, 0's
    );
    console.log(`Create Token: ${mint.toBase58()}`);

    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    alert("Token Created");
  }

  async function mintToken() {
    // Mint 1 new Token to the "fromTokenAccount" account we just created
    const signature = await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      fromWallet.publicKey,
      10000000000
    );
    console.log(`Mint Signature: ${signature}`);
    alert(`Mint Signature: ${signature}`);
  }

  async function checkBalance() {
    // get the supply of tokens we have minted into existence
    const mintInfo = await getMint(connection, mint);
    console.log({ mintInfo });

    // get the amount of tokens left in the account
    const tokenAccountInfo = await getAccount(
      connection,
      fromTokenAccount.address
    );
    console.log({ tokenAccountInfo });
    alert(`You Current Balance: ${tokenAccountInfo.amount}`);
  }

  async function sendToken() {
    // get the token account of the toWallet address, and if it does not exist, create it.
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      toWallet
    );
    console.log(`toTokenAccount: ${toTokenAccount.address}`);
    console.log({ toTokenAccount });

    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      1000000000 // 1 billion
    );

    console.log(`finished transfer with ${signature}`);
    alert("Token has been sent. Check your Wallet.");
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Mint Token Section</h1>
        <div className="buttonsContainer">
          <button style={{ cursor: "pointer" }} onClick={createToken}>
            Create Token
          </button>
          <button style={{ cursor: "pointer" }} onClick={mintToken}>
            Mint Token
          </button>
          <button style={{ cursor: "pointer" }} onClick={checkBalance}>
            Check Token
          </button>
          <button style={{ cursor: "pointer" }} onClick={sendToken}>
            Send Token
          </button>
        </div>
      </div>
    </div>
  );
}

export default MintToken;
