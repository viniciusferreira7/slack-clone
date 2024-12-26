'use client'

import { useState } from 'react'

import { SignInCard } from './sign-in-card'
import { SignUpCard } from './sign-up-card'
import type { SignInFlow } from './type'

export function AuthScreen() {
  const [state, setState] = useState<SignInFlow>('signIn')

  return (
    <div className="grid h-screen place-items-center bg-fuchsia-900">
      <div className="md:w-105 md:h-auto">
        {state === 'signIn' ? (
          <SignInCard onState={setState} />
        ) : (
          <SignUpCard />
        )}
      </div>
    </div>
  )
}