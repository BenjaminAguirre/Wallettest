// src/utils/authUtils.ts
import * as bitcoin from "bitcoinjs-lib"; // Importing bitcoinjs-lib
import * as bitcoinMessage from "bitcoinjs-message"; // Importing bitcoinjs-message
import * as ECPair from "ecpair"; // Importing ecpair
import axios from "axios";


// Dynamically import dotenv to load environment variables
(async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
  })();
// Dynamically import tiny-secp256k1
const eccPromise = import("tiny-secp256k1");

// Load ECC and create ECPairFactory asynchronously
let ECPairFactory: any;
(async () => {
  const ecc = await eccPromise;
  ECPairFactory = ECPair.ECPairFactory(ecc); // Create ECPairFactory using ecc
})();

/**
 * Signs a message using a private key.
 *
 * @param message - The message to be signed.
 * @param privKey - The private key to sign the message.
 * @returns The signature in base64 format or an error message.
 */
export function SignMessage(message: string, privKey: string): string {
  const network = bitcoin.networks.bitcoin;

  try {
    if (!ECPairFactory) {
      throw new Error("ECPairFactory is not initialized.");
    }

    // Create ECPair from private key using the network
    const keyPair = ECPairFactory.fromWIF(privKey, network);
    const privateKey = keyPair.privateKey;

    if (!privateKey) {
      throw new Error("Private key not found.");
    }

    // Sign the message
    const signature = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    return signature.toString("base64");
  } catch (error) {
    console.log("Error signing message:", error);
    return "Error signing";
  }
}

/**
 * Retrieves an authorization header for Zel ID.
 *
 * @returns A promise that resolves to the authorization header or an error message.
 */
export async function GetZelIdAuthHeader(privateKey: string, id: string): Promise<string> {
  try {
    // Get zelid from env
    const zelid = id;
    
    if (!zelid) {
      return "Error: FLUX_ID not found in environment variables";
    }

    const privKey = privateKey;
    if (!privKey) {
      return "Error: FLUX_ID_PRIVATE_KEY not found in environment";
    }

    // Get flux URL from env
    // const FLUX_API_URL = process.env.FLUX_API_URL;
    // console.log(FLUX_API_URL);
    // if (!FLUX_API_URL) {
    //   return "Error: FLUX_API_URL not found in environment variables";
    // }

    // Fetch the login phrase from the API
    const loginPhraseResponse = await axios.get(
      "https://api.runonflux.io/id/loginphrase"
    );
    console.log(loginPhraseResponse);
    
    const loginPhraseString = loginPhraseResponse.data.data;

    // Sign the login phrase
    const signature = SignMessage(loginPhraseString, "KwRfNcUKyNXmaA1UcZ5aksVsLEhJQifgqf5WKsfRk4serBv49UTH");
    console.log("Signature:",signature);
    

    const encodedSignature = encodeURIComponent(signature);
    // Concatenate zelid, signature, and login phrase
    const authHeader = `zelid=${zelid}&signature=${encodedSignature}&loginPhrase=${loginPhraseString}`;

      return authHeader;
  } catch (error) {
    console.log("Error fetching or verifying login phrase:", error);
    return "Error signing";
  }
}