# react-swiper
This project is attempt to provide a user-friendly Swiper component for React projects, by using [Swipe.js](https://github.com/nolimits4web/swiper/) and mobx.

# Swiper Props

```ts
interface ISwiperProps {
  options?: object // object with Swiper.js parameters
  activeIndex?: number // specify swiper's activeIndex, start from 0
  onChange?: (index?: number) => void
  className?: string
}
```

Notice: Considering the loading on demand, we use dynamic import. For the time being, the swiper only supports Navigation plugin by default, and Pagination, Scrollbar will be added dynamically if `ISwiperProps.options` contains the property `pagination` or `scrollbar`, cause these plugins are used frequently. If you really need other plugins or any other suggestion, an issue or PR is welcome.

# Usage
```tsx
import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import autobind from 'autobind-decorator'

import Swiper from 'react-swiper/Swiper'

@observer
export default class Demo extends React.Component<{}> {
  @observable swiperIndex: number

  @action updateSwiperIndex(index: number) {
    this.swiperIndex = index
  }

  @autobind
  handleIndexChange(index: number) {
    console.log('current: '+ index)
  }

  render() {
    const options = {
      slidesPerView: 1
    }

    return (
      <Swiper
        options={options}
        activeIndex={this.swiperIndex}
        onChange={this.handleIndexChange}
      >
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </Swiper>
    )
  }
}
```

# TODO

- add test
- fully adapted to swiper.js
- add release workflow
