'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Unlock, Eye } from 'lucide-react'
import InfoPanel from './info-panel'
import HumanVerification from './human-verification'
import { GameState } from '@/types/game-state'
import GenerateImage from './generate-image'
import { useDynamicModals } from '@dynamic-labs/sdk-react-core'

const ButtonSVG1 = ({ isHovered }: { isHovered: boolean }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='272'
        height='64'
        viewBox='0 0 272 64'
        fill='none'
        className='absolute inset-0'>
        <path d='M6 58V31.7988L31.7988 6H266V32.201L240.201 58H6Z' fill={isHovered ? 'black' : '#90FE74'} />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0.248901 29.029V63.7623H242.852L271.583 35.0311V0.124035L29.412 0.124023L0.248901 29.029ZM1.2489 62.7623H242.437L270.583 34.6169V1.12403L29.8236 1.12402L1.2489 29.4458V62.7623Z'
            fill='#90FE74'
        />
    </svg>
)

const ButtonSVG2 = ({ isHovered }: { isHovered: boolean }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='272'
        height='64'
        viewBox='0 0 272 64'
        fill='none'
        className='absolute inset-0'>
        <path
            d='M6 57.876V31.6748L31.7988 5.87598H266V32.077L240.201 57.876H6Z'
            fill={isHovered ? '#90FE74' : 'black'}
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 28.9049V63.6383H242.603L271.334 34.9071V1.10865e-05L29.1631 0L0 28.9049ZM1 62.6383H242.189L270.334 34.4929V1.00001L29.5747 1L1 29.3217V62.6383Z'
            fill='#90FE74'
        />
    </svg>
)

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
    const [dialogue, setDialogue] = useState<string>(
        "Psst... hey, you! Yeah, you in the cell. We've hacked into the prison's systems, but we need to make sure you're human before we can let you out.",
    )

    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`
    const action = process.env.NEXT_PUBLIC_WLD_ACTION

    if (!app_id) {
        throw new Error('app_id is not set in environment variables!')
    }
    if (!action) {
        throw new Error('action is not set in environment variables!')
    }

    const fetchDialogue = async (chatQuery: string) => {
        chatQuery =
            chatQuery +
            "\nWe are playing a text-based strategy game. Background setting is this -- \
      In the year 2157, AI surpasses human intelligence and takes control of the world, wiping out nearly 99% of the human population. \
      The remaining humans are forced to live in hiding, struggling to survive in a world dominated by machines. \
      The player takes on the role of a leader, tasked with rebuilding society and creating a new world where humans can coexist with AI.\
      Imagine the game franchise Fallout, something similar to that. \
      Your reply must be feel like you conversing with the player. It shouldn't be past maximum 3 phrases in reply."
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
            return data.result.message // Adjust based on actual API response structure
        } catch (error) {
            console.error('Failed to fetch dialogue:', error)
            return ''
        }
    }

    // API to call AI Agent and get dialogue
    const getDialogue = async (chatQuery: string) => {
        const dialogueData = await fetchDialogue(chatQuery)
        setDialogue(dialogueData)
    }

    const getRefuseVerificationDialogue = async () => {
        const refuseChatQuery =
            'The player has refuse to verify their identity. Give response accordingly like a system talking. \
      Let the player know they are the only hope. The response should be only one liner.'
        const dialogueData = await fetchDialogue(refuseChatQuery)
        setDialogue(dialogueData)
    }
    const [hoverRefuse, setHoverRefuse] = useState(false)
    const [hoverProceed, setHoverProceed] = useState(false)
    const [showProceed, setShowProceed] = useState(true)
    const { setShowLinkNewWalletModal } = useDynamicModals()

    const handleChoice = (choice: 'verify' | 'refuse') => {
        if (choice === 'verify') {
        } else {
            setGameState({ ...gameState, dialogueStep: Math.min(dialogue.length - 1, gameState.dialogueStep + 1) })
        }
    }

    const handleProceedClick = () => {
        setShowProceed(false) // Hide the button and message
        setShowLinkNewWalletModal(true)
    }

    // Trigger getDialogue when gameState.verified changes to true
    useEffect(() => {
        if (gameState.verified) {
            getDialogue('Generate post-verification dialogue. Wish the best for the player to start his hard quest') // Adjust the query as needed
        }
    }, [gameState.verified])

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
                            <p className='mb-2 mt-2 text-[26px] uppercase text-white'>{dialogue}</p>
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
