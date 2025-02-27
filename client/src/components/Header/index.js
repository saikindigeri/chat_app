'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 const navigate=useNavigate()
  const handleLogout=()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate("/")
  }
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 border-b border-white/20 text-gray-800 p-3 shadow-lg z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://res.cloudinary.com/dpdejfl2k/image/upload/v1733116676/txjkwonfikizve3ljwe4.png"
              className="h-10 w-auto"
            />
          </a>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-700 hover:bg-white/50 transition-all"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="w-6 h-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-8">
          <Popover className="relative">
            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-xl backdrop-blur-lg bg-white/70 shadow-xl ring-1 ring-black/5"
            >
              {/* PopoverPanel content remains the same */}
            </PopoverPanel>
          </Popover>

          <a href="/friends" className="text-gray-700 hover:text-gray-900 hover:scale-105 transition-all font-medium">
            Friends
          </a>
          <a href="/users" className="text-gray-700 hover:text-gray-900 hover:scale-105 transition-all font-medium">
            Users
          </a>
          <a href="/under-construction" className="text-gray-700 hover:text-gray-900 hover:scale-105 transition-all font-medium">
            Groups
          </a>
          <a href="/under-construction" className="text-gray-700 hover:text-gray-900 hover:scale-105 transition-all font-medium">
            Notifications
          </a>
        </PopoverGroup>

        <div className="hidden lg:flex lg:items-center">
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm bg-white/50 rounded-lg hover:bg-white/70 hover:scale-105 transition-all">
            Log out
          </button>
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
  <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm" />
  <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto backdrop-blur-lg bg-white/80 px-6 py-6 sm:max-w-sm">
    <div className="flex items-center justify-between">
      <a href="#" className="flex items-center space-x-2">
        <img
          alt="Your Company"
          src="https://res.cloudinary.com/dpdejfl2k/image/upload/v1733116676/txjkwonfikizve3ljwe4.png"
          className="h-8 w-auto"
        />
      </a>
      <button
        type="button"
        className="rounded-md p-2.5 text-gray-700"
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className="sr-only">Close menu</span>
        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
    <div className="mt-6 flow-root">
      <div className="space-y-2 py-6">
        <a
          href="/friends"
          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          Friends
        </a>
        <a
          href="/users"
          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          Users
        </a>
        <a
          href="/under-construction"
          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          Groups
        </a>
        <a
          href="/under-construction"
          className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          Notifications
        </a>
      </div>
      <div className="border-t border-gray-200 py-6">
        <button
          onClick={handleLogout}
          className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </div>
  </DialogPanel>
</Dialog>

    </header>
  )
}