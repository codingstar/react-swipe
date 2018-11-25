/**
 * @desc component for react swiper
 * @author yaojingtian <yaojingtian@qiniu.com>
 */

import * as React from 'react'
import { observer } from 'mobx-react'
import autobind from 'autobind-decorator'
import { reaction } from 'mobx'

import Disposable from './disposable'

import 'swiper/dist/css/swiper.min.css'
import './style.less'

interface ISwiperProps {
  options?: object // object with Swiper parameters
  className?: string
  activeIndex?: number // specify swipe's activeIndex, start from 0
  onChange?: (index?: number) => void
}

const defaultOptions = {
  observer: true, // In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)
  mousewheel: false,
  continuous: false,
  slidesPerView: 'auto',
  spaceBetween: 16,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
}

@observer
export default class Swiper extends React.Component<ISwiperProps> {
  private disposable = new Disposable()
  private comp: HTMLElement = null

  @autobind
  updateComp(ref) {
    this.comp = ref
  }

  swiper = null

  createSwiper() {
    import('swiper/dist/js/swiper.esm.js').then(
      ({ Swiper: SwiperJs, Navigation, Pagination, Scrollbar }) => {
        // 可能用到的组件
        const uses = [
          Navigation,
          this.props.options && this.props.options['pagination'] && Pagination,
          this.props.options && this.props.options['scrollbar'] && Scrollbar
        ].filter(Boolean)

        SwiperJs.use(uses)

        // 创建 swiper 实例
        this.swiper = new SwiperJs(this.comp, {
          ...defaultOptions,
          ...this.props.options
        })

        if (this.props.activeIndex != null) {
          this.swiper.slideTo(this.props.activeIndex)
        }
      }
    )

  }

  @autobind
  handlePrevClick() {
    const current = this.swiper.activeIndex
    if (this.props.onChange) {
      this.props.onChange(current)
    }
  }

  @autobind
  handleNextClick() {
    const current = this.swiper.activeIndex
    if (this.props.onChange) {
      this.props.onChange(current)
    }
  }

  componentDidMount() {
    this.disposable.addDisposer(reaction(
      () => this.props.options,
      () => this.createSwiper(),
      {
        fireImmediately: true,
        compareStructural: true
      }
    ))

    this.disposable.addDisposer(reaction(
      () => this.props.activeIndex,
      index => {
        if (index == null || !this.swiper) {
          return
        }
        this.swiper.slideTo(index)
      },
      { fireImmediately: true }
    ))
  }

  componentWillUnmount() {
    this.swiper.destroy(true, true)
    this.disposable.dispose()
  }

  render() {
    const { children } = this.props

    const slides = React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return null
      }

      return (
        <div className="swiper-slide" key={child.key}>
          {child}
        </div>
      )
    })

    const className = [
      'swiper-container',
      this.props.className
    ].filter(Boolean).join(' ')

    const height = (
      this.comp
      ? this.comp.clientHeight
      : 'auto'
    )

    return (
      <div className={className} ref={this.updateComp}>
        <div className="swiper-button-prev" onClick={this.handlePrevClick}></div>
        <div className="swiper-wrapper" style={{ height }}>
          {slides}
        </div>
        <div className="swiper-button-next" onClick={this.handleNextClick}></div>
      </div>
    )
  }
}
