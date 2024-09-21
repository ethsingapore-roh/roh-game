'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { OnboardingScene } from './onboarding-scene'

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

const GameMenu: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false)
    const [hoverContinue, setHoverContinue] = useState(false)
    const [hoverNewGame, setHoverNewGame] = useState(false)

    const handleStartGame = () => {
        setGameStarted(true)
    }

    if (gameStarted) {
        return <OnboardingScene />
    }

    return (
        <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden'>
            <Image src='/images/background.png' alt='Background' fill className='object-cover' quality={100} priority />
            <div className='MainContainer absolute flex h-[888px] w-[1397px] flex-col items-center justify-center rounded-[49px] border border-[#346631] bg-black/60 backdrop-blur-[17.55px]'>
                <Image
                    className='Union absolute right-[87px] top-[101px] h-[682px] w-[270px]'
                    src='/images/right-hero.svg'
                    width={270}
                    height={682}
                    alt='Right hero'
                />
                <Image
                    className='Union absolute left-[87px] top-[101px] h-[686px] w-[232px]'
                    src='/images/left-hero.svg'
                    width={232}
                    height={686}
                    alt='Left hero'
                />
                <div className='Subtittle mb-8 text-center font-mona-sans text-xl font-normal capitalize leading-[30px] tracking-[20.20px] text-[#7dff68]'>
                    WELCOME TO
                </div>
                <div className='YourLive mb-6 w-[1114px] text-center'>
                    <span className='font-monument text-[99.02px] font-normal leading-[121.79px] text-white'>
                        REBIRTH OF{' '}
                    </span>
                    <span className='font-monument text-[99.02px] font-normal leading-[123%] text-transparent [-webkit-text-stroke:1.4px_#FFF]'>
                        HUMANITY
                    </span>
                </div>
                <div className='Subtittle mb-12 w-[611px] text-center font-mona-sans text-2xl font-semibold uppercase leading-9 text-white'>
                    shaping a future where humans and machines either unite or collide.
                </div>
                <div className='flex justify-center space-x-6'>
                    <div
                        className='NewGameButton relative h-[69.02px] w-[276.10px] cursor-pointer'
                        onClick={handleStartGame}
                        onMouseEnter={() => setHoverNewGame(true)}
                        onMouseLeave={() => setHoverNewGame(false)}>
                        <ButtonSVG2 isHovered={hoverNewGame} />
                        <span
                            className={`absolute inset-0 flex items-center justify-center text-center font-mona-sans text-xl font-bold uppercase tracking-[5px] ${hoverNewGame ? 'text-black' : 'text-[#90FE74]'}`}>
                            New Game
                        </span>
                    </div>
                    <div
                        className='ContinueButton relative h-[69.02px] w-[276.10px] cursor-pointer'
                        onClick={handleStartGame}
                        onMouseEnter={() => setHoverContinue(true)}
                        onMouseLeave={() => setHoverContinue(false)}>
                        <ButtonSVG1 isHovered={hoverContinue} />
                        <span
                            className={`absolute inset-0 flex items-center justify-center text-center font-mona-sans text-xl font-bold uppercase tracking-[5px] ${hoverContinue ? 'text-[#90FE74]' : 'text-black'}`}>
                            Continue
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameMenu
