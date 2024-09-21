import '@phala/wapo-env'
import type { NextApiRequest, NextApiResponse } from 'next'

async function getChatCompletion(apiKey: string, model: string, chatQuery: string) {
    let result = ''
    try {
        const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: `${chatQuery}` }],
                model: `${model}`,
            }),
        })
        const responseData = await response.json()
        result = responseData.error ? responseData.error : responseData.choices[0].message.content
    } catch (error) {
        console.error('Error fetching chat completion:', error)
        result = error as string
    }
    return result
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { chatQuery } = req.body
        const apiKey = process.env.RED_PILL_API_KEY
        // Choose from any model listed here https://docs.red-pill.ai/get-started/supported-models
        const model = 'gpt-4o-mini'

        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not set in environment variables' })
        }

        try {
            let result = {
                model,
                chatQuery: chatQuery,
                message: '',
            }
            result.message = await getChatCompletion(apiKey, model, chatQuery)
            res.status(200).json({ result })
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch dialogue' })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}
