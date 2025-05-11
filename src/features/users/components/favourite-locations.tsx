"use client";
import LocationSearch from "./location-search";
import SearchResults from "./search-results";
import FavouriteList from "./favourites-list";
import { useEffect, useState } from "react";
interface Location {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function FavouriteLocations() {
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [favourites, setFavourites] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load favourites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavourites = localStorage.getItem("favouriteLocations");
      if (savedFavourites) {
        const parsedFavourites: Location[] = JSON.parse(savedFavourites);
        if (Array.isArray(parsedFavourites) && parsedFavourites.length > 0) {
          setFavourites(parsedFavourites);
        } else {
          setFavourites([]);
        }
      } else {
        setFavourites([]);
      }
    } catch (err) {
      setError("Failed to load saved locations.");
      setFavourites([]);
    }
  }, []);

  // Save favourites to localStorage
  useEffect(() => {
    try {
      if (favourites.length > 0) {
        localStorage.setItem("favouriteLocations", JSON.stringify(favourites));
      }
    } catch (err) {
      setError("Failed to save locations.");
    }
  }, [favourites]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <LocationSearch setSearchResults={setSearchResults} setError={setError} />
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      <SearchResults
        searchResults={searchResults}
        favourites={favourites}
        setFavourites={setFavourites}
      />
      <FavouriteList favourites={favourites} setFavourites={setFavourites} />
    </div>
  );
}
