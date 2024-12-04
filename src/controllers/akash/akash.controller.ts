import  { DirectSecp256k1HdWallet }  from "../../lib/akash/walletAkash"
import fs from 'fs'; 

export async function generateWallet(_req: any, res: any) {
    try {
        const username = _req.body.username
        const password = _req.body.password
        const salt = _req.body.salt
        const prefix = "akash"
    
        const mnemonic = username + password;   

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, prefix, salt)
        console.log(wallet);
        const accountWithPrivKeys = await wallet.getAccounts();
        fs.writeFileSync('accountWithPrivKeys.json', JSON.stringify(accountWithPrivKeys, null, 2));
        res.status(200).send(accountWithPrivKeys);
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







