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
  
