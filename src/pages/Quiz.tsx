import { Button, Col, Row, Select } from 'antd'
import { differenceInMilliseconds, format } from 'date-fns'
import React, { useState } from 'react'
import { IPageProps, IWord } from '../'

import { SelectValue } from 'antd/lib/select'

const { Option } = Select

enum STATE {
  WAITING = 'WAITING',
  THINKING = 'THINKING',
  REVEAL = 'REVEAL',
  FINISH = 'FINISH'
}

let startTime: Date

interface IIndexedWord extends IWord {
  index: number
}

interface IProps {
  master: IWord[]
  words: IIndexedWord[]
  save(): void
  setWords(next: IWord[]): void
  setShuffledWords(next: IIndexedWord[]): void
}

const Quiz = ({ save, master, words, setWords, setShuffledWords }: IProps) => {
  const [current, setCurrent] = useState(0)
  const [state, setState] = useState(STATE.WAITING)
  const [diff, setDiff] = useState('')
  const word = words[current]
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
    const next = master.map(fn)
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
  const finish = () => {
    save()
    setShuffledWords([])
  }
  switch (state) {
    case STATE.WAITING:
      return (
        <Button type="primary" onClick={start}>
          Start: {words.length}
        </Button>
      )
    case STATE.THINKING:
      return (
        <>
          <h1 style={{ fontSize: '3rem', wordBreak: 'break-all' }}>
            {word.word}
          </h1>
          <h2 style={{ fontSize: '2rem' }}>{diff}</h2>
          <Button type="primary" onClick={reveal}>
            Reveal
          </Button>
        </>
      )
    case STATE.REVEAL:
      return (
        <>
          <h1 style={{ fontSize: '3rem', wordBreak: 'break-all' }}>
            {word.word}
          </h1>
          <h2 style={{ fontSize: '2rem', wordBreak: 'break-all' }}>
            {word.mean}
          </h2>
          <Row>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                onClick={inc}
                size="large"
                style={{ fontSize: '2rem', height: '4rem', width: '4rem' }}
              >
                +
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Button
                type="danger"
                onClick={dec}
                size="large"
                style={{ fontSize: '2rem', height: '4rem', width: '4rem' }}
              >
                -
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={save}>Save</Button>
            </Col>
          </Row>
        </>
      )
    case STATE.FINISH:
      return (
        <>
          <div>Finish</div>
          <Button type="primary" onClick={finish}>
            Save
          </Button>
        </>
      )
  }
}

export default ({ words, setWords, save }: IPageProps) => {
  const [shuffledWords, setShuffledWords] = useState<IIndexedWord[]>([])
  const [targetState, setTargetState] = useState(5)
  const stateMap = words
    .map((word, index) => ({ ...word, index }))
    .reduce((prev, curr) => {
      const target = prev.get(curr.state)
      target
        ? prev.set(curr.state, [...target, curr])
        : prev.set(curr.state, [curr])
      return prev
    }, new Map())
  const sortedKeys = Array.from(stateMap.keys()).sort((x, y) => x - y)
  const onChange = (value: SelectValue) => setTargetState(value as number)
  const shuffle = () => {
    const candidate = stateMap.get(targetState)
    for (let i = 0; i < candidate.length; i++) {
      const rand = Math.floor(Math.random() * i)
      const swp = candidate[i]
      candidate[i] = candidate[rand]
      candidate[rand] = swp
    }
    setShuffledWords(candidate)
  }
  return shuffledWords.length === 0 ? (
    <>
      <ul>
        {sortedKeys.map(key => (
          <li key={key}>
            {key}:{stateMap.get(key).length}
          </li>
        ))}
      </ul>
      <Select value={targetState} onChange={onChange}>
        {sortedKeys.map(key => (
          <Option key={key} value={key}>
            {key}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={shuffle}>
        Shuffle
      </Button>
    </>
  ) : (
    <Quiz
      save={save}
      master={words}
      words={shuffledWords}
      setWords={setWords}
      setShuffledWords={setShuffledWords}
    />
  )
}
