import Card from '@/components/home/card'
import ComponentGrid from '@/components/home/component-grid'
import { CreateLinkModal } from '@/components/home/create-link-modal'
import Products from '@/components/home/products'
import QrCodeCell from '@/components/home/qrcode-cell'
import { ConnectWallet } from '@/components/home/wallet'
import WebVitals from '@/components/home/web-vitals'
import Layout from '@/components/layout'
import { DEPLOY_URL } from '@/libs/constants/constants'
import { useDB } from '@/libs/hooks/use-db'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import { toast } from 'sonner'

export default function Home() {
  // const { data: links } = useSWR<PrismaLinkType[]>(`/api/links`, fetcher)
  const { orders } = useDB()

  return (
    <Layout>
      <motion.h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>Building blocks for your Next project</Balancer>
      </motion.h1>

      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <div className={''}>
          <ConnectWallet />
          <Products submitTarget="/cart" enabled />
        </div>
        <div className={''}>
          <button onClick={() => toast('hello world')}>toast</button>
          {/* CreateLinkModal -> CreateOrder */}
          <CreateLinkModal />
          <table className="table-auto">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Info</th>
                <th>Page</th>
                <th>Share</th>
                <th>Copy</th>
              </tr>
            </thead>
            <tbody>
              {orders.data &&
                orders.data.map((link, i) => (
                  <tr key={i}>
                    <td>{link.amount}</td>
                    <td>{link.reference}</td>
                    <td>{link.status}</td>
                    <td>
                      <p>Info</p>
                    </td>
                    <td>
                      <Link href={`/link?reference=${link.reference}`}>Open</Link>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator
                              .share({
                                title: 'WebShare API Demo',
                                url: `https://${window.location.host}/link?reference=${link.reference}`,
                              })
                              .then(() => {
                                console.log('Thanks for sharing!')
                              })
                              .catch(console.error)
                          } else {
                            // show modal
                          }
                        }}
                      >
                        Share
                      </button>
                    </td>
                    <td>
                      <QrCodeCell reference={link.reference as unknown as string} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={title === 'Beautiful, reusable components' ? <ComponentGrid /> : demo}
            large={large}
          />
        ))}
      </div>
    </Layout>
  )
}

const features = [
  {
    title: 'Beautiful, reusable components',
    description:
      'Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)',
    large: true,
  },
  {
    title: 'Performance first',
    description:
      'Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.',
    demo: <WebVitals />,
  },
  {
    title: 'One-click Deploy',
    description:
      'Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.',
    demo: (
      <a href={DEPLOY_URL}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://vercel.com/button" alt="Deploy with Vercel" width={120} />
      </a>
    ),
  },
  {
    title: 'Built-in Auth + Database',
    description:
      'Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)',
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
        <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
      </div>
    ),
  },
  {
    title: 'Hooks, utilities, and more',
    description: 'Precedent offers a collection of hooks, utilities, and `@vercel/og`',
    demo: (
      <div className="grid grid-flow-col grid-rows-3 gap-10 p-10">
        <span className="font-mono font-semibold">useIntersectionObserver</span>
        <span className="font-mono font-semibold">useLocalStorage</span>
        <span className="font-mono font-semibold">useScroll</span>
        <span className="font-mono font-semibold">nFormatter</span>
        <span className="font-mono font-semibold">capitalize</span>
        <span className="font-mono font-semibold">truncate</span>
      </div>
    ),
  },
]
