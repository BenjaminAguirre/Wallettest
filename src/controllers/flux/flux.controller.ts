import {
    mkPrivKey,
    privKeyToPubKey,
    pubKeyToAddr,
    validatePrivKey,
    generateCheckValue,
    generateNodeIdentityKeypair,
} from "../../lib/flux/wallet";


const createPrivKey = async (_req: any, res: any) =>{
    try {
        const username = _req.body.username;
        const password = _req.body.password;
        // const salt = _req.body.password;
        const phrase = username + password;
        const compressed = _req.body.compressed;
        const typeIndex = 1;
        const adressIndex = 0;

        const privKey = await mkPrivKey(phrase)
        const pubKey = await privKeyToPubKey(privKey, compressed)
        const addr = await pubKeyToAddr(pubKey);
        const PrivateKeyWif = await generateNodeIdentityKeypair(privKey, typeIndex, adressIndex)
        console.log(PrivateKeyWif);
        
        res.status(200).send({
            status: "succeed",
            privateKey: privKey,
            publicKey: pubKey,
            address : addr,
            PrivateKeyWif
        })
    } catch (error) {
        res.status(560).send(error);
    }
}
const LogIn = async(_req: any, res: any) =>{

    try {
        const username = _req.body.username;
        const password = _req.body.password;
        // const salt = _req.body.password;
        const phrase = username + password;
        const expectedCheckValue = await generateCheckValue(phrase);

        const response = await validatePrivKey(phrase, expectedCheckValue)
   
        res.status(200).send({response});
    } catch (error) {
        res.status(500).send(error)
    }
}


export{
    createPrivKey,
    LogIn
};