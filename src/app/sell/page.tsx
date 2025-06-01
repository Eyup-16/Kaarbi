import { Metadata } from "next";
import Sell from "@/components/pages/Sell";
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import React from 'react'

export const metadata: Metadata = {
  title: "Sell Your Car | Kaarbi",
  description: "List your car for sale on Kaarbi. Fill out our simple form to get started.",
};

const SellPage = async () => {
  const session = await auth.api.getSession({headers: await headers()})
  if(!session){
    redirect('/login')
  }
  return (
    <Sell/>
  )
}

export default SellPage 