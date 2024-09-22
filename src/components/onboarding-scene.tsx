'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Lock, Unlock, Eye } from 'lucide-react'
import InfoPanel from './info-panel'
import HumanVerification from './human-verification'
import { GameState } from '@/types/game-state'
import GenerateImage, { generateImageFromPrompt } from './generate-image'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { ButtonSVG2 } from './button-2'
import { ButtonSVG1 } from './button-1'

export function OnboardingScene() {
    const [gameState, setGameState] = useState<GameState>({
        verified: false,
        dialogueStep: 0,
        securityLevel: 0,
        aiThreatLevel: 0,
        prisonerId: '',
        level: 0,
    })
    const [hoverRefuse, setHoverRefuse] = useState(false)
    const [hoverProceed, setHoverProceed] = useState(false)
    const [showProceed, setShowProceed] = useState(true)
    const [backgroundImage, setBackgroundImage] = useState('/images/onboard-background.png')
    const [dialogue, setDialogue] = useState<string>(
        "Psst... hey, you! Yeah, you in the cell. We've hacked into the prison's systems, but we need to make sure you're human before we can let you out.",
    )
    const [response, setResponse] = useState<{ error?: string } | null>(null)

    const { setShowAuthFlow } = useDynamicContext()

    const fetchDialogue = async (chatQuery: string) => {
        chatQuery =
            chatQuery +
            "\nWe are playing a text-based strategy game. Background setting is this -- \
      In the year 2157, AI surpasses human intelligence and takes control of the world, wiping out nearly 99% of the human population. \
      The remaining humans are forced to live in hiding, struggling to survive in a world dominated by machines. \
      The player takes on the role of a leader, tasked with rebuilding society and creating a new world where humans can coexist with AI.\
      Imagine the game franchise Fallout, something similar to that. It shouldn't be past maximum 3 phrases in reply. \
      Do not try to format the font"
        try {
            const response = await fetch('/api/fetch-dialogue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatQuery }),
            })
            const data = await response.json()
            console.log(data)
            // Generate and set background image based on dialogue
            const imagePrompt = baseImagePrompt + data.result.message
            const imageUrl = await generateImageFromPrompt(imagePrompt)
            console.log('imageUrl', imageUrl)
            console.log('imagePrompt', imagePrompt)
            if (imageUrl) {
                setBackgroundImage(imageUrl)
            }
            return data.result.message // Adjust based on actual API response structure
        } catch (error) {
            console.error('Failed to fetch dialogue:', error)
            return ''
        }
    }

    const sendTransaction = async () => {
        const requestBody = {
            data: 'data',
        }
        try {
            const res = await fetch('/api/send-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            const result = await res.json()
            setResponse(result)
        } catch (error) {
            console.error('Error sending transaction:', error)
            setResponse({ error: 'Failed to send transaction' })
        }
    }

    const baseImagePrompt = 'A post-apocalyptic world where humans are enslaved by AI in Marina Bay Sands, '

    // API to call AI Agent and get dialogue
    const getDialogue = async (chatQuery: string) => {
        const dialogueData = await fetchDialogue(chatQuery)
        setDialogue(dialogueData)
    }

    const getRefuseVerificationDialogue = async () => {
        const refuseChatQuery =
            'The player has refuse to verify their identity. Give response accordingly like a system talking. \
      Let the player know they are the only hope. The response should be only one liner. Your reply must be feel like you conversing with the player.'
        const dialogueData = await fetchDialogue(refuseChatQuery)
        setDialogue(dialogueData)
        // await sendTransaction()
    }

    const handleChoice = (choice: 'verify' | 'refuse') => {
        if (choice === 'verify') {
        } else {
            setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
        }
    }

    const handleProceedClick = () => {
        setShowProceed(false) // Hide the button and message
        setShowAuthFlow(true)
    }

    // Trigger getDialogue when gameState.verified changes to true
    useEffect(() => {
        if (gameState.verified) {
            getDialogue(
                'Generate post-verification dialogue. Wish the best for the player to start his hard quest. \
              Your reply must be feel like you conversing with the player.\
              After that conversation, you become a narrator and tell player the current world situation \
              and generate 4 options for the player to choose from to proceed the game, each option is numbered and seperated by new line',
            )
        }
    }, [gameState, getDialogue])

    return (
        <div
            className='relative h-screen w-screen bg-cover bg-center font-mono text-[#90FE74]'
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            <InfoPanel gameState={{ ...gameState, securityLevel: 0, aiThreatLevel: 0, prisonerId: '', level: 0 }} />

            <div className='absolute right-6 top-6 w-[300px]'>
                <GenerateImage setBackgroundImage={setBackgroundImage} />
            </div>

            {/* Bottom div spanning the entire width */}
            <div className='absolute bottom-0 left-0 right-0 h-[38%] bg-black bg-opacity-50 p-4 backdrop-blur-sm'>
                <div className='flex h-full flex-col rounded-lg border border-[#90FE74] p-4'>
                    <div className='mb-4 flex-grow overflow-y-auto'>
                        <h2 className='mb-1 flex items-center text-2xl'>
                            <Eye className='mr-1' /> Incoming Transmission...
                        </h2>
                        {!gameState.verified || !showProceed ? (
                            <pre
                                className='mb-2 mt-2 text-[26px] uppercase text-white'
                                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                {dialogue}
                            </pre>
                        ) : null}
                    </div>
                    {!gameState.verified && (
                        <div className='mt-auto flex justify-end gap-6 pb-1 pr-1'>
                            <HumanVerification
                                setGameState={setGameState}
                                handleChoice={handleChoice}
                                gameState={gameState}
                            />
                            <button
                                onClick={() => getRefuseVerificationDialogue()}
                                onMouseEnter={() => setHoverRefuse(true)}
                                onMouseLeave={() => setHoverRefuse(false)}
                                className='relative h-[64px] w-[272px] text-lg uppercase'>
                                <ButtonSVG2 isHovered={hoverRefuse} />
                                <span
                                    className={`relative z-10 flex h-full items-center justify-center ${hoverRefuse ? 'text-black' : ''}`}>
                                    <Lock className='mr-1' /> Refuse Verification
                                </span>
                            </button>
                        </div>
                    )}
                    {gameState.verified && showProceed && (
                        <div className='text-center'>
                            <p className='mb-3 text-xl text-[#90FE74]'>Verification Successful!</p>
                            <button
                                onClick={() => handleProceedClick()}
                                onMouseEnter={() => setHoverProceed(true)}
                                onMouseLeave={() => setHoverProceed(false)}
                                className='relative mx-auto h-[64px] w-[272px] text-lg uppercase'>
                                <ButtonSVG1 isHovered={hoverProceed} />
                                <span
                                    className={`relative z-10 flex h-full items-center justify-center ${hoverProceed ? 'text-[#90FE74]' : 'text-black'}`}>
                                    <Unlock className='mr-2' /> Proceed to Freedom
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
