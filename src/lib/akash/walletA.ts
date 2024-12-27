import * as bip32 from 'bip32';
import zcrypto from '../flux/crypto';
import { bech32 } from 'bech32';
import secp256k1 from 'secp256k1';
import * as crypto from 'crypto';

// Tipos para la función
interface AkashKeyPair {
  privKey: string;
  pubKey: string;
  address: string;
}

function generateAkashKeypair(
  xpriv: string,
): AkashKeyPair {
  try {
    // Decodificar la clave privada extendida (xpriv)
    const privateNode = bip32.fromBase58(xpriv);

    // Derivar clave privada usando los índices especificados
    const derivedPrivateKey = privateNode.derivePath(`${44}/${118}/${0}/${0}`);

    if (!derivedPrivateKey.privateKey) {
      throw new Error('No private key available in the derived key');
    }

    // Generar dirección Akash en formato Bech32
    const pubKeyBuffer = Buffer.from(secp256k1.publicKeyCreate(derivedPrivateKey.privateKey, true));
    const sha256Hash = zcrypto.sha256(pubKeyBuffer)
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
    const akashAddress = bech32.encode('akash', bech32.toWords(ripemd160Hash));

    // Convertir clave privada al formato WIF si es necesario
    const privateKeyHex = derivedPrivateKey.privateKey.toString('hex');
    
    // Clave pública en formato hexadecimal
    const publicKeyHex = pubKeyBuffer.toString('hex');

    // Retornar el resultado como un objeto clave-par
    return {
      privKey: privateKeyHex,
      pubKey: publicKeyHex,
      address: akashAddress,
    };
  } catch (error) {
    console.error('Error generating Akash keypair:', error);
    throw new Error('Failed to generate Akash keypair');
  }
}

export {
    generateAkashKeypair
}