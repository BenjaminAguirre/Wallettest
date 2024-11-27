declare module '@runonflux/zelcorejs' {
    export const zelcorejs: {
        address: {
            mkPrivKey(mnemonic: string): string;
            privKeyToWIF(privateKey: string, compressed: boolean, wif: string): string;
            privKeyToPubKey(privateKey: string, compressed: boolean): string;
            pubKeyToAddr(publicKey: string, pubKeyHash: string): string;
        }
    }
} 