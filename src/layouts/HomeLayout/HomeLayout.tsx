import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useTheme } from '@/components/ThemeProvider'

interface Props {
  children: React.ReactNode
}

export default function HomeLayout({ children }: Props) {
  const [init, setInit] = useState(false)
  const [color, setColor] = useState('#ffffff')

  const context = useTheme()
  const { theme } = context

  useEffect(() => {
    if (theme === 'light') {
      setColor('#000000')
    } else {
      setColor('#ffffff')
    }

    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [theme])

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -100
      },
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: color
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
        },
        links: {
          enable: true,
          distance: 150,
          color: color,
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          outModes: {
            default: 'out'
          }
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
            parallax: {
              enable: true,
              force: 60,
              smooth: 10
            }
          },
          onClick: {
            enable: true,
            mode: 'push'
          }
        },
        modes: {
          grab: {
            distance: 400,
            links: {
              opacity: 1
            }
          },
          push: {
            quantity: 4
          }
        }
      },
      detectRetina: true
    }),
    [color] // Add color to dependency array
  )

  return (
    <div className=' flex flex-col min-h-screen'>
      {init && <Particles id='tsparticles' options={options} className='!fixed inset-0' />}
      <Header />
      <main className='flex-grow w-full'>
        <div className='container py-8 px-4'>{children}</div>
      </main>
      <Footer />
    </div>
  )
}
