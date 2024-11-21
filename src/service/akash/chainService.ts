import { StargateClient } from "@cosmjs/stargate";

//uakt

//akashnet-2

async function getChainInfo(address: string){
    const stargateClient = await StargateClient.connect("https://rpc.akash.forbole.com:443");
    const balance = await stargateClient.getAllBalances(address);
    console.log(balance);
    return balance;
}


export default getChainInfo;
