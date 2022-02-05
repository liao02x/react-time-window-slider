import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import moment from 'moment'

import TimeWindowSlider from 'src/'

describe('TimeWindowSlider', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('is truthy', () => {
    render(<TimeWindowSlider 
      time={moment()}
      timeWindow={moment.duration(6, "hours")}
      bounds={{
        maxValue: moment()
          .add(6, "hours")
          .set("minute", 0)
          .set("second", 0)
          .set("millisecond", 0),
        minValue: moment()
          .subtract(6, "hours")
          .set("minute", 0)
          .set("second", 0)
          .set("millisecond", 0)
      }}
      />, node, () => {
      expect(node.children).toBeTruthy()
    })
  })
})
