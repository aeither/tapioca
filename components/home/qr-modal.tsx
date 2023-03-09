import Modal from '@/components/shared/modal'
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import Clipboard from '@/components/shared/icons/clipboard'
import { getQRAsCanvas, QRCodeSVG } from '@/lib/qr'
import toast from 'sonner'

const QrModal = ({
  showModal,
  setShowModal,
  props,
}: {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  props: { url: string }
}) => {
  const qrData = useMemo(
    () => ({
      value: props.url,
      bgColor: '#ffffff',
      size: 1024,
      level: 'Q', // QR Code error correction level: https://blog.qrstuff.com/general/qr-code-error-correction
    }),
    [props],
  )

  const copyToClipboard = async () => {
    try {
      const canvas = await getQRAsCanvas(qrData, 'image/png', true)
      ;(canvas as HTMLCanvasElement).toBlob(async function (blob) {
        if (!blob) return
        const item = new ClipboardItem({ 'image/png': blob })
        await navigator.clipboard.write([item])
      })
    } catch (e) {
      throw e
    }
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">Rive</h3>

          <div className="mx-auto rounded-lg border-2 border-gray-200 bg-white p-4">
            <QRCodeSVG
              value={qrData.value}
              size={qrData.size / 8}
              bgColor={qrData.bgColor}
              level={qrData.level}
              includeMargin={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 sm:px-16">
            <button
              onClick={async () => {
                toast.promise(copyToClipboard(), {
                  loading: 'Copying...',
                  success: 'Copied!',
                  error: 'Failed to copy',
                })
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-black bg-black py-1.5 px-5 text-sm text-white transition-all hover:bg-white hover:text-black"
            >
              <Clipboard className="h-4 w-4" /> Copy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function useQrModal({ props }: { props: { url: string } }) {
  const [showModal, setShowModal] = useState(false)

  const ModalCallback = useCallback(() => {
    return <QrModal showModal={showModal} setShowModal={setShowModal} props={props} />
  }, [showModal, setShowModal, props])

  return useMemo(
    () => ({ setShowModal, Modal: ModalCallback }),
    [setShowModal, ModalCallback],
  )
}
