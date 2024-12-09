import {
    mkPrivKey,
    privKeyToPubKey,
    pubKeyToAddr
} from "../lib/flux/wallet";
import  { DirectSecp256k1HdWallet }  from "../lib/akash/walletAkash"
import { mnemonicToEntropy } from "../lib/akash/bip39";

const createAccounts = async (_req: any, res: any) =>{
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        const salt = _req.body.salt;
        const mnemonic = username + password;
        const compressed = _req.body.compressed;
        const prefix = "akash"

        const privKey = await mkPrivKey(mnemonic)
        const pubKey = await privKeyToPubKey(privKey, compressed)
        const addr = await pubKeyToAddr(pubKey);
        const walletAkash = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, prefix, salt);
        const accountWithPrivKeys = await walletAkash.getAccounts();

        const flux =  {
            address: addr,
            PublicKey: pubKey,
            privateKey: privKey,
        }
        const akash = {
            address: accountWithPrivKeys[0].address,
            privateKey: accountWithPrivKeys[0].realPriv,

        }
        res.status(200).send({
            status: "succeed",
            flux,
            akash
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
const validateAccounts = async(_req: any, res:any)=>{
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        const salt = _req.body.password;
        const mnemonic = username + password + salt;

        const bits = await mnemonicToEntropy(mnemonic)
        console.log(bits);
        
        
        res.status(200).send(bits)
    } catch (error) {
        res.status(500).send(error)
    }
}




export {
    createAccounts,
    validateAccounts
}
