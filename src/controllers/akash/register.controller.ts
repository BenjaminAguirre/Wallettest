import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Secp256k1HdWallet } from "@cosmjs/launchpad";
import getChainInfo from "../../service/akash/chainService";




export async function generateDirectWallet(_req: any, res: any) {
    try {
        const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.generate(12, {
            prefix: "akash",
        });
        process.stdout.write(wallet.mnemonic)
        const accounts = await wallet.getAccounts()
        console.error("Adress:", accounts[0].address)
    } catch (error) {
        console.error(`Error en generar wallet: ${error}`);
        return res.status(500).send('Error en la creación de la billetera');
    }
}

export async function generateWallet(_req: any, res: any) {
    try {
        const wallet: Secp256k1HdWallet = await Secp256k1HdWallet.generate();
        console.log(wallet);
        res.status(200).send("Wallet generated")
    } catch (error) {
        console.error(`Error en generar wallet: ${error}`);
        return res.status(500).send('Error en la creación de la billetera');
    }
}

export async function validateWallet(_req: any, res: any) {
    const { mnemonic } = _req.body;
  
    try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            prefix: "akash",
        });
        const address = await wallet.getAccounts();
        const balance = await getChainInfo(address[0].address);
        
        return res.status(200).json({
            success: true,
            data: {
                address: address[0].address,
                balance: balance
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Error en la validación de la billetera'
        });
    }
}










