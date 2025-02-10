import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from 'react-router-dom'
import { Google, Facebook } from 'developer-icons'
import { loginBodyType } from '@/types/auth.type'
import { loginBody } from '@/validations/auth.validation'
import { useMutation } from '@tanstack/react-query'
import authApi from '@/apis/auth.api'

export default function Login() {
  const form = useForm<loginBodyType>({
    resolver: zodResolver(loginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationFn: (body: loginBodyType) => authApi.login(body)
  })

  function onSubmit(values: loginBodyType) {
    loginMutation.mutate(data, {
      onSuccess(data) {
        console.log(data)
      },
      onError(error) {
        console.log(error)
      }
    })
  }

  return (
    <div className='flex items-center justify-center min-h-[700px]'>
      <div className='max-w-6xl w-full'>
        <div className='w-full rounded-lg p-6 max-w-md mx-auto shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <h3 className='text-primary text-3xl font-bold'>Sign in</h3>
                <p className='text-primary/80 text-sm mt-4 leading-relaxed'>Nice to meet you!</p>
              </div>
              <div className='grid grid-cols-2 items-center gap-4'>
                <Button variant={'outline'} size={'icon'} className='w-full'>
                  <Google /> Google
                </Button>
                <Button variant={'outline'} size={'icon'} className='w-full'>
                  <Facebook /> Facebook
                </Button>
              </div>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border border-primary/80' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-background text-primary/80'>hoặc</span>
                </div>
              </div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='Enter your email...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Enter your password...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className='flex items-center'>
                  <Checkbox id='remember-me' />
                  <label htmlFor='remember-me' className='ml-2 text-sm leading-none text-primary/80'>
                    Remember
                  </label>
                </div>
                <div className='text-sm'>
                  <Link to={'/forgot-password'}>
                    <span className='text-primary font-semibold hover:underline'>Forgot password?</span>
                  </Link>
                </div>
              </div>
              <Button type='submit' className='w-full'>
                Sign in
              </Button>
              <p className='text-sm text-primary/80 text-center'>
                Don't you have account?{' '}
                <Link to='/register'>
                  <span className='text-sm font-semibold text-primary ml-1 whitespace-nowrap hover:underline'>
                    Sign up
                  </span>
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
