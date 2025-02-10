import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { AlignJustify } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const navigate = useNavigate()
  return (
    <header className='container px-4 py-4 sticky top-0 left-0 backdrop-blur-xl'>
      <div className='flex items-center justify-between'>
        <Link to='/' className='font-semibold text-xl lg:text-2xl'>
          <span className='italic'>AI</span>
          <span className='text-gradient'>Receptionist</span>
        </Link>
        <div className='hidden md:block'>
          <Button variant={'link'}>Home</Button>
          <Button variant={'link'}>About</Button>
          <Button variant={'link'}>Contact</Button>
        </div>
        <div className='hidden md:block '>
          <div className='flex gap-3'>
            <Button variant={'default'} onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <ModeToggle />
          </div>
        </div>
        <div className='md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={'secondary'} size={'icon'}>
                <AlignJustify />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => navigate('/')}>Home</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
              <DropdownMenuItem>Contact</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/login')}>Sign in</DropdownMenuItem>
              <DropdownMenuItem>
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
