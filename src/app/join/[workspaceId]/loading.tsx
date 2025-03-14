import { Loader } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="grid h-full place-content-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
