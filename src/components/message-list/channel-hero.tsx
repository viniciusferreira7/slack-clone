import dayjs from 'dayjs'

import type { Doc } from '../../../convex/_generated/dataModel'

type ChannelHeroProps = Doc<'channels'>

export function ChannelHero(props: ChannelHeroProps) {
  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <p className="mb-2 flex items-center text-2xl font-bold">
        # {props.name}
      </p>
      <p className="mb-4 font-normal text-slate-800">
        this channel was created on{' '}
        {dayjs(new Date(props._creationTime)).format('MMMM [ do, ] YYYY')}. This
        is very beginning of the <strong>{props.name}</strong> channel.
      </p>
    </div>
  )
}
