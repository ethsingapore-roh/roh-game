import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { handle } from '@phala/wapo-env/guest'
import { privateKeyToAccount } from 'viem/accounts'
import {
  keccak256,
  http,
  type Address,
  createPublicClient,
  PrivateKeyAccount,
  createWalletClient,
  parseAbi,
  encodeFunctionData
} from 'viem'
import { flowTestnet } from 'viem/chains'
import superjson from 'superjson'
import OpenAI from 'openai'

export const app = new Hono()

const publicClient = createPublicClient({
  chain: flowTestnet,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: flowTestnet,
  transport: http(),
})

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Contract ABI (replace with your actual contract ABI)
const contractABI = parseAbi([
  'function updatePlayerAttribute(string attribute, int256 healthChange) public',
])

// Contract address (replace with your actual contract address)
const contractAddress = '0x...' as Address

function getECDSAAccount(salt: string): PrivateKeyAccount {
  const derivedKey = Wapo.deriveSecret(salt)
  const keccakPrivateKey = keccak256(derivedKey)
  return privateKeyToAccount(keccakPrivateKey)
}

async function generatePlayerAttribute(): Promise<{ attribute: string; healthChange: number }> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Generate a random player attribute and associated health point change."
      },
      {
        role: "user",
        content: "Generate a player attribute and health point change."
      }
    ],
    functions: [
      {
        name: "get_player_attribute",
        description: "Get a random player attribute and health point change",
        parameters: {
          type: "object",
          properties: {
            attribute: {
              type: "string",
              description: "A random player attribute (e.g., 'hungry', 'broken leg')"
            },
            healthChange: {
              type: "integer",
              description: "A signed integer representing the health point change"
            }
          },
          required: ["attribute", "healthChange"]
        }
      }
    ],
    function_call: { name: "get_player_attribute" }
  })

  const functionCall = completion.choices[0].message.function_call
  if (functionCall && functionCall.name === "get_player_attribute") {
    const { attribute, healthChange } = JSON.parse(functionCall.arguments || "{}")
    return { attribute, healthChange }
  }

  throw new Error("Failed to generate player attribute")
}

async function prepareUnsignedTransaction(account: PrivateKeyAccount): Promise<any> {
  const { attribute, healthChange } = await generatePlayerAttribute()
  console.log(`Generated attribute: ${attribute}, Health change: ${healthChange}`)

  const data = encodeFunctionData({
    abi: contractABI,
    functionName: 'updatePlayerAttribute',
    args: [attribute, BigInt(healthChange)]
  })

  const unsignedTx = {
    from: account.address,
    to: contractAddress,
    data: data,
    value: 0n,
  }

  return {
    unsignedTx,
    attribute,
    healthChange
  }
}

app.get('/', async (c) => {
  let vault: Record<string, string> = {}
  let result = {}
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" })
  }
  const secretSalt = (vault.secretSalt) ? vault.secretSalt as string : 'SALTY_BAE'
  const account = getECDSAAccount(secretSalt)

  try {
    result = await prepareUnsignedTransaction(account)
  } catch (error) {
    console.error('Error:', error)
    result = { message: error }
  }
  const { json, meta } = superjson.serialize(result)
  return c.json(json)
})

app.post('/', async (c) => {
  const data = await c.req.json()
  console.log('user payload in JSON:', data)
  return c.json(data)
})

export default handle(app)
