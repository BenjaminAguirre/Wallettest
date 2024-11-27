// import localForage from 'localforage';

// interface Backend {
//   node: string;
//   api?: string;
//   explorer?: string;
// }
// type backends = Record<string, Backend>;

// let localForgeBackends: backends = {};

// export function loadBackendsConfig() {
//   (async () => {
//     const localForgeBackendsStorage: backends =
//       (await localForage.getItem('backends')) ?? {};
//     if (localForgeBackendsStorage) {
//       localForgeBackends = localForgeBackendsStorage;
//     }
//   })().catch((error) => {
//     console.error(error);
//   });
// }

// loadBackendsConfig();

// // *** BACKENDS ***
// const assetBackends: backends = {
//   flux: {
//     node: 'explorer.runonflux.io',
//   },
//   fluxTestnet: {
//     node: 'testnet.runonflux.io',
//   },
// };

// export function backends() {
//   const backendKeys = Object.keys(assetBackends);
//   const currentBackends: backends = backendKeys.reduce((acc, key) => {
//     acc[key] = localForgeBackends[key] || assetBackends[key];
//     return acc;
//   }, {} as backends);
//   return currentBackends;
// }

// export function backendsOriginal() {
//   return assetBackends;
// }