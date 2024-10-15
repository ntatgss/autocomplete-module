'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Copy } from "lucide-react"
import Autocomplete, { AutocompleteRef } from '@/components/autocomplete-module/Autocomplete'
import { generateSuggestion, modelMaxLengths, defaultRole } from '@/components/autocomplete-module/aiService'
import { roles, RoleType } from '@/components/autocomplete-module/roles'

const defaultModels = [
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'anthropic/claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
]

function getFriendlyModelName(modelName: string): string {
  // Split the name by hyphens
  const parts = modelName.split('-')
  
  // Process each part
  const processedParts = parts.map(part => {
    // Capitalize model name (first part)
    if (parts.indexOf(part) === 0) {
      return part.toUpperCase()
    }
    // Keep version numbers and size indicators (like 3.2 or 1b) as is
    if (/^[0-9.]+[a-z]?$/.test(part)) {
      return part.toUpperCase()
    }
    // Capitalize first letter for other parts
    return part.charAt(0).toUpperCase() + part.slice(1)
  })
  
  // Join the processed parts with spaces
  return processedParts.join(' ')
}

export default function AutocompletePage() {
  const [mounted, setMounted] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole)
  const [models, setModels] = useState(defaultModels)
  const [isCopied, setIsCopied] = useState(false)
  const autocompleteRef = useRef<AutocompleteRef>(null)

  const fetchLMStudioModels = useCallback(async () => {
    try {
      const response = await fetch('/api/openai?action=models')
      if (response.ok) {
        const lmStudioModels = await response.json()
        if (lmStudioModels.length > 0) {
          const friendlyLMStudioModels = lmStudioModels.map((model: { value: string, label: string }) => ({
            value: model.value,
            label: getFriendlyModelName(model.label)
          }))
          setModels([...friendlyLMStudioModels, ...defaultModels])
          setSelectedModel(friendlyLMStudioModels[0].value) // Set the first LMStudio model as default
        } else {
          setModels(defaultModels)
          setSelectedModel(defaultModels[0].value)
        }
      } else {
        setModels(defaultModels)
        setSelectedModel(defaultModels[0].value)
      }
    } catch (error) {
      console.error('Error fetching LMStudio models:', error)
      setModels(defaultModels)
      setSelectedModel(defaultModels[0].value)
    }
  }, [])

  useEffect(() => {
    fetchLMStudioModels()
    setMounted(true)
  }, [fetchLMStudioModels])

  const handleSelect = (selected: string) => {
    console.log('Selected:', selected)
    // You can add more logic here, like updating state or making an API call
  }

  const handleCopy = () => {
    if (autocompleteRef.current) {
      const text = autocompleteRef.current.getValue()
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }).catch(err => {
        console.error('Failed to copy text: ', err)
      })
    }
  }

  if (!mounted || selectedModel === null) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto overflow-visible">
        <CardHeader>
          <CardTitle>AI Drafting</CardTitle>
          <CardDescription>
            Experience the future of writing with our AI-powered drafting tool. As you type, receive real-time suggestions from advanced language models, helping you craft compelling content faster and more efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="model-select" className="text-sm font-medium">
              Select Model:
            </label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="role-select" className="text-sm font-medium">
              Select Role:
            </label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleType)}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(roles).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Your draft:</p>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="relative">
            <Autocomplete
              ref={autocompleteRef}
              onSelect={handleSelect}
              generateSuggestions={(input: string) => generateSuggestion(input, selectedModel, selectedRole)}
              model={selectedModel}
              maxInputLength={modelMaxLengths[selectedModel] || 100000}
              className="min-h-[200px] w-full"
              suggestionClassName="mt-1 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto touch-pan-y"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
