import Particles from '@/blocks/Backgrounds/Particles/Particles'
import React from 'react'

// Option 1: Using object destructuring (Recommended)
function Background({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }} className='z-0'>
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      >
        {children}
      </Particles>
    </div>
  )
}

export default Background