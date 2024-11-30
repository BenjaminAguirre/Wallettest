import  { DirectSecp256k1HdWallet }  from "../../lib/akash/walletAkash"


export async function generateWallet(_req: any, res: any) {
    try {
        const username = _req.body.username
        const password = _req.body.password
        const prefix = "akash"
    
        const mnemonic = username + password;
        console.log(mnemonic);    

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, prefix)
        console.log(wallet);
        

        res.status(200).send(wallet)
    } catch (error) {
        console.error(`Error en generar wallet: ${error}`);
        return res.status(500).send('Error en la creación de la billetera');
    }
}

// export async function generateWalletFromSeed(_req: null, res: any){
//     try {
//         const mnemonic = "fit submit couple shield badge ring finger great lecture cash vicious unlock";
//         const wallet = await DirectSecp256k1HdWallet.fromseedPhrase(mnemonic, "akash");

//         // Llamar a getAccountsWithPrivkeys para obtener las cuentas con claves privadas
//         const accountsWithPrivkeys = await wallet.getAccounts();

//         // Enviar las cuentas con claves privadas como respuesta
//         return res.status(200).send(accountsWithPrivkeys);
//     } catch (error) {
//         return res.status(500).send(error);
//     }
// }







