import { Button } from '@/components/ui/button'
import TopImg from '@/assets/images/landing/top.png'
import { useNavigate } from 'react-router-dom'
export default function Landing() {
  const navigate = useNavigate()
  return (
    <>
      <div className='min-h-fit'>
        <div className='grid md:grid-cols-2 items-center'>
          <div>
            <h1 className='font-bold text-3xl md:text-5xl text-primary leading-relaxed'>
              <span className='text-4xl md:text-8xl italic'>AI</span>
              <span className='text-gradient'>Receptionist</span>
            </h1>
            <p className='my-4 text-primary/80'>
              AI receptionist tool supports users during operations and problem solving.
            </p>
            <Button onClick={() => navigate('/login')}>Get started!</Button>
          </div>
          <div className='w-full my-3'>
            <img src={TopImg} alt='top-image' className='w-[300px] md:w-[400px] mx-auto block object-cover' />
          </div>
        </div>
      </div>
    </>
  )
}
