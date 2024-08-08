'use client'
import React, {  useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'

interface ICursor {
    size: number
    background: string
    border?: string
}
// create-context
// export const CursorContext = createContext({});

export default function CursorProvider({ children }: { children: React.ReactNode }) {
    const [cursor, setCursor] = React.useState<ICursor>({ size: 40, background: 'transparent', border: '2px solid #473936' })
    const [dot, setDot] = React.useState({ size: 5, background: '#473936' })
    const [isHovering, setIsHovering] = React.useState(false)
    // const smallVieworIsActive = useMediaQuery({ query: '(max-width: 1200px)' })

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const dotX = useMotionValue(0)
    const dotY = useMotionValue(0)

    const springConfig = { damping: 70, stiffness: 290, mass: 0.45 }
    const dotConfig = { damping: 200, stiffness: 490, mass: 0.90 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)
    const springDotX = useSpring(dotX, dotConfig)
    const springDotY = useSpring(dotY, dotConfig)

    const handleMouseMove = (e: any) => {
        mouseX.set(e.clientX - cursor.size / 2)
        mouseY.set(e.clientY - cursor.size / 2)
    }

    const handleDotMouseMove = (e: any) => {
        dotX.set(e.clientX - dot.size / 2)
        dotY.set(e.clientY - dot.size / 2)
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousemove', handleDotMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousemove', handleDotMouseMove)
        }
    }, [cursor])

    //   const handleMouseEnter = () => {
    //       setCursor({size: 90, background: '#00423a'})
    //       setIsHovering(true)
    //   }

    //   const handleMouseLeave = () => {
    //       setCursor({size: 30, background: '#473936'})
    //       setIsHovering(false)
    //   }
    return (
        // <CursorContext.Provider value={{handleMouseEnter,handleMouseLeave}}>
        <div>
            <motion.div
                className='fixed z-[999] rounded-full pointer-events-none transition-all duration-400'
                style={{
                    left: springX,
                    top: springY,
                    width: cursor.size,
                    height: cursor.size,
                    background: cursor.background,
                    border: cursor.border,
                    mixBlendMode: isHovering ? 'difference' : 'normal',
                    transition: 'width 0.6s ease-in-out, height 0.6s ease-in-out',
                }}
            />
            <motion.div
                className='fixed z-[999] rounded-full  transition-all duration-700'
                style={{
                    left: springDotX,
                    top: springDotY,
                    width: dot.size,
                    height: dot.size,
                    background: '#473936',
                    transition: 'width 0.1s ease-in-out, height 0.1s ease-in-out',
                }}
            />
            {children}
        </div>
    )
}
