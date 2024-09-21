import { AlertCircle } from 'lucide-react'
import type { GameState } from '@/types/game-state'

export default function InfoPanel({ gameState }: { gameState: GameState }) {
    return (
        <div className="absolute left-6 top-6 flex h-[500px] w-[400px] flex-col bg-[url('/images/dashboard1.svg')] bg-contain bg-no-repeat p-4">
            <p className='text-l relative bottom-[3px] justify-center text-center align-middle'> Level 1</p>
            <div className='ml-[32px] mt-[10%] flex flex-col'>
                <h2 className='mb-4 flex items-center text-2xl'>
                    <AlertCircle className='mr-2' /> System Status
                </h2>
                <p className='mb-2'>Prisoner ID: #45721</p>
                <p className='mb-2'>Security Level: Maximum</p>
                <p className='mb-2'>AI Threat Level: Critical</p>
                <p className='mb-2'>Verification Status: {gameState.verified ? 'Confirmed Human' : 'Unverified'}</p>
                <div className='mt-auto'>
                    <p className='text-xs opacity-50'>Marina Bay Correctional Facility</p>
                    <p className='text-xs opacity-50'>Year 2049</p>
                </div>
            </div>
        </div>
    )
}
