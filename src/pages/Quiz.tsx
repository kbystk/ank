import { Button, Col, Row } from 'antd'
import { differenceInMilliseconds, format } from 'date-fns'
import React, { useState } from 'react'
import { IPageProps, IWord } from '../'

enum STATE {
  WAITING = 'WAITING',
  THINKING = 'THINKING',
  REVEAL = 'REVEAL',
  FINISH = 'FINISH'
}

let startTime: Date

export default ({ words, setWords, save }: IPageProps) => {
  const [current, setCurrent] = useState(0)
  const [state, setState] = useState(STATE.WAITING)
  const [diff, setDiff] = useState('')
  const filteredWords = words
    .map((w, index) => ({ ...w, index }))
    .filter(w => w.state < 6)
  const word = filteredWords[current]
  const tick = () => {
    const d = differenceInMilliseconds(new Date(), startTime)
    setDiff(format(d > 1000 ? 1000 : d, 's.SSS'))
    if (d < 1000) {
      setTimeout(tick, 1)
    }
  }
  const start = () => {
    setState(STATE.THINKING)
    startTime = new Date()
    tick()
  }
  const reveal = () => setState(STATE.REVEAL)
  const base = (fn: (w: IWord, i: number) => IWord) => () => {
    const next = words.map(fn)
    setWords(next)
    if (current + 1 < words.length) {
      setCurrent(current + 1)
      setState(STATE.THINKING)
      startTime = new Date()
      tick()
    } else {
      setState(STATE.FINISH)
    }
  }
  const inc = base((w: IWord, i: number) =>
    i === word.index ? { ...w, state: w.state + 1 } : w
  )
  const dec = base((w: IWord, i: number) =>
    i === word.index ? { ...w, state: w.state - 1 } : w
  )
  switch (state) {
    case STATE.WAITING:
      return (
        <>
          <div>{filteredWords.length}</div>
          <Button type="primary" onClick={start}>
            Start
          </Button>
        </>
      )
    case STATE.THINKING:
      return (
        <>
          <h1 style={{ fontSize: '8em' }}>{word.word}</h1>
          <h2 style={{ fontSize: '6em' }}>{diff}</h2>
          <Button type="primary" onClick={reveal}>
            Reveal
          </Button>
        </>
      )
    case STATE.REVEAL:
      return (
        <>
          <h1 style={{ fontSize: '8em' }}>{word.word}</h1>
          <h2 style={{ fontSize: '6em' }}>{word.mean}</h2>
          <Row>
            <Col span={1}>
              <Button type="primary" onClick={inc} size="large">
                +
              </Button>
            </Col>
            <Col span={1}>
              <Button type="danger" onClick={dec} size="large">
                -
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Button onClick={save}>Save</Button>
            </Col>
          </Row>
        </>
      )
    case STATE.FINISH:
      return (
        <>
          <div>Finish</div>
          <Button type="primary" onClick={save}>
            Save
          </Button>
        </>
      )
  }
}
