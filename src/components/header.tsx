'use client'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'
import { useAuth } from '@/features/auth/api/use-auth'
import { useUser } from '@/context/user-context'

export default function Header() {
    const { logout , logoutStatus} = useAuth();
    const {user} = useUser();

    const handleLogout = () => {
        logout()
    }
  return (
    <header className=" shadow-sm py-3 px-3 flex justify-between">
          <SidebarTrigger />

          <div className=' flex gap-5 items-center'>
            <span>{user?.name}</span>

            <Button className=' flex gap-3 items-center bg-transparent text-black hover:text-black hover:bg-transparent cursor-pointer' variant={"outline"} onClick={handleLogout} disabled={logoutStatus.isPending} >
                <LogOutIcon/>
                <span>Logout</span>
            </Button>
          </div>

          
        </header>
  )
}
