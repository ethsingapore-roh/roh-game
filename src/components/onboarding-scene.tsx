"use client"

import React, { useState, useEffect } from 'react'
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
  const [prompt, setPrompt] = useState('')
  const [chatQuery, setChatQuery] = useState<string>('');
  const [dialogue, setDialogue] = useState<string>('');

  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
  const action = process.env.NEXT_PUBLIC_WLD_ACTION

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!")
  }
  if (!action) {
    throw new Error("action is not set in environment variables!")
  }

  const fetchDialogue = async (chatQuery: string) => {
    try {
      const response = await fetch('/api/fetch-dialogue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatQuery })
      });
      const data = await response.json();
      console.log(data);
      return data.result.message; // Adjust based on actual API response structure
    } catch (error) {
      console.error('Failed to fetch dialogue:', error);
      return '';
    }
  };

  // API to call AI Agent and get dialogue
  const getDialogue = async () => {
    const dialogueData = await fetchDialogue(chatQuery);
    setDialogue(dialogueData);
  };

  const getRefuseVerificationDialogue = async () => {
    setChatQuery("The player has refuse to verify their identity. Give response accordingly with a tone of system talking. \
      Game background setting of post-apocalyptic world. Keeping reply short in one line, try to feel like you are talking to someone.");
    console.log("chat query:", chatQuery);
    await getDialogue();
  }

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
            <p className="mb-2">{dialogue}</p>
          </div>
          {!gameState.verified && (
            <div className="flex justify-between">
              <HumanVerification setGameState={setGameState} handleChoice={handleChoice} gameState={gameState}/>
              <Button onClick={() => getRefuseVerificationDialogue()} className="bg-red-700 hover:bg-red-600">
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
