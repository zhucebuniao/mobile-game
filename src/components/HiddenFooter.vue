<template>
  <div class="hidden-footer" :class="{ 'visible': isVisible }">
    <div class="footer-content">
      <div class="footer-section">
        <div class="brand-info">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="logo-icon">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <span class="brand-name">游戏世界</span>
          </div>
          <p class="brand-description">
            探索创新的移动游戏体验，挑战你的技能与想象力
          </p>
        </div>
      </div>
      
      <div class="footer-section">
        <h3 class="section-title">游戏</h3>
        <ul class="footer-links">
          <li><a href="/games" class="footer-link">所有游戏</a></li>
          <li><a href="/leaderboard" class="footer-link">排行榜</a></li>
          <li><a href="/achievements" class="footer-link">成就系统</a></li>
          <li><a href="/tournaments" class="footer-link">竞技赛事</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="section-title">支持</h3>
        <ul class="footer-links">
          <li><a href="/help" class="footer-link">帮助中心</a></li>
          <li><a href="/contact" class="footer-link">联系我们</a></li>
          <li><a href="/feedback" class="footer-link">意见反馈</a></li>
          <li><a href="/bug-report" class="footer-link">问题报告</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="section-title">设置</h3>
        <div class="settings-controls">
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="soundEnabled" @change="handleSoundToggle" class="setting-checkbox">
              <span class="checkmark"></span>
              音效
            </label>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="reducedMotion" @change="handleMotionToggle" class="setting-checkbox">
              <span class="checkmark"></span>
              减少动画
            </label>
          </div>
          
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" v-model="highContrast" @change="handleContrastToggle" class="setting-checkbox">
              <span class="checkmark"></span>
              高对比度
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="legal-links">
        <a href="/privacy" class="legal-link">隐私政策</a>
        <span class="separator"> | </span>
        <a href="/terms" class="legal-link">服务条款</a>
        <span class="separator"> | </span>
        <a href="/cookies" class="legal-link">Cookie 政策</a>
      </div>
      
      <div class="copyright">
        <p>&copy; {{ currentYear }} 游戏世界. 保留所有权利.</p>
        <p class="version">版本 1.0.0</p>
      </div>
      
      <div class="social-links">
        <a href="#" class="social-link" aria-label="关注我们的微博">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
          </svg>
        </a>
        
        <a href="#" class="social-link" aria-label="关注我们的QQ群">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </a>
        
        <a href="#" class="social-link" aria-label="关注我们的公众号">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useGlobalSoundEffects } from '../composables/useSoundEffects'

export default {
  name: 'HiddenFooter',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['settings-changed'],
  setup(props, { emit }) {
    const { isEnabled: soundEnabled, toggleSound } = useGlobalSoundEffects()
    
    const reducedMotion = ref(false)
    const highContrast = ref(false)
    
    const currentYear = computed(() => new Date().getFullYear())
    
    // Load saved preferences
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem('userPreferences')
        if (saved) {
          const prefs = JSON.parse(saved)
          reducedMotion.value = prefs.reducedMotion || false
          highContrast.value = prefs.highContrast || false
          
          // Apply preferences
          applyMotionPreference()
          applyContrastPreference()
        }
      } catch (error) {
        console.warn('Failed to load user preferences:', error)
      }
    }
    
    // Save preferences
    const savePreferences = () => {
      try {
        const prefs = {
          soundEnabled: soundEnabled.value,
          reducedMotion: reducedMotion.value,
          highContrast: highContrast.value,
          lastUpdated: Date.now()
        }
        localStorage.setItem('userPreferences', JSON.stringify(prefs))
      } catch (error) {
        console.warn('Failed to save user preferences:', error)
      }
    }
    
    const handleSoundToggle = () => {
      toggleSound()
      savePreferences()
      emit('settings-changed', { soundEnabled: soundEnabled.value })
    }
    
    const handleMotionToggle = () => {
      applyMotionPreference()
      savePreferences()
      emit('settings-changed', { reducedMotion: reducedMotion.value })
    }
    
    const handleContrastToggle = () => {
      applyContrastPreference()
      savePreferences()
      emit('settings-changed', { highContrast: highContrast.value })
    }
    
    const applyMotionPreference = () => {
      const root = document.documentElement
      if (reducedMotion.value) {
        root.style.setProperty('--animation-duration', '0.01s')
        root.style.setProperty('--transition-duration', '0.01s')
        root.classList.add('reduce-motion')
      } else {
        root.style.removeProperty('--animation-duration')
        root.style.removeProperty('--transition-duration')
        root.classList.remove('reduce-motion')
      }
    }
    
    const applyContrastPreference = () => {
      const root = document.documentElement
      if (highContrast.value) {
        root.classList.add('high-contrast')
      } else {
        root.classList.remove('high-contrast')
      }
    }
    
    onMounted(() => {
      loadPreferences()
    })
    
    return {
      soundEnabled,
      reducedMotion,
      highContrast,
      currentYear,
      handleSoundToggle,
      handleMotionToggle,
      handleContrastToggle
    }
  }
}
</script>

<style scoped>
.hidden-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(100%);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 100;
  max-height: 70vh;
  overflow-y: auto;
}

.hidden-footer.visible {
  transform: translateY(0);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #4ade80;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4ade80;
}

.brand-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4ade80;
  margin: 0 0 0.5rem 0;
  border-bottom: 2px solid rgba(74, 222, 128, 0.3);
  padding-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  border-radius: 4px;
}

.footer-link:hover,
.footer-link:focus {
  color: #4ade80;
  transform: translateX(4px);
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.settings-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.3s ease;
  user-select: none;
}

.setting-label:hover {
  color: #4ade80;
}

.setting-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid #4ade80;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.setting-checkbox:checked ~ .checkmark {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
}

.setting-checkbox:checked ~ .checkmark::after {
  display: block;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.legal-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.legal-link:hover,
.legal-link:focus {
  color: #4ade80;
}

.separator {
  color: rgba(255, 255, 255, 0.4);
}

.copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
}

.copyright p {
  margin: 0;
  font-size: 0.9rem;
}

.version {
  font-size: 0.8rem !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover,
.social-link:focus {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  transform: translateY(-2px);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .legal-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 1rem;
  }
  
  .logo {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .hidden-footer {
    transition: transform 0.2s ease;
  }
  
  .footer-link:hover,
  .footer-link:focus {
    transform: none;
  }
  
  .social-link:hover,
  .social-link:focus {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .hidden-footer {
    background: #000;
    border-top-color: #fff;
  }
  
  .section-title,
  .brand-name,
  .logo-icon {
    color: #00ff00;
  }
  
  .footer-link:hover,
  .footer-link:focus {
    color: #00ff00;
  }
}

/* Global high contrast class */
:global(.high-contrast) .hidden-footer {
  background: #000;
  border-top-color: #fff;
}

:global(.high-contrast) .section-title,
:global(.high-contrast) .brand-name,
:global(.high-contrast) .logo-icon {
  color: #00ff00;
}

:global(.high-contrast) .footer-link:hover,
:global(.high-contrast) .footer-link:focus {
  color: #00ff00;
}

/* Custom scrollbar for footer */
.hidden-footer::-webkit-scrollbar {
  width: 6px;
}

.hidden-footer::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.hidden-footer::-webkit-scrollbar-thumb {
  background: rgba(74, 222, 128, 0.5);
  border-radius: 3px;
}

.hidden-footer::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 222, 128, 0.7);
}
</style>