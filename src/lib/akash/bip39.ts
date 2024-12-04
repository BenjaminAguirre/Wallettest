import { toUtf8 } from "@cosmjs/encoding";

import { pbkdf2Sha512 } from "./pbkdf2";
import { sha256 } from "./sha";
import { wordlist } from "./wordlist";






function bytesToBitstring(bytes: ArrayLike<number>): string {
  return Array.from(bytes)
    .map((byte: number): string => byte.toString(2).padStart(8, "0"))
    .join("");
}

function deriveChecksumBits(entropy: Uint8Array): string {
  const entropyLengthBits = entropy.length * 8; // "ENT" (in bits)
  const checksumLengthBits = entropyLengthBits / 32; // "CS" (in bits)
  const hash = sha256(entropy);
  return bytesToBitstring(hash).slice(0, checksumLengthBits);
}

function bitstringToByte(bin: string): number {
  return parseInt(bin, 2);
}

const allowedEntropyLengths: readonly number[] = [16, 20, 24, 28, 32];


export function entropyToMnemonic(entropy: Uint8Array): string {
  if (allowedEntropyLengths.indexOf(entropy.length) === -1) {
    throw new Error("invalid input length");
  }

  const entropyBits = bytesToBitstring(entropy);
  const checksumBits = deriveChecksumBits(entropy);

  const bits = entropyBits + checksumBits;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chunks = bits.match(/(.{11})/g)!;
  const words = chunks.map((binary: string): string => {
    const index = bitstringToByte(binary);
    return wordlist[index];
  });

  return words.join(" ");
}

// const invalidEntropy = "Invalid entropy";
const invalidChecksum = "Invalid mnemonic checksum";

function normalize(str: string): string {
  return str.normalize("NFKD");
}

export function mnemonicToEntropy(mnemonic: string): Uint8Array {
  console.log(mnemonic);
  const seed = Buffer.from(mnemonic).toString("hex");
  console.log(seed);

  // Convertir la semilla de hexadecimal a bits
  const seedBits = seed.split('').map(hex => parseInt(hex, 16).toString(2).padStart(4, '0')).join('');
  console.log(seedBits);
  
  
  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(seedBits.length / 33) * 32; // Cambiar a seedBits
  console.log(dividerIndex);
  const entropyBits = seedBits.slice(0, dividerIndex); // Cambiar a seedBits
  console.log(entropyBits);
  const checksumBits = seedBits.slice(dividerIndex); // Cambiar a seedBits
  console.log(checksumBits);
  
  // calculate the checksum and compare
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entropyBytes = entropyBits.match(/(.{8})/g)!.map(bitstringToByte);
  console.log(entropyBytes);
  if (entropyBytes.length < 16 || entropyBytes.length > 32 || entropyBytes.length % 4 !== 0) {
    console.log("hola");
    
  }

  const entropy = Uint8Array.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(invalidChecksum)
  }


  return entropy;
}


export class EnglishMnemonic {
  public static readonly wordlist: readonly string[] = wordlist;

  // list of space separated lower case words (1 or more)
  private static readonly mnemonicMatcher = /^[a-z]+( [a-z]+)*$/;

  private readonly data: string;

  public constructor(mnemonic: string) {
    if (!EnglishMnemonic.mnemonicMatcher.test(mnemonic)) {
      throw new Error("Invalid mnemonic format");
    }

    const words = mnemonic.split(" ");
    const allowedWordsLengths: readonly number[] = [12, 15, 18, 21, 24];
    if (allowedWordsLengths.indexOf(words.length) === -1) {
      throw new Error(
        `Invalid word count in mnemonic (allowed: ${allowedWordsLengths} got: ${words.length})`,
      );
    }

    for (const word of words) {
      if (EnglishMnemonic.wordlist.indexOf(word) === -1) {
        throw new Error("Mnemonic contains invalid word");
      }
    }

    // Throws with informative error message if mnemonic is not valid
    mnemonicToEntropy(mnemonic);

    this.data = mnemonic;
  }

  public toString(): string {
    return this.data;
  }
}

export class Bip39 {
  /**
   * Encodes raw entropy of length 16, 20, 24, 28 or 32 bytes as an English mnemonic between 12 and 24 words.
   *
   * | Entropy            | Words |
   * |--------------------|-------|
   * | 128 bit (16 bytes) |    12 |
   * | 160 bit (20 bytes) |    15 |
   * | 192 bit (24 bytes) |    18 |
   * | 224 bit (28 bytes) |    21 |
   * | 256 bit (32 bytes) |    24 |
   *
   *
   * @see https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic
   * @param entropy The entropy to be encoded. This must be cryptographically secure.
   */
  public static encode(entropy: Uint8Array): EnglishMnemonic {
    return new EnglishMnemonic(entropyToMnemonic(entropy));
  }

  public static decode(mnemonic: EnglishMnemonic): Uint8Array {
    return mnemonicToEntropy(mnemonic.toString());
  }
  //This function creates a seed from a username + password + pin(salt)
  public static async mnemonicToSeed(mnemonic: string, salt: string): Promise<Uint8Array> {
    const mnemonicBytes = toUtf8(normalize(mnemonic.toString()));
    console.log(mnemonicBytes);
    const saltBytes = toUtf8(salt);
    return pbkdf2Sha512(mnemonicBytes, saltBytes, 2048, 64);
  }

  public static async mnemonicPhraseToSeed(mnemonic: EnglishMnemonic): Promise<Uint8Array> {
    const mnemonicBytes = toUtf8(normalize(mnemonic.toString()));
    const salt = "mnemonic" + Math.random().toString(36).substring(2, 15);
    const saltBytes = toUtf8(salt);
    return pbkdf2Sha512(mnemonicBytes, saltBytes, 2048, 64);
  }
}