"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertCircle, Lock, Unlock, Eye, Shield } from 'lucide-react'

export function OnboardingScene() {
  const [gameState, setGameState] = useState({
    verified: false,
    showModal: false,
    dialogueStep: 0,
  })

  const dialogue = [
    "Psst... hey, you! Yeah, you in the cell. We've hacked into the prison's systems, but we need to make sure you're human before we can let you out.",
    "The AIs have eyes and ears everywhere. We need to use a secure method to verify your humanity. Have you heard of Worldcoin?",
    "It's our only shot at beating the machines. We need to know we can trust you. Will you undergo the verification?",
    "I understand your hesitation, but we can't risk freeing an AI agent. The fate of humanity depends on this. Please, reconsider.",
  ]

  const handleChoice = (choice: 'verify' | 'refuse') => {
    if (choice === 'verify') {
      setGameState({ ...gameState, showModal: true })
    } else {
      setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
    }
  }

  const handleVerification = () => {
    // Simulate Worldcoin verification process
    setTimeout(() => {
      setGameState({ verified: true, showModal: false, dialogueStep: 0 })
    }, 2000)
  }

  return (
    <div className="h-screen w-screen bg-black text-green-400 p-4 grid grid-cols-[1fr,2fr] gap-4 font-mono">
      <div className="border border-green-400 rounded-lg p-4 flex flex-col">
        <h2 className="text-2xl mb-4 flex items-center"><AlertCircle className="mr-2" /> System Status</h2>
        <p className="mb-2">Prisoner ID: #45721</p>
        <p className="mb-2">Security Level: Maximum</p>
        <p className="mb-2">AI Threat Level: Critical</p>
        <p className="mb-2">Verification Status: {gameState.verified ? 'Confirmed Human' : 'Unverified'}</p>
        <div className="mt-auto">
          <p className="text-xs opacity-50">Neo-Tokyo Correctional Facility</p>
          <p className="text-xs opacity-50">Year 2049</p>
        </div>
      </div>
      <div className="grid grid-rows-[2fr,1fr] gap-4">
        <div className="border border-green-400 rounded-lg p-4 flex items-center justify-center bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center">
          <p className="text-2xl bg-black bg-opacity-70 p-4 rounded">Cybernetic Detention Center</p>
        </div>
        <div className="border border-green-400 rounded-lg p-4 flex flex-col">
          <div className="flex-grow mb-4 overflow-y-auto">
            <h2 className="text-2xl mb-2 flex items-center"><Eye className="mr-2" /> Incoming Transmission</h2>
            <p className="mb-2">{dialogue[gameState.dialogueStep]}</p>
          </div>
          {!gameState.verified && (
            <div className="flex justify-between">
              <Button onClick={() => handleChoice('verify')} className="bg-green-700 hover:bg-green-600">
                <Shield className="mr-2" /> Verify with Worldcoin
              </Button>
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

      <Dialog open={gameState.showModal} onOpenChange={(open) => setGameState({ ...gameState, showModal: open })}>
        <DialogContent className="bg-gray-900 text-green-400 border border-green-400">
          <DialogHeader>
            <DialogTitle>Worldcoin Verification</DialogTitle>
            <DialogDescription>
              Please complete the Worldcoin verification process to confirm your humanity.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-40">
            <Button onClick={handleVerification} className="bg-green-700 hover:bg-green-600">
              Start Verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
