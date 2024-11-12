import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { StargateClient } from "@cosmjs/stargate"



const rpc = "https://rpc.akashnet.net:443";
export async function generateWallet(_req: any, res: any) {
    try {
        const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.generate(24, {
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

export async function getData(_req: any, res: any) {

    try {
        const client = await StargateClient.connect(rpc)
        const balance = await client.getAllBalances("akash12t8fjhjyvtlvmflqnwhvg4df7uruvj7lddyrfd")
        console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight(), "Balance: ", balance);
    } catch (error) {
        return res.status(500).send("Error en traer balance")
    }
}












