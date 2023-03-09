import { useCopyToClipboard } from 'react-use'
import { useQrModal } from './qr-modal'

export default function QrCodeCell({ reference }: { reference: string }) {
  const [state, copyToClipboard] = useCopyToClipboard()
  const url = `https://${window.location.host}/link?reference=${reference}`
  console.log('🚀 ~ file: qrcode-cell.tsx:7 ~ QrCodeCell ~ url', url)
  const { Modal, setShowModal } = useQrModal({ props: { url: url } })

  return (
    <div>
      <Modal />
      <button onClick={() => setShowModal(true)}>Copy</button>
      {/* <button onClick={() => copyToClipboard(url)}>Copy</button> */}
    </div>
  )
}
