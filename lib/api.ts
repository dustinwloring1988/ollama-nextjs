import { Message, Model } from '@/types'

export async function generateChatCompletion(baseUrl: string, model: string, messages: Message[]) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate chat completion')
  }

  return response.json()
}

export async function listModels(baseUrl: string): Promise<Model[]> {
  const response = await fetch(`${baseUrl}/api/tags`)

  if (!response.ok) {
    throw new Error('Failed to list models')
  }

  const data = await response.json()
  return data.models
}

export async function deleteModel(baseUrl: string, model: string) {
  const response = await fetch(`${baseUrl}/api/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model }),
  })

  if (!response.ok) {
    throw new Error('Failed to delete model')
  }
}

