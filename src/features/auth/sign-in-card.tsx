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

import type { SignInFlow } from './type'

interface SignInCardProps {
  onState: (state: SignInFlow) => void
}

export function SignInCard({ onState }: SignInCardProps) {
  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button variant="outline" size="lg" className="relative w-full">
            <GoogleSvg className="absolute left-2.5" /> Continue with google
          </Button>
          <Button variant="outline" size="lg" className="relative w-full">
            <GithubSvg className="absolute left-2.5" /> Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have a account?{' '}
          <span
            className="cursor-pointer text-sky-700 duration-200 ease-in-out hover:underline"
            onClick={() => onState('signUp')}
          >
            Sign-up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
