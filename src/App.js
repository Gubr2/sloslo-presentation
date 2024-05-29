import 'reveal.js/dist/reveal.css'
import './styles/index.scss'
import Reveal from 'reveal.js'

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
      if (_e.indexh <= 1) {
        console.log(document.querySelector('.overlay-navigation__section--bottom'))
        document.querySelector('.overlay-navigation__section--bottom').classList.add('overlay-navigation__section--bottom--intro')
      } else {
        document.querySelector('.overlay-navigation__section--bottom').classList.remove('overlay-navigation__section--bottom--intro')
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
      document.querySelector(_selector).textContent = _content
    } else {
      document.querySelector(_selector).textContent = ''
    }
  }
}
