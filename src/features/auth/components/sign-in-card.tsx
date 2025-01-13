import { useAuthActions } from '@convex-dev/auth/react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { GithubSvg } from '@/components/svg/github-svg'
import { GoogleSvg } from '@/components/svg/google-svg'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import {
  signInSchema,
  type SignInSchemaInput,
  type SignInSchemaOutput,
} from '../schemas/sign-in-schema'
import type { SignInFlow } from '../type'

interface SignInCardProps {
  onState: (state: SignInFlow) => void
}

export function SignInCard({ onState }: SignInCardProps) {
  const [parent] = useAutoAnimate()
  const { signIn } = useAuthActions()

  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInSchemaInput>({
    resolver: zodResolver(signInSchema),
  })

  function handleSignInForm(data: SignInSchemaOutput) {
    setPending(true)

    signIn('password', {
      email: data.email,
      password: data.password,
      flow: 'signIn',
    })
      .catch(() => setError('Invalid email or password'))
      .finally(() => setPending(false))
  }

  function handleSignIn(provider: 'github' | 'google') {
    setPending(true)

    signIn(provider).finally(() => setPending(false))
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form
          ref={parent}
          className="space-y-2.5"
          onSubmit={handleSubmit(handleSignInForm)}
        >
          <div className="space-y-1">
            <Input type="email" placeholder="Email" {...register('email')} />
            {errors.email && (
              <p className="text-xs font-semibold text-destructive">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs font-semibold text-destructive">
                {errors.password?.message}
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size="lg"
            className="relative w-full"
            onClick={() => handleSignIn('google')}
            disabled={pending}
          >
            <GoogleSvg className="absolute left-2.5" /> Continue with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="relative w-full"
            onClick={() => handleSignIn('github')}
            disabled={pending}
          >
            <GithubSvg className="absolute left-2.5" /> Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <span
            className="cursor-pointer text-sky-700 duration-200 ease-in-out hover:underline"
            onClick={() => onState('signUp')}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
