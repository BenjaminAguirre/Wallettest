import { encodeSecp256k1Signature, makeCosmoshubPath, rawSecp256k1PubkeyToRawAddress } from "@cosmjs/amino";
import {
  HdPath,
  Secp256k1,
  Secp256k1Keypair,
  sha256,
  Slip10,
  Slip10Curve,

} from "@cosmjs/crypto";
import {toBech32} from "@cosmjs/encoding";

import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { AccountData, DirectSignResponse, OfflineDirectSigner } from "./signer";
import { makeSignBytes } from "./signing";

import { Bip39 } from "./bip39";
// import { EnglishMnemonic } from "./bip39";

interface AccountDataWithPrivkey extends AccountData {
  readonly privkey: Uint8Array;
}

interface Secp256k1Derivation {
  readonly hdPath: HdPath;
  readonly prefix: string;
}



export interface DirectSecp256k1HdWalletOptions {
  /** The password to use when deriving a BIP39 seed from a mnemonic. */
  readonly bip39Password: string;
  /** The BIP-32/SLIP-10 derivation paths. Defaults to the Cosmos Hub/ATOM path `m/44'/118'/0'/0/0`. */
  readonly hdPaths: readonly HdPath[];
  /** The bech32 address prefix (human readable part). Defaults to "cosmos". */
  readonly prefix: string;
}

interface DirectSecp256k1HdWalletConstructorOptions extends Partial<DirectSecp256k1HdWalletOptions> {
  readonly seed: Uint8Array;
}

const defaultOptions: DirectSecp256k1HdWalletOptions = {
  bip39Password: "",
  hdPaths: [makeCosmoshubPath(0)],
  prefix: "cosmos",
};

/** A wallet for protobuf based signing using SIGN_MODE_DIRECT */
export class DirectSecp256k1HdWallet implements OfflineDirectSigner {
  /**
   * Restores a wallet from the given BIP39 mnemonic.
   *
   * @param mnemonic Any valid English mnemonic.
   * @param options An optional `DirectSecp256k1HdWalletOptions` object optionally containing a bip39Password, hdPaths, and prefix.
   */
//   public static async fromseedPhrase(
//     mnemonic: string,
//     prefix: string,
//     options: Partial<DirectSecp256k1HdWalletOptions> = {},
//   ): Promise<DirectSecp256k1HdWallet> {
//     const mnemonicChecked = new EnglishMnemonic(mnemonic);
//     const seed = await Bip39.mnemonicPhraseToSeed(mnemonicChecked, options.bip39Password);
//     return new DirectSecp256k1HdWallet(mnemonicChecked, {
//       ...options,
//       seed: seed,
//       prefix: prefix
//     });
//   }


  public static async fromMnemonic(
    mnemonic: string,
    prefix: string,
    salt: string,
    options: Partial<DirectSecp256k1HdWalletOptions> = {},
  ): Promise<DirectSecp256k1HdWallet> {
    const seed = await Bip39.mnemonicToSeed(mnemonic, salt);
    return new DirectSecp256k1HdWallet(mnemonic, {
      ...options,
      seed: seed,
      prefix: prefix
    });
  }


  /** Base secret */
  private readonly secret: string;
  /** BIP39 seed */
  private readonly seed: Uint8Array;
  /** Derivation instructions */
  private readonly accounts: readonly Secp256k1Derivation[];

  protected constructor(mnemonic: string, options: DirectSecp256k1HdWalletConstructorOptions) {
    const prefix = options.prefix ?? defaultOptions.prefix;
    const hdPaths = options.hdPaths ?? defaultOptions.hdPaths;
    this.secret = mnemonic;
    this.seed = options.seed;
    this.accounts = hdPaths.map((hdPath) => ({
      hdPath: hdPath,
      prefix: prefix,
    }));
  }

  public get mnemonic(): string {
    return this.secret.toString();
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    const accountsWithPrivkeys = await this.getAccountsWithPrivkeys();
    return accountsWithPrivkeys.map(({ algo, pubkey, address, realPriv}) => ({
      algo: algo,
      pubkey: pubkey,
      address: address,
      realPriv: realPriv,
    }));
  }

  public async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    const accounts = await this.getAccountsWithPrivkeys();
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { privkey, pubkey } = account;
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = sha256(signBytes);
    const signature = await Secp256k1.createSignature(hashedMessage, privkey);
    const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
    const stdSignature = encodeSecp256k1Signature(pubkey, signatureBytes);
    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }



private async getKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair> {
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, this.seed, hdPath);
    const { pubkey } = await Secp256k1.makeKeypair(privkey);
    return {
      privkey: privkey,
      pubkey: Secp256k1.compressPubkey(pubkey),
    };
  }

  private async getAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]> {
    return Promise.all(
      this.accounts.map(async ({ hdPath, prefix }) => {
        const { privkey, pubkey } = await this.getKeyPair(hdPath);
        const address = toBech32(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));
        const realPriv = Buffer.from(privkey).toString("hex")
        return {
          algo: "secp256k1" as const,
          privkey: privkey,
          pubkey: pubkey,
          address: address,
          realPriv: realPriv,
        };
      }),
    );
  }
}