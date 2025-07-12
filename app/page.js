"use client";
import React, { use } from 'react'
import Main from '../components/Main'
import { signIn, signOut, useSession } from 'next-auth/react'


function page() {
  return (
    <div>
    <Main/>
    </div>
  )
}

export default page
