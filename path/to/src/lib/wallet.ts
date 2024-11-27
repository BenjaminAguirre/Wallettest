import bs58check from 'bs58check';
import secp256k1 from 'secp256k1';
import zcrypto from './crypto';
import {config} from "../lib/config";


/*
 * Makes a private key
 * @param {string} phrase (Password phrase)
 * @return {Buffer} Private key
 */
function mkPrivKey(phrase: string): Buffer {
    return zcrypto.sha256(Buffer.from(phrase, 'utf-8'));
}

/*
 * Converts a private key to WIF format
 * @param {string} privKey (private key)
 * @param {boolean} toCompressed (Convert to WIF compressed key or nah)
 * @return {string} WIF format (uncompressed)
 */
function privKeyToWIF(privKey: string, toCompressed?: boolean): string {
    toCompressed = toCompressed || false;
    const wif = config.mainnet.wif;

    if (toCompressed) privKey = privKey + '01';

    return bs58check.encode(Buffer.from(wif + privKey, 'hex'));
}

/*
 * Returns private key's public Key
 * @param {string} privKey (private key)
 * @param {boolean} toCompressed (Convert to public key compressed key or nah)
 * @return {string} Public Key (default: uncompressed)
 */
function privKeyToPubKey(privKey: string, toCompressed?: boolean): string {
    toCompressed = toCompressed || false;
    const pkBuffer = Buffer.from(privKey, 'hex');
    const publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed);
    return publicKey.toString('hex'); // Asegúrate de que publicKey sea un Buffer
}

/*
 * Given a WIF format pk, convert it back to the original pk
 * @param {string} wifPk (WIF format private key)
 * @return {string} Original private key (uncompressed)
 */
function WIFToPrivKey(wifPk: string): string {
    let og = bs58check.decode(wifPk).toString('hex'); // Asegúrate de que el resultado sea un Buffer
    og = og.substr(2, og.length); // remove WIF format ('80')

    // remove the '01' at the end to 'compress it' during WIF conversion
    if (og.length > 64) {
        og = og.substr(0, 64);
    }

    return og;
}

/*
 * Converts public key to zelcash address
 * @param {string | number[]} pubKey (public key)
 * @param {string} pubKeyHash (public key hash (optional, else use default))
 * @return {string} zelcash address
 */
function pubKeyToAddr(pubKey: string | number[], pubKeyHash?: string): string {
    const pubKeyHash = pubKeyHash || config.mainnet.pubKeyHash;

    // Si pubKey es un string que representa un array, conviértelo a un array de números
    if (typeof pubKey === 'string') {
        pubKey = pubKey.split(',').map(Number);
    }

    // Si pubKey es un array, conviértelo a una cadena hexadecimal
    if (Array.isArray(pubKey)) {
        pubKey = arrayToHex(pubKey);
    }

    // Verifica si pubKey es una cadena válida
    if (typeof pubKey !== 'string' || pubKey.trim() === '') {
        throw new Error('Invalid pubKey: pubKey must be a non-empty string.');
    }

    const buffer = Buffer.from(pubKey, "hex");

    // Verifica si el buffer está vacío
    if (buffer.length === 0) {
        throw new Error('Invalid pubKey: Buffer is empty. Please check the input.');
    }

    // Se calcula el hash160 del pubKey
    const hash160 = zcrypto.hash160(buffer);
  
    // Se codifica el pubKeyHash concatenado con el hash160 en formato base58
    return bs58check.encode(Buffer.from(pubKeyHash + hash160, 'hex')).toString('hex');
}


// Función para convertir un array de números a una cadena hexadecimal
function arrayToHex(arr: number[]): string {
    return arr.map(num => num.toString(16).padStart(2, '0')).join('');
} 


export {
    mkPrivKey,
    privKeyToWIF,
    privKeyToPubKey,
    pubKeyToAddr,
    WIFToPrivKey
  };