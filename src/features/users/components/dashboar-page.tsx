'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardCard from './dashboard-card'
import { Droplet, Thermometer, Wind } from 'lucide-react'
import TemperatureChart from './bar-chart'

interface Location {
  latitude: number
  longitude: number
}

interface WeatherData {
  current: {
    temperature_2m: number
    wind_speed_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
  }
}

export default function DashboardPage() {
  const [location, setLocation] = useState<Location | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [_, setIsRequesting] = useState<boolean>(false)
  const [isFetchingWeather, setIsFetchingWeather] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const locationName = searchParams.get('name') || 'Your Location'

  const requestLocation = () => {
    setIsRequesting(true)
    setError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setError(null)
          setIsRequesting(false)
        },
        (err) => {
          setError(
            err.message === 'User denied Location Access'
              ? 'Location access denied. Please enable location in your browser settings or click "Reload Page" to try again.'
              : 'Location access denied. Please enable location in your browser settings or click "Reload Page" to try again.'
          )
          setLocation(null)
          setIsRequesting(false)
        },
        {
          timeout: 10000,
          maximumAge: 0,
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
      setIsRequesting(false)
    }
  }

  const fetchWeatherData = async (lat: number, lng: number) => {
    setIsFetchingWeather(true)
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText} (${response.status})`)
      }
      const data = await response.json()
      // Validate required fields
      if (
        !data.current?.temperature_2m ||
        !data.current?.wind_speed_10m ||
        !data.hourly?.temperature_2m ||
        !data.hourly?.relative_humidity_2m ||
        !data.hourly?.time
      ) {
        throw new Error('Incomplete or invalid weather data received.')
      }
      setWeatherData({
        current: {
          temperature_2m: data.current.temperature_2m,
          wind_speed_10m: data.current.wind_speed_10m,
        },
        hourly: {
          time: data.hourly.time,
          temperature_2m: data.hourly.temperature_2m,
          relative_humidity_2m: data.hourly.relative_humidity_2m,
        },
      })
      setError(null)
    } catch (err) {
      console.error('Weather API error:', err)
      setError(
        err instanceof Error
          ? `Failed to fetch weather data: ${err.message}`
          : 'Failed to fetch weather data.'
      )
      setWeatherData(null)
    } finally {
      setIsFetchingWeather(false)
    }
  }

  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setLocation({ latitude, longitude })
      } else {
        setError('Invalid latitude or longitude parameters.')
      }
    } else {
      requestLocation()
    }
  }, [searchParams])

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.latitude, location.longitude)
    }
  }, [location])


  if (!location) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <p className="mb-4">Please turn on location access</p>
          )}
        </div>
      </div>
    )
  }

  if (isFetchingWeather) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading weather data...</p>
      </div>
    )
  }

  if (!weatherData || error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || 'Failed to load weather data.'}
          </p>
          <button
            onClick={() => location && fetchWeatherData(location.latitude, location.longitude)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Weather Data
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 flex-col w-full">
      <h1 className="text-lg font-semibold mb-4 mt-2">
        Weather Data for {locationName}
      </h1>
      <div className="flex w-full gap-2 justify-between">
        <DashboardCard
          title="Temperature"
          description={`Current temperature at ${locationName}`}
          icon={<Thermometer />}
          data={`${weatherData.current.temperature_2m} °C`}
        />
        <DashboardCard
          title="Wind Speed"
          description="Current wind speed"
          icon={<Wind />}
          data={`${weatherData.current.wind_speed_10m} km/h`}
        />
        <DashboardCard
          title="Humidity"
          description="Current humidity"
          icon={<Droplet />}
          data={`${weatherData.hourly.relative_humidity_2m[0] || 0} %`}
        />
      </div>
      <TemperatureChart
        hourlyData={{
          time: weatherData.hourly.time,
          temperature_2m: weatherData.hourly.temperature_2m,
        }}
      />
    </div>
  )
}