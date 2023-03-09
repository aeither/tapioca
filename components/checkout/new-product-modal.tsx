import Modal from '@/components/shared/modal'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { mutate } from 'swr'

interface FormInput {
  title: string
  description: string
  amount: string
  receiver: string
}

const NewProductModal = ({
  showModal,
  setShowModal,
  props,
}: {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  props: { address: string }
}) => {
  const { register, handleSubmit } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const { amount, description, title } = data

    const promise = fetch('/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(amount),
      }),
    }).then((res) => {
      if (res.statusText === 'Unauthorized') {
        alert('Require sign in')
      } else {
        mutate('/api/product')
      }

      setShowModal(false)
    })

    toast.promise(promise, {
      loading: 'creating...',
      success: 'Created',
      error: 'Error when, failed to create',
    })
  }

  console.log('the address is', props.address)

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-display text-2xl font-bold">Add product</h3>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  defaultValue="title"
                  className="col-span-3"
                  {...register('title')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  defaultValue="description"
                  className="col-span-3"
                  {...register('description')}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  defaultValue={0.01}
                  step={0.01}
                  className="col-span-3"
                  {...register('amount')}
                />
              </div>
            </div>
            <Button type="submit">Add Product</Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export function useNewProductModal({ props }: { props: { address: string } }) {
  const [showModal, setShowModal] = useState(false)

  const ModalCallback = useCallback(() => {
    return (
      <NewProductModal showModal={showModal} setShowModal={setShowModal} props={props} />
    )
  }, [showModal, setShowModal, props])

  return useMemo(
    () => ({ setShowModal, Modal: ModalCallback }),
    [setShowModal, ModalCallback],
  )
}
