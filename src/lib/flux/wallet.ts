import bs58check from 'bs58check';
import secp256k1 from 'secp256k1';
import zcrypto from './crypto';
// import { createHash } from 'crypto';
import { Bip39 } from "../akash/bip39";
import { config } from './config';
import utxolib, { minHDKey } from '@runonflux/utxo-lib';
import { HDKey } from "@scure/bip32";


utxolib
interface xPrivXpub {
  xpriv: string;
  xpub: string;
}

interface externalIdentity {
  privKey: string;
  pubKey: string;
  address: string;
}

interface keyPair {
  privKey: string;
  pubKey: string;
}



function getScriptType(type: string): number {
  switch (type) {
    case 'p2sh':
      return 0;
    case 'p2sh-p2wsh':
      return 1;
    case 'p2wsh':
      return 2;
    default:
      return 0;
  }
}
/*
 * Makes a private key
 * @param {String} phrase (Password phrase)
 * @return {Sting} Private key
 */
// function mkPrivKey(phrase: String) {
    
//   return zcrypto.sha256(Buffer.from(phrase, 'utf-8'));
// }


async function generatexPubxPriv(
  mnemonic: string,
  bip = 48,
  coin: number,
  account = 0,
  type = 'p2sh',
): Promise<xPrivXpub> {
  const flux = config.mainnet;
  const scriptType = getScriptType(type);

  const seed = await Bip39.mnemonicToSeed(mnemonic);
  const bipParams = flux.bip32;
  const masterKey =  HDKey.fromMasterSeed(seed, bipParams);
  console.log(masterKey);
  const externalChain = masterKey.derive(
    `m/${bip}'/${coin}'/${account}'/${scriptType}'`,
  );
  return externalChain.toJSON();
}


function generateAddressKeypair(
  xpriv: string,
  typeIndex: 0 | 1,
  addressIndex: number,
): keyPair {
  const chain = config.mainnet
  const libID = chain.libid;
  const bipParams = chain.bip32;
  const networkBipParams = utxolib.networks[libID].bip32;
  let externalChain;
  let network = utxolib.networks[libID];
  try {
    externalChain = HDKey.fromExtendedKey(xpriv, bipParams);
    network = Object.assign({}, network, {
      bip32: bipParams,
    });
  } catch (e) {
    console.log(e);
    externalChain = HDKey.fromExtendedKey(xpriv, networkBipParams);
  }

  const externalAddress = externalChain
    .deriveChild(typeIndex)
    .deriveChild(addressIndex);

  const derivedExternalAddress: minHDKey = utxolib.HDNode.fromBase58(
    // to get priv key in wif via lib
    externalAddress.toJSON().xpriv,
    network,
  );

  const privateKeyWIF: string = derivedExternalAddress.keyPair.toWIF();

  const publicKey = derivedExternalAddress.keyPair
    .getPublicKeyBuffer()
    .toString('hex'); // same as Buffer.from(externalAddress.pubKey).toString('hex);. Library does not expose keypair from just hex of private key, workaround

  return { privKey: privateKeyWIF, pubKey: publicKey };
}

/*
 * Converts a private key to WIF format
 * @param {String} privKey (private key)
 * @param {boolean} toCompressed (Convert to WIF compressed key or nah)
 * @return {Sting} WIF format (uncompressed)
 */
function privKeyToWIF(privKey: String, toCompressed?: boolean): string {
  toCompressed = toCompressed || false;
  const wif = config.mainnet.wif;

  if (toCompressed) privKey = privKey + '01';

  return bs58check.encode(Buffer.from(wif + privKey, 'hex'));
}

/*
 * Returns private key's public Key
 * @param {String} privKey (private key)
 * @param {boolean} toCompressed (Convert to public key compressed key or nah)
 * @return {Sting} Public Key (default: uncompressed)
 */
function privKeyToPubKey(privKey: String, toCompressed?: boolean): string {
    toCompressed = toCompressed || false; // Si no se proporciona toCompressed, se establece en false
  
    const pkBuffer = Buffer.from(privKey, 'hex'); // Convierte la clave privada de formato hexadecimal a un buffer
    var publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed); // Crea la clave pública a partir del buffer de la clave privada
    return Buffer.from(publicKey).toString('hex'); // Convierte a string hexadecimal antes de devolver
  }

/*
 * Converts public key to zelcash address
 * @param {String} pubKey (public key)
 * @param {String} pubKeyHash (public key hash (optional, else use default))
 * @return {String} zelcash address
 */


function pubKeyToAddr(pubKey: any): string {
    // Si no se proporciona pubKeyHash, se utiliza el valor por defecto de config.mainnet.pubKeyHash
    const pubKeyHash = config.mainnet.pubKeyHash;
  

    // Si pubKey es un string que representa un array, conviértelo a un array de números
    // if (typeof pubKey === 'string') {
    //     pubKey = pubKey.split(',').map(Number);
    // }
    

    // Si pubKey es un array, conviértelo a una cadena hexadecimal
    if (Array.isArray(pubKey)) {
        pubKey = arrayToHex(pubKey);
    }

    // Verifica si pubKey es una cadena válida
    if (typeof pubKey !== 'string' || pubKey.trim() === '') {
        throw new Error('Invalid pubKey: pubKey must be a non-empty string.');
    }

    // Ensure pubKey is a valid string or array
    if (typeof pubKey !== 'string' && !Array.isArray(pubKey)) {
        throw new Error('Invalid pubKey: pubKey must be a string or an array of numbers.');
    }

    const buffer = Buffer.from(pubKey, "hex");

    // Verifica si el buffer está vacío
    if (buffer.length === 0) {
        throw new Error('Invalid pubKey: Buffer is empty. Please check the input.');
    }

    // Se calcula el hash160 del pubKey, que es una forma de hash que se utiliza comúnmente en criptografía
    const hash160 = zcrypto.hash160(buffer);
    const Fluxadress = bs58check.encode(Buffer.from(pubKeyHash + hash160, 'hex'))
    
    return Fluxadress   
}


function generateExternalIdentityKeypair( // in memory we store just address
  xpriv: string,
): externalIdentity {
  const typeIndex = 11; // identity index
  const addressIndex = 0; // identity index
  const identityKeypair = generateNodeIdentityKeypair(
    xpriv,
    typeIndex,
    addressIndex,
  );
  console.log(identityKeypair);

  const pubKeyBuffer = Buffer.from(identityKeypair.pubKey, 'hex');
  const libID = config.mainnet.libid;
  const network = utxolib.networks[libID];

  const genKeypair = utxolib.ECPair.fromPublicKeyBuffer(pubKeyBuffer, network);
  const address = genKeypair.getAddress();

  const externalIdentity = {
    privKey: identityKeypair.privKey,
    pubKey: identityKeypair.pubKey,
    address,
  };
  return externalIdentity;
}



function generateNodeIdentityKeypair(
  xpriv: string,
  typeIndex: 11 | 12,
  addressIndex: number,
): keyPair {
  const libID = config.mainnet.libid;
  const bipParams = config.mainnet.bip32;
  const networkBipParams = utxolib.networks[libID].bip32;
  let externalChain;
  let network = utxolib.networks[libID];
  try {
    externalChain = HDKey.fromExtendedKey(xpriv, bipParams);
    network = Object.assign({}, network, {
      bip32: bipParams,
    });
  } catch (e) {
    console.log(e);
    externalChain = HDKey.fromExtendedKey(xpriv, networkBipParams);
  }

  const externalAddress = externalChain
    .deriveChild(typeIndex)
    .deriveChild(addressIndex);

  const derivedExternalAddress: utxolib.minHDKey = utxolib.HDNode.fromBase58(
    externalAddress.toJSON().xpriv,
    network,
  );

  const privateKeyWIF: string = derivedExternalAddress.keyPair.toWIF();

  const publicKey = derivedExternalAddress.keyPair
    .getPublicKeyBuffer()
    .toString('hex');

  return { privKey: privateKeyWIF, pubKey: publicKey };
}







// async function generateCheckValue(phrase: string): Promise<string> {
//   // Generar la clave privada a partir de la frase
//   const privkey = mkPrivKey(phrase);
//   console.log(privkey);
//   // Generar un hash de la clave privada
//   const hash = createHash('sha256').update(privkey).digest();
//   console.log(hash);
  

//   // Convertir el hash a Uint8Array y truncar a 4 bytes
//   const truncated = new Uint8Array(hash).slice(0, 4);
//   console.log(truncated);
//   const checkValue = Buffer.from(truncated).toString('base64url'); // Asegúrate de tener una función para Base64URL

//   return checkValue;
// } 


// Función para convertir un array de números a una cadena hexadecimal
function arrayToHex(arr: number[]): string {
  return arr.map(num => num.toString(16).padStart(2, '0')).join('');
}

// // Función para validar la clave privada
// async function validatePrivKey(phrase: string, expectedCheckValue: string): Promise<boolean> {
//   const checkValue = await generateCheckValue(phrase);
  
//   return checkValue === expectedCheckValue;
// }

export {
  // mkPrivKey,
  privKeyToWIF,
  privKeyToPubKey,
  pubKeyToAddr,
  // validatePrivKey,
  // generateCheckValue,
  generateNodeIdentityKeypair,
  generateAddressKeypair,
  generateExternalIdentityKeypair,
  generatexPubxPriv
};