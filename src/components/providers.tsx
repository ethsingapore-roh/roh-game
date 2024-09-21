'use client'

import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { flowTestnet } from 'viem/chains'
import { FlowWalletConnectors } from '@dynamic-labs/flow'

if (!process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID) {
    throw new Error('NEXT_PUBLIC_DYNAMIC_ENV_ID is not set')
}

const config = createConfig({
    chains: [flowTestnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [flowTestnet.id]: http(),
    },
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <DynamicContextProvider
            theme={'dark'}
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
                walletConnectors: [FlowWalletConnectors],
            }}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>
                        <DynamicWidget />
                        {children}
                    </DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    )
}
