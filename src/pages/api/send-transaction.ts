import '@phala/wapo-env'
import { privateKeyToAccount } from 'viem/accounts'
import { getContract } from 'viem'
import {
    keccak256,
    http,
    createPublicClient,
    PrivateKeyAccount,
    createWalletClient,
} from 'viem'
import { flowTestnet } from 'viem/chains'
import abi from './abi.json'
import { NextApiRequest, NextApiResponse } from 'next'

const publicClient = createPublicClient({
    chain: flowTestnet,
    transport: http(),
})
const walletClient = createWalletClient({
    chain: flowTestnet,
    transport: http(),
})

function getECDSAAccount(salt: string): PrivateKeyAccount {
    const derivedKey = Wapo.deriveSecret(salt)
    const keccakPrivateKey = keccak256(derivedKey)
    return privateKeyToAccount(keccakPrivateKey)
}

async function sendTransaction(account: PrivateKeyAccount): Promise<any> {
    const contract = getContract({
        address: '0x3D22ED8Da1684f9D76fD401B85b053B3C5EcAA30',
        abi: abi.abi,
        client: { public: publicClient, wallet: walletClient }
    })

    const hash = await contract.write.updateHealth([0xbE92f2692f42580300fD8d0Ee198b5bBbe303e78, 50]);

    let result = {
        derivedPublicKey: account.address,
        to: "0x3D22ED8Da1684f9D76fD401B85b053B3C5EcAA30",
        hash: '',
        receipt: {}
    }
    console.log(`Transaction Hash: ${hash}`)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log(`Transaction Status: ${receipt.status}`)
    result.hash = hash
    result.receipt = receipt
    return result
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { data } = req.body
        const secretSalt = process.env.SALT || ''
        const account = getECDSAAccount(secretSalt)

        if (!secretSalt) {
            console.log("no salt");
            return res.status(500).json({ error: 'API key is not set in environment variables' })
        }

        try {
            let result = {
                message: '',
            }
            result.message = await sendTransaction(account);
            res.status(200).json({ result })
        } catch (error) {
            res.status(500).json({ error: 'Failed to send transaction' })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}
