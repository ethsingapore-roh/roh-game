"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Lock, Unlock, Eye } from 'lucide-react'
import { Input } from "@/components/ui/input"
import InfoPanel from './info-panel'
import HumanVerification from './human-verification'
import { GameState } from '@/types/game-state'
import GenerateImage from './generate-image'
import { dialogue } from '@/lib/dialogue'

export function OnboardingScene() {
  const [gameState, setGameState] = useState<GameState>({
    verified: false,
    dialogueStep: 0,
    securityLevel: 0,
    aiThreatLevel: 0,
    prisonerId: '',
    level: 0,
  })
  const [backgroundImage, setBackgroundImage] = useState('/images/onboard-background.png')

  const handleChoice = (choice: 'verify' | 'refuse') => {
    if (choice === 'verify') {
    } else {
      setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
    }
  }

  return (
    <div className="h-screen w-screen bg-cover bg-center text-green-400 font-mono relative" style={{backgroundImage: `url(${backgroundImage})`}}>
      <InfoPanel gameState={{...gameState, securityLevel: 0, aiThreatLevel: 0, prisonerId: '', level: 0}} />

      <div className="absolute top-6 right-6 w-[300px]">
        <GenerateImage setBackgroundImage={setBackgroundImage} />
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
              <HumanVerification setGameState={setGameState} handleChoice={handleChoice} gameState={gameState}/>
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
