import { ConnectWallet } from '@/components/home/wallet'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'

export default function Home() {
  return (
    <>
      <motion.h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>Building blocks for your Next project</Balancer>
      </motion.h1>

      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <div className={''}>
          <ConnectWallet />

          <button
            onClick={() => {
              const w = window as any
              if (w.Jupiter._instance) {
                w.Jupiter.resume()
              } else {
                w.Jupiter.init({
                  mode: 'default',
                  displayMode: 'modal',
                  endpoint: process.env.NEXT_PUBLIC_SOLANA_RPC,
                })
              }
            }}
          >
            click me
          </button>

          <div style={{ fontWeight: '600', fontSize: 16, marginTop: 24 }}>
            Hook example
          </div>
          <div>Number of tokens:</div>
          <div>Number of input tokens</div>
          <div>Possible number of routes:</div>
          <div>Best quote:</div>
        </div>
      </div>
    </>
  )
}
