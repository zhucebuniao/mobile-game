<template>
  <div class="dynamic-background">
    <!-- Gradient Background -->
    <div class="gradient-bg"></div>
    
    <!-- Particle Canvas -->
    <canvas 
      ref="particleCanvas" 
      class="particle-canvas"
      :class="{ 'reduced-motion': prefersReducedMotion }"
    ></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'DynamicBackground',
  setup() {
    const particleCanvas = ref(null)
    const prefersReducedMotion = ref(false)
    
    let ctx = null
    let particles = []
    let animationFrame = null
    let canvasWidth = 0
    let canvasHeight = 0

    const checkReducedMotion = () => {
      prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    const createParticle = () => {
      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        life: Math.random() * 100 + 50
      }
    }

    const initParticles = () => {
      particles = []
      // Limit particles for performance - fewer on mobile
      const particleCount = window.innerWidth < 768 ? 30 : 50
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
      }
    }

    const updateParticles = () => {
      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life--

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvasWidth
        if (particle.x > canvasWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvasHeight
        if (particle.y > canvasHeight) particle.y = 0

        // Remove dead particles and create new ones
        if (particle.life <= 0) {
          particles[index] = createParticle()
        }
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      particles.forEach(particle => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 10
        ctx.shadowColor = '#4ade80'
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const animate = () => {
      if (!prefersReducedMotion.value) {
        updateParticles()
        drawParticles()
      }
      animationFrame = requestAnimationFrame(animate)
    }

    const resizeCanvas = () => {
      if (!particleCanvas.value) return
      
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
      
      particleCanvas.value.width = canvasWidth
      particleCanvas.value.height = canvasHeight
    }

    const initCanvas = () => {
      if (!particleCanvas.value) return
      
      ctx = particleCanvas.value.getContext('2d')
      resizeCanvas()
      initParticles()
      animate()
    }

    onMounted(() => {
      checkReducedMotion()
      initCanvas()
      
      window.addEventListener('resize', resizeCanvas)
      window.addEventListener('resize', initParticles)
      
      // Listen for reduced motion preference changes
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      mediaQuery.addEventListener('change', checkReducedMotion)
    })

    onUnmounted(() => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('resize', initParticles)
    })

    return {
      particleCanvas,
      prefersReducedMotion
    }
  }
}
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4b3f72 0%, #2a2a72 100%);
  animation: gradientShift 10s ease-in-out infinite alternate;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle-canvas.reduced-motion {
  opacity: 0.3;
}

@keyframes gradientShift {
  0% {
    background: linear-gradient(135deg, #4b3f72 0%, #2a2a72 100%);
  }
  50% {
    background: linear-gradient(135deg, #5b4f82 0%, #3a3a82 100%);
  }
  100% {
    background: linear-gradient(135deg, #4b3f72 0%, #2a2a72 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-bg {
    animation: none;
    background: linear-gradient(135deg, #4b3f72 0%, #2a2a72 100%);
  }
}
</style>