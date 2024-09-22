import { generateImage } from '@/actions/flux'
import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export async function generateImageFromPrompt(prompt: string): Promise<string | null> {
    console.log('Generating image with prompt:', prompt)
    try {
        const imageUrl = await generateImage(prompt)
        console.log('Generated image URL:', imageUrl)
        if (imageUrl) {
            return imageUrl
        } else {
            console.error('Failed to generate image')
            return null
        }
    } catch (error) {
        console.error('Error in generateImageFromPrompt:', error)
        return null
    }
}

export default function GenerateImage({ setBackgroundImage }: { setBackgroundImage: (imageUrl: string) => void }) {
    const [prompt, setPrompt] = useState('')

    const handleGenerateImage = async () => {
        const imageUrl = await generateImageFromPrompt(prompt)
        if (imageUrl) {
            setBackgroundImage(imageUrl)
        }
    }

    return (
        <>
            <Input
                type='text'
                placeholder='Enter image prompt'
                value={prompt}
                onChange={e =>
                    setPrompt(
                        e.target.value +
                            'anime character in a style of a cyberpunk, sci-fi, anime, retro-futuristic-themed city in back ground, in the style of Katsuhiro Otomo and Jean Giraud, dark bright colors, ultra detailed, best quality, high resolution, only use the scenery descriptions',
                    )
                }
                className='mb-2 hidden'
            />
            <Button onClick={handleGenerateImage} className='hidden w-full'>
                Generate Background
            </Button>
        </>
    )
}
