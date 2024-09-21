"use server"

import { VerificationLevel } from "@worldcoin/idkit-core"
import { verifyCloudProof } from "@worldcoin/idkit-core/backend"

export type VerifyReply = {
  success: boolean
  code?: string
  attribute?: string | null
  detail?: string
}

interface IVerifyRequest {
  proof: {
    nullifier_hash: string
    merkle_root: string
    proof: string
    verification_level: VerificationLevel
  }
  signal?: string
}

const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
const action = process.env.NEXT_PUBLIC_WLD_ACTION as string

export async function verifyHuman(
  proofData: {
    proof: string;
    merkle_root: string;
    nullifier_hash: string;
    verification_level: VerificationLevel;
  }
): Promise<VerifyReply> {
  console.log("Verifying proof:", proofData)
  const verifyRes = await verifyCloudProof(proofData, app_id, action)
  if (verifyRes.success) {
    console.log("Human verified")
    return { success: true }
  } else {
    console.log("Human not verified", verifyRes)
    return { success: false, code: verifyRes.code, attribute: verifyRes.attribute, detail: verifyRes.detail }
  }
}
