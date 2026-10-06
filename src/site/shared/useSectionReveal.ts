import { useEffect, type RefObject } from 'react'

export default function useSectionReveal(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    root.classList.add('ts--motion')
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    root.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    const onMotionChange = () => {
      if (media.matches) root.classList.remove('ts--motion')
    }
    media.addEventListener('change', onMotionChange)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', onMotionChange)
      root.classList.remove('ts--motion')
    }
  }, [rootRef])
}
