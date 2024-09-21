import { IDKitWidget } from "@worldcoin/idkit"
import { ISuccessResult, VerificationLevel } from "@worldcoin/idkit-core"
import { Shield } from "lucide-react"
import { Button } from "./ui/button"
import { GameState } from "@/types/game-state"
import { verifyHuman } from "@/actions/verify-human"

const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
const action = process.env.NEXT_PUBLIC_WLD_ACTION

if (!app_id) {
  throw new Error("app_id is not set in environment variables!")
}
if (!action) {
  throw new Error("action is not set in environment variables!")
}

export default function HumanVerification({setGameState, handleChoice}: {gameState: GameState, setGameState: (gameState: GameState) => void, handleChoice: (choice: 'verify' | 'refuse') => void}) {
    const onSuccess = async (result: ISuccessResult) => {
        console.log("Proof received from IDKit, sending to backend:\n", JSON.stringify(result))
        try {
          const verificationResult = await verifyHuman({
            proof: result.proof,
            merkle_root: result.merkle_root,
            nullifier_hash: result.nullifier_hash,
            verification_level: result.verification_level
          })
          if (verificationResult.success) {
            console.log("Human verified successfully")
            setGameState({ verified: true, securityLevel: 100, aiThreatLevel: 100, prisonerId: "1234567890", level: 1, dialogueStep: 0 })
          } else {
            console.error("Verification failed:", verificationResult.detail)
          }
        } catch (error) {
          console.error("Error during verification:", error)
        }
    }
    
    return (
        <IDKitWidget
        action={action as string}
        app_id={app_id as `app_${string}`}
        onSuccess={onSuccess}
        handleVerify={(result) => {
          console.log("Proof received in handleVerify:", result)
        }}
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => (
            <Button 
              onClick={() => {
                handleChoice('verify')
                open()
              }} 
              className="bg-green-700 hover:bg-green-600"
              >
            <Shield className="mr-2" /> Verify with World ID
          </Button>
        )}
      </IDKitWidget>
    )
}