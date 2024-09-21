"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock, Unlock, Eye, Shield } from 'lucide-react'
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit'
import { verifyHuman } from '@/actions/verify-human'
import { DialogTitle } from '@radix-ui/react-dialog'


export function OnboardingScene() {
  const [gameState, setGameState] = useState({
    verified: false,
    dialogueStep: 0,
  })

  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
  const action = process.env.NEXT_PUBLIC_WLD_ACTION

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!")
  }
  if (!action) {
    throw new Error("action is not set in environment variables!")
  }

  const dialogue = [
    "Psst... hey, you! Yeah, you in the cell. We've hacked into the prison's systems, but we need to make sure you're human before we can let you out.",
    "The AIs have eyes and ears everywhere. We need to use a secure method to verify your humanity. Have you heard of Worldcoin?",
    "It's our only shot at beating the machines. We need to know we can trust you. Will you undergo the verification?",
    "I understand your hesitation, but we can't risk freeing an AI agent. The fate of humanity depends on this. Please, reconsider.",
  ]

  const handleChoice = (choice: 'verify' | 'refuse') => {
    if (choice === 'verify') {
    } else {
      setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
    }
  }

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
        setGameState({ verified: true, dialogueStep: 0 })
      } else {
        console.error("Verification failed:", verificationResult.detail)
      }
    } catch (error) {
      console.error("Error during verification:", error)
    }
  }

  return (
    <div className="h-screen w-screen bg-[url('/images/onboard-background.png')] bg-cover bg-center text-green-400 font-mono relative">
  
      <div className="absolute top-6 left-6 w-[600px] h-[700px] bg-[url('/images/dashboard.svg')] bg-no-repeat bg-contain p-4 flex flex-col">
      <p className="text-xl text-center align-middle mt-[4px] justify-center"> Level 1</p>
      <div className="flex flex-col ml-[32px] mt-[10%]">
        <h2 className="text-2xl mb-4  flex items-center"><AlertCircle className="mr-2" /> System Status</h2>
        <p className="mb-2">Prisoner ID: #45721</p>
        <p className="mb-2">Security Level: Maximum</p>
        <p className="mb-2">AI Threat Level: Critical</p>
        <p className="mb-2">Verification Status: {gameState.verified ? 'Confirmed Human' : 'Unverified'}</p>
        <div className="mt-auto">
          <p className="text-xs opacity-50">Neo-Tokyo Correctional Facility</p>
          <p className="text-xs opacity-50">Year 2049</p>
        </div>
      </div>
      </div>

      {/* Bottom div spanning the entire width */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-black bg-opacity-50 p-4">
        <div className="border border-green-400 rounded-lg p-4 flex flex-col h-full">
          <div className="flex-grow mb-4 overflow-y-auto">
            <h2 className="text-2xl mb-2 flex items-center"><Eye className="mr-2" /> Incoming Transmission</h2>
            <p className="mb-2">{dialogue[gameState.dialogueStep]}</p>
          </div>
          {!gameState.verified && (
            <div className="flex justify-between">
              <IDKitWidget
                action={action}
                app_id={app_id}
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
              <Button onClick={() => handleChoice('refuse')} className="bg-red-700 hover:bg-red-600">
                <Lock className="mr-2" /> Refuse Verification
              </Button>
            </div>
          )}
          {gameState.verified && (
            <div className="text-center">
              <p className="text-xl text-yellow-400 mb-2">Verification Successful!</p>
              <Button className="bg-blue-700 hover:bg-blue-600">
                <Unlock className="mr-2" /> Proceed to Freedom
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
