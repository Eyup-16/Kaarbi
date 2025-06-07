import EmailVerify from '@/components/pages/EmailVerify'
import React from 'react'

// Prevent static generation of this page
export const dynamic = 'force-dynamic'

const VerifyEmail = () => {
  return (
    <div>
      <EmailVerify/>
    </div>
  )
}

export default VerifyEmail