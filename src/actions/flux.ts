'use server'

import Replicate from 'replicate'

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

export async function generateImage(prompt: string): Promise<string | null> {
    try {
        const output = await replicate.run('black-forest-labs/flux-schnell', { input: { prompt: prompt } })

        if (Array.isArray(output) && output.length > 0) {
            return output[0] as string
        }

        return null
    } catch (error) {
        console.error('Error generating image:', error)
        return null
    }
}
