import React from 'react'

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 1500)
  }, [hasCopied])

  const copyToClipboard = async (value: string) => {
    navigator.clipboard.writeText(value)
    setHasCopied(true)
  }

  return {
    copyToClipboard,
    hasCopied,
  }
}

//   const { copyToClipboard, hasCopied } = useCopyToClipboard()
