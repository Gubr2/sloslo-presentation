import 'reveal.js/dist/reveal.css'
import './styles/index.scss'
import Reveal from 'reveal.js'
import { Timer, Time, TimerOptions } from 'timer-node'

import Animations from './modules/Animations'

export default class App {
  constructor() {
    this.animations = new Animations()

    this.flags = {
      keyboard: true,
      previousH: null,
    }

    // ---> Reveal.js
    this.deck = new Reveal({
      keyboard: {
        37: null,
        38: null,
        39: null,
        40: null,
      },
    })

    // Init
    this.deck.initialize({
      // width: window.innerWidth,
      // height: window.innerHeight,
      // margin: 0,
      minScale: 1,
      maxScale: 1,
      controls: false,
      backgroundTransition: 'none',
      navigationMode: 'linear',

      // Slide number
      // slideNumber: 'v.h',
    })

    // Resize
    this.deck.on('resize', (_e) => {
      this.deck.layout()
    })

    // Slide Changed
    this.deck.on('slidechanged', (_e) => {
      // Set Chapter Title
      if (_e.indexh != this.flags.previousH) {
        this.animations.fadeNavigationTitleOut('.overlay-navigation__chapter-title').then(() => {
          this.handlePageTitle('.overlay-navigation__chapter-title', [...document.querySelectorAll('[data-chapter-title]')][_e.indexh].dataset.chapterTitle)
          this.animations.fadeNavigationTitleIn('.overlay-navigation__chapter-title')
        })
      }

      // Handle bigger font in intro
      if (_e.indexh <= 1 || this.deck.isLastSlide()) {
        document.querySelector('.overlay-navigation').classList.add('overlay-navigation--intro')
      } else {
        document.querySelector('.overlay-navigation').classList.remove('overlay-navigation--intro')
      }

      this.flags.previousH = _e.indexh
    })

    // Custom Keyboard Events
    document.addEventListener('keyup', (_e) => {
      if (_e.code === 'ArrowRight' && this.flags.keyboard) {
        this.handlePageTransition('next')
      } else if (_e.code === 'ArrowLeft' && this.flags.keyboard) {
        this.handlePageTransition('prev')
      }
    })

    // Set Countdown
    this.timer = new Timer()

    this.setTimer()
  }

  handlePageTransition(_direction) {
    this.flags.keyboard = false

    // Fade Out Chapter Divider
    if (document.querySelector('section .present').classList.contains('chapter-divider')) {
      this.animations.animateTextOut(document.querySelector('.present .chapter-divider__headline'))
    }

    // Fade Out Page
    Promise.all([
      //
      this.animations.fadePage('section .present', 'out'),
      this.animations.fadeNavigationTitleOut('.overlay-navigation__page-title'),
    ]).then(() => {
      // Animate In Intro
      if (this.deck.isFirstSlide()) {
        this.animations.fadePresentation('in')
        this.timer.stop()
        this.timer.start()
      }

      if (this.deck.isLastSlide()) {
        this.animations.fadePresentation('in')
      }

      // Handle direction
      if (_direction === 'next') {
        this.deck.next()
      } else {
        this.deck.prev()
      }

      // Fade In Chapter Title
      if (document.querySelector('section .present').classList.contains('chapter-divider')) {
        this.animations.animateTextIn(document.querySelector('.present .chapter-divider__headline'))
      }

      // Set Page Title
      this.handlePageTitle('.overlay-navigation__page-title', document.querySelector('section .present').dataset.pageTitle)

      // Animate Out Intro
      if (this.deck.isFirstSlide()) {
        this.animations.fadePresentation('out')
      }

      if (this.deck.isLastSlide()) {
        this.animations.fadePresentation('out')
      }

      // Animate Circle
      if (document.querySelector('section .present').classList.contains('link-to-project')) {
        this.animations.animateInLinkToProject()
      }

      // Play Video
      let videos = [...document.querySelectorAll('section .present video')]
      if (videos.length > 0) {
        videos.forEach((_video) => {
          _video.currentTime = 0
          _video.play()
        })
      }

      // Fade In Chapter Divider
      Promise.all([
        //
        this.animations.fadePage('section .present', 'in'),
        this.animations.fadeNavigationTitleIn('.overlay-navigation__page-title'),
      ]).then(() => {
        this.flags.keyboard = true
      })
    })
  }

  handlePageTitle(_selector, _content) {
    if (_content) {
      document.querySelector(_selector).innerHTML = _content
    } else {
      document.querySelector(_selector).innerHTML = ''
    }
  }

  setTimer() {
    this.countownInterval = setInterval(() => {
      document.querySelector('.overlay-navigation__timer').textContent = this.timer.time().m.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ':' + this.timer.time().s.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    }, 1000)
  }
}
