import Dashboard from '@/components/pages/Dashboard'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import React from 'react'

const Dashboardpage = async () => {
  const session = await auth.api.getSession({headers: await headers()})
  if(!session){
    redirect('/login')
  }
  return (
    <Dashboard/>
  )
}

export default Dashboardpage