import {
    // privKeyToPubKey,
    // pubKeyToAddr,
    generatexPubxPriv,
    generateExternalIdentityKeypair,
    generateAddressKeypair
} from "../lib/flux/wallet";
import { generateAkashKeypair } from "../lib/akash/walletA"



const createGridAccount = async (_req: any, res: any) => {
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        const phrase = username + password;
        const MasterKeys = await generatexPubxPriv(phrase, 44, 118, 0, "p2sh")
        const xpriv = MasterKeys.xpriv;
        const FluxId = await generateExternalIdentityKeypair(xpriv);
        const FluxKeys = await generateAddressKeypair(xpriv, 0, 118)
        const AkashKeys = await generateAkashKeypair(xpriv);
        const user = {
            xpriv,
            FluxData:
            {
                FluxId,
                FluxKeys
            },
            AkashKeys,
        }

        res.status(200).send(user)


    } catch (error) {
        res.status(500).send(error)
    }
}




const fluxTest = async (_req: any, res: any) => {
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        const phrase = username + password;

        // m / 44' / 118' / 0' / 0 / address_index
        // m / 44' / 19167' / 0' / 0 / address_index


        const response = await generatexPubxPriv(phrase, 44, 118, 0, "p2sh")
        const xpriv = response.xpriv;
        // const akashData =generateAkashKeypair(xpriv)
        const fluxData = await generateAddressKeypair(xpriv, 0, 118)

        const accountData = {
            response,
            fluxData,
            xpriv
            // akashData
        }
        res.status(200).send(accountData)


    } catch (error) {
        res.status(500).send(error)
    }
}

const akashAccount = async (_req: any, res: any) => {
    try {
        const xprivKey = _req.body.xpriv;
        const response = await generateAkashKeypair(xprivKey);
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(error);
    }
}

const XprivXpub = async (_req: any, res: any) => {
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        const phrase = username + password;

        // m / 44' / 118' / 0' / 0 / address_index
        const response = await generatexPubxPriv(phrase, 44, 118, 0, "p2sh")

        res.status(200).send(response)


    } catch (error) {
        res.status(500).send(error)
    }
}


const ChildKeypair = async (_req: any, res: any) => {
    try {
        const xpriv = _req.body.xpriv;
        const chain = _req.body.chain;
        console.log(chain);

        const response = await generateAddressKeypair(xpriv, 0, 118)
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
}

const FluxId = async (_req: any, res: any) => {
    try {
        const xpriv = _req.body.xpriv;
        const response = await generateExternalIdentityKeypair(xpriv);
        res.status(200).send(response)

    } catch (error) {
        res.status(500).send(error)
    }
}


//1HPfRdi9vVXNe6pj2FhNxNuXg5yrZ5v3vm

// const auth = async(_req: any, res: any) =>{
//     try {
//         const username = _req.body.username;
//         const password = _req.body.password;
//         const phrase = username + password;
//         const response = await generatexPubxPriv(phrase, 44, 19167)
//         const xpriv = response.xpriv;
//         const fluxData = await generateAddressKeypair(xpriv,0,19167)
//         const fluxId = await generateExternalIdentityKeypair(xpriv)
//         const fluxPriv = fluxData.privKey;
//         console.log(fluxPriv);
//         const id = fluxId.privKey;
//         const authHeader = await GetZelIdAuthHeader(fluxPriv, id);
//         res.status(200).send(authHeader)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// }


export {
    // createPrivKey,
    // LogIn,
    // auth,
    ChildKeypair,
    createGridAccount,
    fluxTest,
    FluxId,
    XprivXpub,
    akashAccount
};