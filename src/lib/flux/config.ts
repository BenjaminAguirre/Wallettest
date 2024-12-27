'use strict';

export const config = {
    mainnet: {
        id: 'flux',
        libid: 'flux',
        name: 'Flux',
        symbol: 'FLUX',
        decimals: 8,
        // node: backends().flux.node,
        slip: 19167,
        scriptType: 'p2sh',
        messagePrefix: '\u0018Zelcash Signed Message:\n',
        pubKeyHash: '1cb8',
        scriptHash: '1cbd',
        wif: '80',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        txVersion: 4,
        txGroupID: 0x892f2085,
        backend: 'insight',
        dustLimit: 546, // min utxo amount
        minFeePerByte: 1, // min fee per byte
        feePerByte: 1, // fee per byte
        maxMessage: 80, // 80 bytes in size
        maxTxSize: 1800000, // 1,800,000 vbytes
        rbf: false,
        txExpiryHeight: 30,
    } // 30 blocks, 1 hour
};
export const btc = {
    id: 'btc',
    libid: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    // node: backends().btc.node,
    slip: 0,
    scriptType: 'p2wsh',
    messagePrefix: '\u0018Bitcoin Signed Message:\n',
    pubKeyHash: '00',
    scriptHash: '05',
    wif: '80',
    // logo: btcLogo,
    bip32: {
      public: 0x02aa7ed3,
      private: 0x02aa7a99,
    },
    backend: 'blockbook',
    bech32: 'bc1',
    dustLimit: 546, // min utxo amount
    minFeePerByte: 1, // min fee per byte
    feePerByte: 100, // fee per byte
    maxMessage: 80, // 80 bytes in size
    maxTxSize: 100000, // 100,000 vbytes
    rbf: true,
  };
  // src/lib/atom/config.ts
export const atomConfig = {
    atom: {
        id: 'atom',
        libid: 'tatom',
        name: 'Cosmos',
        symbol: 'ATOM',
        decimals: 6,
        slip: 118, // BIP44 coin type for Cosmos
        messagePrefix: '\u0018Cosmos Signed Message:\n',
        pubKeyHash: 'cosmos', // Prefix for public key hashes
        scriptHash: 'cosmos', // Prefix for script hashes
        wif: '80', // Wallet Import Format
        bip32: {
            public: 0x0488b21e, // BIP32 public key
            private: 0x0488ade4, // BIP32 private key
        },
        dustLimit: 5000, // Minimum UTXO amount
        minFeePerByte: 1, // Minimum fee per byte
        feePerByte: 1000, // Fee per byte
        maxMessage: 256, // Maximum message size
        maxTxSize: 200000, // Maximum transaction size
        rbf: false, // Replace-By-Fee
        txExpiryHeight: 100, // Transaction expiry height
    }
};
  
