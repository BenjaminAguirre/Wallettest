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
const allowedWordLengths: readonly number[] = [12, 15, 18, 21, 24];

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

const invalidNumberOfWorks = "Invalid number of words";
const wordNotInWordlist = "Found word that is not in the wordlist";
const invalidEntropy = "Invalid entropy";
const invalidChecksum = "Invalid mnemonic checksum";

function normalize(str: string): string {
  return str.normalize("NFKD");
}

export function mnemonicToEntropy(mnemonic: string): Uint8Array {
  const words = normalize(mnemonic).split(" ");
  if (!allowedWordLengths.includes(words.length)) {
    throw new Error(invalidNumberOfWorks);
  }

  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word: string): string => {
      const index = wordlist.indexOf(word);
      if (index === -1) {
        throw new Error(wordNotInWordlist);
      }
      return index.toString(2).padStart(11, "0");
    })
    .join("");

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(bitstringToByte);
  if (entropyBytes.length < 16 || entropyBytes.length > 32 || entropyBytes.length % 4 !== 0) {
    throw new Error(invalidEntropy);
  }

  const entropy = Uint8Array.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(invalidChecksum);
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
  public static async mnemonicToSeed(mnemonic: string, password?: string): Promise<Uint8Array> {
    const mnemonicBytes = toUtf8(normalize(mnemonic.toString()));
    const salt = "mnemonic" + (password ? normalize(password) : "");
    const saltBytes = toUtf8(salt);
    return pbkdf2Sha512(mnemonicBytes, saltBytes, 2048, 64);
  }

  public static async mnemonicPhraseToSeed(mnemonic: EnglishMnemonic, password?: string): Promise<Uint8Array> {
    const mnemonicBytes = toUtf8(normalize(mnemonic.toString()));
    const salt = "mnemonic" + (password ? normalize(password) : "");
    const saltBytes = toUtf8(salt);
    return pbkdf2Sha512(mnemonicBytes, saltBytes, 2048, 64);
  }
}