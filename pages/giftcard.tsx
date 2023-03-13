import { ConnectWallet } from '@/components/home/wallet'
import QRLogo from '@/components/shared/tip-link.svg' // Use Image above
import { useCopyToClipboard } from '@/libs/hooks/use-copy-to-clipboard'
import { useSolana } from '@/libs/hooks/use-solana'
import { CheckCircle, ContentCopy } from '@mui/icons-material'
import { Button, IconButton, Typography } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { TipLink } from '@tiplink/api'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { QRCode } from 'react-qrcode-logo'
import Balancer from 'react-wrap-balancer'
export default function Home() {
  const { copyToClipboard, hasCopied } = useCopyToClipboard()
  const [giftCardUrl, setGiftCardUrl] = useState<TipLink[]>()
  const { createGiftCard } = useSolana()

  return (
    <>
      <div className="flex h-[calc(100vh)] flex-col items-center justify-center gap-8">
        <motion.h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
          <Balancer>Create Gift Card</Balancer>
        </motion.h1>

        <ConnectWallet className="bg-slate-800 rounded-full" />
        <Button
          variant="contained"
          onClick={async () => {
            const giftCard = await createGiftCard(0.01)
            if (giftCard) {
              setGiftCardUrl([giftCard, ...(giftCardUrl || [])])
            }
          }}
        >
          Create Gift Card
        </Button>

        {giftCardUrl &&
          giftCardUrl.map((giftCard) => {
            return (
              <>
                <div className="rounded-lg border shadow">
                  <QRCode
                    value={giftCard.url.toString()}
                    size={216}
                    bgColor={'transparent'}
                    fgColor={'#000'}
                    logoImage={QRLogo?.src}
                    logoWidth={60}
                    logoHeight={60}
                    eyeRadius={12}
                    eyeColor={'#007cbf'}
                  />
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <Typography variant="body1" component="h3">
                    {giftCard.url.toString()}
                  </Typography>
                  <IconButton onClick={() => copyToClipboard(giftCard.url.toString())}>
                    {hasCopied ? <CheckCircle /> : <ContentCopy />}
                  </IconButton>
                </div>
              </>
            )
          })}
      </div>
    </>
  )
}
