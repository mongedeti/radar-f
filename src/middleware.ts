import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // depois podemos melhorar com sessão real
  return NextResponse.next()
}