import { HDKey } from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import {
    xPrivXpub,
    cryptos,
} from '../../lib/type';
import { blockchains } from '@storage/blockchains'
import '@storage/blockchains';



export function getLibId(chain: keyof cryptos): string {
    return blockchains[chain].libid;
  }
  
  export function getScriptType(type: string): number {
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
  
  function generatexPubxPriv(
    mnemonic: string,
    bip = 48,
    coin: number,
    account = 0,
    type = 'p2sh',
    chain: keyof cryptos,
  ): xPrivXpub {
    const scriptType = getScriptType(type);
  
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const bipParams = blockchains[chain].bip32;
    const masterKey = HDKey.fromMasterSeed(seed, bipParams);
    const externalChain = masterKey.derive(
      `m/${bip}'/${coin}'/${account}'/${scriptType}'`,
    );
    return externalChain.toJSON();
  }
  
  // generate random mnemonic provided strength
  export function generateMnemonic(strength: 128 | 256 = 256): string {
    return bip39.generateMnemonic(wordlist, strength);
  }
  
  export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic, wordlist);
  }
  
  // returns xpub of hardened derivation path for a particular coin
  export function getMasterXpub(
    mnemonic: string,
    bip = 48,
    coin: number,
    account = 0,
    type = 'p2sh',
    chain: keyof cryptos,
  ): string {
    const xPubxPriv = generatexPubxPriv(
      mnemonic,
      bip,
      coin,
      account,
      type,
      chain,
    );
    return xPubxPriv.xpub;
  }
  
  // returns xpriv of hardened derivation path for a particular coin
  export function getMasterXpriv(
    mnemonic: string,
    bip = 48,
    coin: number,
    account = 0,
    type = 'p2sh',
    chain: keyof cryptos,
  ): string {
    const xPubxPriv = generatexPubxPriv(
      mnemonic,
      bip,
      coin,
      account,
      type,
      chain,
    );
    return xPubxPriv.xpriv;
  }
  