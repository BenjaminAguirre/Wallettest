import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import bip39 from "bip39"

// import { Secp256k1HdWallet } from "@cosmjs/launchpad";
// import getChainInfo from "../../service/akash/chainService";

// ... existing code ...
async function fromMnemonic(mnemonic: string){
    const seed = (await bip39.mnemonicToSeedSync(mnemonic)).toString("hex");


    return seed
}


export{
    fromMnemonic
}
