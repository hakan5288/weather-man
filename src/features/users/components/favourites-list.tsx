'use client'
import React from 'react'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Location {
  id: number
  name: string
  admin1?: string
  country: string
  latitude: number
  longitude: number
}

interface FavouriteListProps {
  favourites: Location[]
  setFavourites: React.Dispatch<React.SetStateAction<Location[]>>
}

export default function FavouriteList({ favourites, setFavourites }: FavouriteListProps) {
  const router = useRouter()

  // Remove location from favourites
  const removeFromFavourites = (e: React.MouseEvent, locationId: number) => {
    e.stopPropagation();
    let favouriteLocations = localStorage.getItem("favouriteLocations");
  
    if (favouriteLocations) {
      let parsedLocations: Location[] = JSON.parse(favouriteLocations);
      parsedLocations = parsedLocations.filter((location) => location.id !== locationId); // Remove the item with the matching id
      localStorage.setItem("favouriteLocations", JSON.stringify(parsedLocations)); // Update localStorage
      setFavourites(parsedLocations); // Update the state
    }
  };

  // Handle navigation to dashboard
  const handleLocationClick = (location: Location) => {
    router.push(`/dashboard?lat=${location.latitude}&lng=${location.longitude}&name=${encodeURIComponent(location.name)}`)
  }

  return (
    <div className="mt-8">
      <h1 className="text-xl font-bold">Your saved favourite locations</h1>
      {favourites.length === 0 ? (
        <p className="text-gray-500">No favourite locations saved yet.</p>
      ) : (
        <ul className="space-y-2">
          {favourites.map((location) => (
            <li
              key={location.id}
              className="py-2 px-3 w-full flex justify-between items-center cursor-pointer shadow-lg bg-gray-500/10 rounded-lg my-3 "
              onClick={() => handleLocationClick(location)}
            >
              <div>
                <p className="font-medium">{location.name}</p>
                <p className="text-sm text-gray-500">
                  {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                </p>
              </div>
              <button
                onClick={(e) => removeFromFavourites(e, location.id)}
                className="p-2 text-red-500 hover:text-red-600"
                title="Remove from favourites"
              >
                <Heart className="h-5 w-5 fill-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}