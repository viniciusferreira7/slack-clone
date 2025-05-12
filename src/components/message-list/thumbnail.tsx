import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
  url?: string | null
}

export function Thumbnail({ url }: ThumbnailProps) {
  if (!url) return

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative my-2 max-w-96 cursor-zoom-in overflow-hidden rounded-lg border">
          <img
            src={url}
            alt="Message image"
            className="size-full rounded-md object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none shadow-none">
        <img
          src={url}
          alt="Message image"
          className="size-full rounded-md object-cover"
        />
      </DialogContent>
    </Dialog>
  )
}
