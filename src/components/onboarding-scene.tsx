"use client"

import React, { useState } from 'react'
import { Lock, Unlock, Eye } from 'lucide-react'
import InfoPanel from './info-panel'
import HumanVerification from './human-verification'
import { GameState } from '@/types/game-state'
import GenerateImage from './generate-image'

const ButtonSVG1 = ({ isHovered }: { isHovered: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="272" height="64" viewBox="0 0 272 64" fill="none" className="absolute inset-0">
    <path d="M6 58V31.7988L31.7988 6H266V32.201L240.201 58H6Z" fill={isHovered ? "black" : "#90FE74"}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0.248901 29.029V63.7623H242.852L271.583 35.0311V0.124035L29.412 0.124023L0.248901 29.029ZM1.2489 62.7623H242.437L270.583 34.6169V1.12403L29.8236 1.12402L1.2489 29.4458V62.7623Z" fill="#90FE74"/>
  </svg>
);

const ButtonSVG2 = ({ isHovered }: { isHovered: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="272" height="64" viewBox="0 0 272 64" fill="none" className="absolute inset-0">
    <path d="M6 57.876V31.6748L31.7988 5.87598H266V32.077L240.201 57.876H6Z" fill={isHovered ? "#90FE74" : "black"}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M0 28.9049V63.6383H242.603L271.334 34.9071V1.10865e-05L29.1631 0L0 28.9049ZM1 62.6383H242.189L270.334 34.4929V1.00001L29.5747 1L1 29.3217V62.6383Z" fill="#90FE74"/>
  </svg>
);

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
      Game background setting of post-apocalyptic world. Keep the reply short in one line, try to feel like you are talking to someone.");
    console.log("chat query:", chatQuery);
    await getDialogue();
  }
  const [hoverRefuse, setHoverRefuse] = useState(false)
  const [hoverProceed, setHoverProceed] = useState(false)

  const handleChoice = (choice: 'verify' | 'refuse') => {
    if (choice === 'verify') {
    } else {
      setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
    }
  }

  return (
    <div className="h-screen w-screen bg-cover bg-center text-[#90FE74] font-mono relative" style={{backgroundImage: `url(${backgroundImage})`}}>
      <InfoPanel gameState={{...gameState, securityLevel: 0, aiThreatLevel: 0, prisonerId: '', level: 0}} />

      <div className="absolute top-6 right-6 w-[300px]">
        <GenerateImage setBackgroundImage={setBackgroundImage} />
      </div>

      {/* Bottom div spanning the entire width */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] backdrop-blur-sm bg-black bg-opacity-50 p-4">
        <div className="border border-[#90FE74] rounded-lg p-4 flex flex-col h-full">
          <div className="flex-grow mb-4 overflow-y-auto">
            <h2 className="text-2xl mb-1 flex items-center"><Eye className="mr-1" /> Incoming Transmission</h2>
            <p className="mb-2 text-[26px] text-white uppercase mt-2">{dialogue}</p>
          </div>
          {!gameState.verified && (
            <div className="mt-auto flex justify-end gap-6 pr-1 pb-1">
              <HumanVerification setGameState={setGameState} handleChoice={handleChoice} gameState={gameState}/>
              <button
                onClick={() => getRefuseVerificationDialogue()}
                onMouseEnter={() => setHoverRefuse(true)}
                onMouseLeave={() => setHoverRefuse(false)}
                className="relative w-[272px] h-[64px] text-lg uppercase"
              >
                <ButtonSVG2 isHovered={hoverRefuse} />
                <span className={`relative z-10 flex items-center justify-center h-full ${hoverRefuse ? 'text-black' : ''}`}>
                  <Lock className="mr-1" /> Refuse Verification
                </span>
              </button>
            </div>
          )}
          {gameState.verified && (
            <div className="text-center">
              <p className="text-xl text-[#90FE74] mb-3">Verification Successful!</p>
              <button
                onMouseEnter={() => setHoverProceed(true)}
                onMouseLeave={() => setHoverProceed(false)}
                className="relative w-[272px] h-[64px] text-lg uppercase mx-auto"
              >
                <ButtonSVG1 isHovered={hoverProceed} />
                <span className={`relative z-10 flex items-center justify-center h-full ${hoverProceed ? 'text-[#90FE74]' : 'text-black'}`}>
                  <Unlock className="mr-2" /> Proceed to Freedom
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
