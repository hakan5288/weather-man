"use client"
import { useUser } from '@/context/user-context'
import React from 'react'

export default function Settings() {
    const {user} = useUser()
  return (
    <div>
        <h1 className='font-semibold text-lg underline my-4'>Account Settings</h1>

        <h1 className='text-lg'>Email Address:</h1>
        <p className=' text-sm mb-5'>{user?.email}</p>

        <h1 className='text-lg'>Username:</h1>
        <p className=' text-sm'>{user?.name}</p>

    </div>
  )
}
