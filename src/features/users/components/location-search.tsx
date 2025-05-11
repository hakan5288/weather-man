'use client'
import React, { useState, useCallback, useRef } from 'react'
import { Input } from '@/components/ui/input'

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'

interface Location {
  id: number
  name: string
  admin1?: string
  country: string
  latitude: number
  longitude: number
}

interface GeocodingResponse {
  results?: Location[]
}

interface LocationSearchProps {
  setSearchResults: React.Dispatch<React.SetStateAction<Location[]>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

// Custom debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export default function LocationSearch({ setSearchResults, setError }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=10`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: GeocodingResponse = await response.json()
        
        if (!data.results || data.results.length === 0) {
          setSearchResults([])
          setError('No locations found')
          return
        }

        setSearchResults(data.results)
      } catch (err) {
        setError('Failed to fetch locations. Please try again.')
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 500),
    [setSearchResults, setError]
  )

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for any location"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full"
        ref={inputRef}
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
    </div>
  )
}