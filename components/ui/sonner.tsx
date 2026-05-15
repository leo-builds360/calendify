'use client'

import { Toaster as SonnerToaster } from 'sonner'

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1d1d1f] group-[.toaster]:border-gray-100 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:text-[13px]',
          description: 'group-[.toast]:text-[#6e6e73]',
          actionButton: 'group-[.toast]:bg-[#0071e3] group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-[#f5f5f7] group-[.toast]:text-[#6e6e73]',
        },
      }}
      {...props}
    />
  )
}
