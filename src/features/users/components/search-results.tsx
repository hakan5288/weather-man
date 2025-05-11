'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Location {
  id: number
  name: string
  admin1?: string
  country: string
  latitude: number
  longitude: number
}

interface SearchResultsProps {
  searchResults: Location[]
  favourites: Location[]
  setFavourites: React.Dispatch<React.SetStateAction<Location[]>>
}

export default function SearchResults({ searchResults, favourites, setFavourites }: SearchResultsProps) {
  const router = useRouter()

  // Add location to favourites
  const addToFavourites = (e: React.MouseEvent, location: Location) => {
    e.stopPropagation()
    setFavourites((prev) => {
      if (!prev.some(fav => fav.id === location.id)) {
        toast.success(`${location.name} added to favourites!`, { id: `favourite-${location.id}` })
        return [...prev, location]
      }
      return prev
    })
  }

  // Handle navigation to dashboard
  const handleLocationClick = (location: Location) => {
    router.push(`/dashboard?lat=${location.latitude}&lng=${location.longitude}&name=${encodeURIComponent(location.name)}`)
  }

  if (searchResults.length === 0) return null

  return (
    <div className="mt-4">
      
      <ul className="space-y-2 bg-gray-300/20 rounded-lg py-3 px-2 h-[300px] overflow-y-auto relative">
      <h2 className="text-lg font-semibold mb-2 sticky top-0 py-3 bg-white px-3 rounded-lg ">Search Results</h2>
        {searchResults.map((location) => (
          <li
            key={location.id}
            className="flex justify-between items-center p-2 cursor-pointer "
            onClick={() => handleLocationClick(location)}
          >
            <div>
              <p className="font-medium">{location.name}</p>
              <p className="text-sm text-gray-500">
                {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
              </p>
            </div>
            <button
              onClick={(e) => addToFavourites(e, location)}
              className="p-2 disabled:opacity-50"
              disabled={favourites.some(fav => fav.id === location.id)}
              title="Add to favourites"
            >
              <Heart
                className={`h-5 w-5 ${favourites.some(fav => fav.id === location.id) ? 'fill-red-500 text-red-500' : 'text-red-500'}`}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}