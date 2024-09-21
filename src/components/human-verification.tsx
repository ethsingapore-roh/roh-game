import { IDKitWidget } from "@worldcoin/idkit"
import { ISuccessResult, VerificationLevel } from "@worldcoin/idkit-core"
import { Shield } from "lucide-react"
import { GameState } from "@/types/game-state"
import { verifyHuman } from "@/actions/verify-human"
import { useState } from "react"

const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
const action = process.env.NEXT_PUBLIC_WLD_ACTION

if (!app_id) {
  throw new Error("app_id is not set in environment variables!")
}
if (!action) {
  throw new Error("action is not set in environment variables!")
}

const ButtonSVG1 = ({ isHovered }: { isHovered: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="272" height="64" viewBox="0 0 272 64" fill="none" className="absolute inset-0">
    <path d="M6 58V31.7988L31.7988 6H266V32.201L240.201 58H6Z" fill={isHovered ? "black" : "#90FE74"}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0.248901 29.029V63.7623H242.852L271.583 35.0311V0.124035L29.412 0.124023L0.248901 29.029ZM1.2489 62.7623H242.437L270.583 34.6169V1.12403L29.8236 1.12402L1.2489 29.4458V62.7623Z" fill="#90FE74"/>
  </svg>
);

export default function HumanVerification({setGameState, handleChoice}: {gameState: GameState, setGameState: (gameState: GameState) => void, handleChoice: (choice: 'verify' | 'refuse') => void}) {
    const [isHovered, setIsHovered] = useState(false);

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
            <button 
              onClick={() => {
                handleChoice('verify')
                open()
              }} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-[272px] h-[64px] text-lg uppercase text-black"
            >
              <ButtonSVG1 isHovered={isHovered} />
              <span className={`relative z-10 flex items-center justify-center h-full ${isHovered ? 'text-[#90FE74]' : ''}`}>
                <Shield className="mr-2" /> Verify Humanity
              </span>
            </button>
        )}
      </IDKitWidget>
    )
}