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
  signUpSchema,
  type SignUpSchemaInput,
  type SignUpSchemaOutput,
} from '../schemas/sign-up-schema'
import type { SignInFlow } from '../type'

interface SignUpCardProps {
  onState: (state: SignInFlow) => void
}

export function SignUpCard({ onState }: SignUpCardProps) {
  const [parent] = useAutoAnimate()
  const { signIn } = useAuthActions()

  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpSchemaInput>({
    resolver: zodResolver(signUpSchema),
  })

  function handleSignUpForm(data: SignUpSchemaOutput) {
    setPending(true)

    signIn('password', {
      name: data.name,
      email: data.email,
      password: data.password,
      flow: 'signUp',
    })
      .catch((err) => {
        console.log(err)
        setError('Passwords do not match')
      })
      .finally(() => setPending(false))
  }

  function handleSignUp(provider: 'github' | 'google') {
    setPending(true)

    signIn(provider).finally(() => setPending(false))
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
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
          onSubmit={handleSubmit(handleSignUpForm)}
        >
          <div className="space-y-1">
            <Input type="text" placeholder="Name" {...register('name')} />
            {errors.name && (
              <p className="text-xs font-semibold text-destructive">
                {errors.name?.message}
              </p>
            )}
          </div>
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
          <div className="space-y-1">
            <Input
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-semibold text-destructive">
                {errors.confirmPassword?.message}
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
            onClick={() => handleSignUp('google')}
            disabled={pending}
          >
            <GoogleSvg className="absolute left-2.5" /> Continue with google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="relative w-full"
            onClick={() => handleSignUp('github')}
            disabled={pending}
          >
            <GithubSvg className="absolute left-2.5" /> Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <span
            className="cursor-pointer text-sky-700 duration-200 ease-in-out hover:underline"
            onClick={() => onState('signIn')}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
