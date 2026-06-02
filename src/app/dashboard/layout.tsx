'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: 20,
      }}
    >
      {children}
    </div>
  )
}