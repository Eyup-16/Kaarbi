"use client"
import { LogOut } from "lucide-react";
import {useState}from 'react'
import { Button } from '../ui/button'
import { signOut } from "@/lib/auth-client";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";

const Dashboard = () => {
  const [isSignOut, setIsSignOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try{
      setIsSignOut(true)
      await signOut()
      toast.success(`Signed out successfully!`)
      router.push('/login')
    }
    catch(error){
      setIsSignOut(false)
      toast.error(error+'signed out failed!')
    }
    finally {
      setIsSignOut(false)
    }
  }
  return (
    <section>
        <div className='flex flex-col  h-screen'>
        <Button className=' cursor-pointer right-0 w-48 bg-white text-black'
        variant={'outline'}
        onClick={handleSignOut}
        disabled={isSignOut}>
          {isSignOut ? 
          <>
            <LogOut className='mr-2 h-4 w-4 animate-spin' />
            Signing Out...
          </>
          : 
          <>
            <LogOut className='mr-2 h-4 w-4 animate-spin' />
            Sign Out
          </>
          }
          
        </Button>
        <div>
            <h1>Dashboard</h1>
            <p>This is the dashboard page</p>
        </div>
        </div>
    </section>
  )
}
export default Dashboard

