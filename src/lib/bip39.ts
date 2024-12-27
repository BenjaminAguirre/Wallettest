import { toUtf8 } from "@cosmjs/encoding";
import { pbkdf2Sha512 } from "./pbkdf2";

function normalize(str: string): string {
  return str.normalize("NFKD");
}

export class Bip39 {

  //This function creates a seed from a username + password + pin(salt)
  public static async mnemonicToSeed(mnemonic: string, passphrase?: string): Promise<Uint8Array> {
    const mnemonicBytes = toUtf8(normalize(mnemonic.toString()));
    const sal = "mnemonic" + passphrase;
    const saltBytes = toUtf8(sal);
    return pbkdf2Sha512(mnemonicBytes, saltBytes, 2048, 64);
  }

}