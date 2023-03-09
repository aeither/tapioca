import ExtensionPay from '@/components/checkout/extension-pay'
import Layout from '@/components/layout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Balancer from 'react-wrap-balancer'
import { useDebounce } from 'use-debounce'
import QrCodeCell from '@/components/home/qrcode-cell'

export default function Home() {
  const { query } = useRouter()
  const { reference } = query
  const [debouncedReference] = useDebounce(reference, 500)

  return (
    <Layout>
      <motion.h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>Building blocks for your Next project</Balancer>
      </motion.h1>
      <QrCodeCell reference={debouncedReference as unknown as string} />
      <ExtensionPay reference={debouncedReference as string} />
    </Layout>
  )
}
