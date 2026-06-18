"use client";
import React from 'react'
import Main from '../components/Main'
import useDocumentTitle from '@/hooks/useDocumentTitle'


function Page() {
  useDocumentTitle('Home - Support Your Favorite Creators');
  
  return (
    <div>
    <Main/>
    </div>
  )
}

export default Page
