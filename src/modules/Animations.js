import gsap from 'gsap'
import SplitType from 'split-type'

export default class Animations {
  constructor() {
    // Chapter Reveal
    this.chapter = {
      stagger: {
        default: 0.035,
        randomize: 0.1,
      },
    }

    // Split texts
    new SplitType('[data-split-type="default"]', { types: 'chars' })
  }

  fadePage(_selector, _direction) {
    return new Promise((_resolve) => {
      let tl = new gsap.timeline({ paused: true })

      tl.fromTo(
        _selector,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          // ease: 'power2.out',
        }
      )

      tl.eventCallback('onComplete', _resolve)

      tl.eventCallback('onReverseComplete', _resolve)

      if (_direction == 'in') {
        tl.play()
      } else {
        tl.reverse(tl.duration())
      }
    })
  }

  fadeNavigationTitleOut(_selector) {
    return new Promise((_resolve) => {
      gsap.fromTo(
        _selector,
        {
          autoAlpha: 1,
          y: '0rem',
        },
        {
          autoAlpha: 0,
          y: '1rem',
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: _resolve,
        }
      )
    })
  }

  fadeNavigationTitleIn(_selector) {
    return new Promise((_resolve) => {
      gsap.fromTo(
        _selector,
        {
          autoAlpha: 0,
          y: '-1rem',
        },
        {
          autoAlpha: 1,
          y: '0rem',
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: _resolve,
        }
      )
    })
  }

  animateTextIn(_selector, _color) {
    return new Promise((_resolve) => {
      let tl = gsap.timeline()

      _selector.style.visibility = 'visible'

      let char = [..._selector.querySelectorAll('.char')]

      char.forEach((_char, _index) => {
        let randomizeStagger = Math.random() * this.chapter.stagger.randomize

        tl.fromTo(
          _char,
          {
            // y: '-50%',
            // scale: 0.5,
            opacity: 0,
            background: 'transparent',
            boxShadow: `0 0 0 ${_color ? _color : 'var(--color--white)'}`,
          },
          {
            // y: '0%',
            // scale: 1,
            opacity: 1,
            background: `${_color ? _color : 'var(--color--white)'}`,
            boxShadow: `0 0 5rem ${_color ? _color : 'var(--color--white)'}`,
            ease: 'steps(2)',
            duration: this.chapter.stagger.default / char.length + randomizeStagger,
            onComplete: () => {
              setTimeout(() => {
                _char.style.background = 'transparent'
                _char.style.boxShadow = `0 0 0 ${_color ? _color : 'var(--color--white)'}`
              }, 100)
            },
            // y: '0rem',
            // duration: this.gl.globalParams.params.transition.scenes.duration /,
          }
        ),
          this.chapter.stagger.default * _index + randomizeStagger
      })

      tl.eventCallback('onComplete', () => {
        _resolve()
      })
    })
  }

  animateTextOut(_selector, _color) {
    return new Promise((_resolve) => {
      let tl = gsap.timeline({
        defaults: {
          overwrite: true,
        },
      })
      let selector = [..._selector.querySelectorAll('.char')]

      selector.reverse().forEach((_char, _index) => {
        let randomizeStagger = Math.random() * (this.chapter.stagger.randomize / 4)

        tl.fromTo(
          _char,
          {
            boxShadow: `0 0 0 ${_color ? _color : 'var(--color--white)'}`,
            background: 'transparent',
          },
          {
            background: `${_color ? _color : 'var(--color--white)'}`,
            boxShadow: `0 0 5rem ${_color ? _color : 'var(--color--white)'}`,
            duration: this.chapter.stagger.default / 4 + randomizeStagger,
          },
          (this.chapter.stagger.default / 4) * _index + randomizeStagger
        )
      })

      tl.eventCallback('onComplete', () => {
        gsap.to(_selector, {
          scale: 0.95,
          ease: 'expo.inOut',
          duration: 0.25,
          clearProps: 'all',
          onComplete: () => {
            // Hide DOM
            _selector.style.visibility = 'hidden'

            // Reset Background
            selector.forEach((_char) => {
              _char.style.background = 'transparent'
            })

            setTimeout(() => {
              _resolve()
            }, 150)
          },
        })
      })
    })
  }

  fadePresentation(_direction) {
    return new Promise((_resolve) => {
      let tl = gsap.timeline({ paused: true })

      // Top Navigation Section
      tl.fromTo(
        '.overlay-navigation__section--top',
        {
          y: '-1rem',
          autoAlpha: 0,
        },
        {
          y: '0rem',
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      )

      // Bottom Navigation Section
      tl.fromTo(
        '.overlay-navigation__section--bottom',
        {
          y: '1rem',
          autoAlpha: 0,
        },
        {
          y: '0rem',
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        0
      )

      // Logo
      tl.fromTo(
        '.overlay-navigation__logotype',
        {
          width: '18%',
          scale: 1.5,
        },
        {
          width: '100%',
          scale: 1,
          duration: 1,
          ease: 'expo.inOut',
        },
        0
      )

      // Slides
      tl.fromTo(
        '.slides',
        {
          autoAlpha: 0,
          scale: 1.15,
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
        },
        0
      )

      tl.eventCallback('onComplete', _resolve)

      tl.eventCallback('onReverseComplete', _resolve)

      if (_direction == 'in') {
        this.animateTextIn(document.querySelector('.overlay-navigation__logotype--left')).then(() => {
          this.animateTextIn(document.querySelector('.overlay-navigation__logotype--right')).then(() => {
            setTimeout(() => {
              tl.play()
            }, 1000)
          })
        })
      } else {
        tl.reverse(tl.duration()).then(() => {
          this.animateTextOut(document.querySelector('.overlay-navigation__logotype--left'))
          this.animateTextOut(document.querySelector('.overlay-navigation__logotype--right'))
        })
      }
    })
  }
}
