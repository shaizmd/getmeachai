"use client";
import React, { use } from 'react'
import Main from '../components/Main'
import { signIn, signOut, useSession } from 'next-auth/react'
import useDocumentTitle from '@/hooks/useDocumentTitle'


function page() {
  useDocumentTitle('Home - Support Your Favorite Creators');
  
  return (
    <div>
    <Main/>
    </div>
  )
}

export default page
