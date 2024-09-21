"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { OnboardingScene } from './onboarding-scene';

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

const GameMenu: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [hoverContinue, setHoverContinue] = useState(false);
  const [hoverNewGame, setHoverNewGame] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    return <OnboardingScene />;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center relative overflow-hidden">
    <Image
      src="/images/background.png"
      alt="Background"
      layout="fill"
      objectFit="cover"
      quality={100}
      priority
    />
      <div className="MainContainer w-[1552px] h-[987px] flex justify-center items-center absolute bg-black/60 rounded-[54px] border border-[#346631] backdrop-blur-[19.50px]">
        <Image className="Union w-[299.86px] h-[757.89px] left-[1156.14px] top-[112.11px] absolute" src="/images/right-hero.svg" width={300} height={758} alt="Right hero" />
        <Image className="Union w-[257.77px] h-[761.76px] left-[97px] top-[112.11px] absolute" src="/images/left-hero.svg" width={258} height={762} alt="Left hero" />
        <div className="YourLive w-[1114px] h-[295px] left-[219px] top-[293px] absolute text-center">
          <span style={{ color: 'white', fontSize: '99.02px', fontWeight: 'normal', fontFamily: 'Monument Extended', lineHeight: '121.79px' }}>REBIRTH OF </span>
          <span style={{ color: 'transparent',
    fontSize: '99.02px',
    fontFamily: 'Monument Extended',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '123%',
    WebkitTextStroke: '1.4px #FFF', }}>HUMANITY</span>
        </div>
        <div className="Subtittle w-[611px] left-[470.50px] top-[561.50px] absolute text-center text-white text-2xl font-semibold font-['Mona-Sans'] uppercase leading-9">shaping a future where humans and machines either unite or collide.</div>
        <div 
          className="ContinueButton w-[276.10px] h-[69.02px] left-[782.40px] top-[682px] absolute cursor-pointer" 
          onClick={handleStartGame}
          onMouseEnter={() => setHoverContinue(true)}
          onMouseLeave={() => setHoverContinue(false)}
        >
          <ButtonSVG1 isHovered={hoverContinue} />
          <span className={`relative z-10 flex items-center justify-center w-full h-full text-center font-['Mona-Sans'] text-xl font-bold tracking-[5px] uppercase ${hoverContinue ? 'text-[#90FE74]' : 'text-black'}`}>
            Continue
          </span>
        </div>
        <div 
          className="NewGameButton w-[276.10px] h-[69.02px] left-[492.50px] top-[682px] absolute cursor-pointer" 
          onClick={handleStartGame}
          onMouseEnter={() => setHoverNewGame(true)}
          onMouseLeave={() => setHoverNewGame(false)}
        >
          <ButtonSVG2 isHovered={hoverNewGame} />
          <span className={`relative z-10 flex items-center justify-center w-full h-full text-center font-['Mona-Sans'] text-xl font-bold tracking-[5px] uppercase ${hoverNewGame ? 'text-black' : 'text-[#90FE74]'}`}>
            New Game
          </span>
        </div>
        <div className="Subtittle left-[612px] top-[235px] absolute text-center text-[#7dff68] text-xl font-normal font-['Mona-Sans'] capitalize leading-[30px] tracking-[20.20px]">WELCOME TO</div>
      </div>
    </div>
  );
};

export default GameMenu;