import { Button, Col, Input, Row, Table } from 'antd'
import React, { useRef, useState } from 'react'
import { IPageProps, IWord } from '../'

const colmuns = [
  {
    dataIndex: 'word',
    key: 'word',
    title: 'Word'
  },
  {
    dataIndex: 'mean',
    key: 'mean',
    title: 'Mean'
  },
  {
    dataIndex: 'state',
    key: 'state',
    title: 'State'
  }
]

const rowKey = (row: IWord) => row.word

export default ({ words, setWords, save }: IPageProps) => {
  const [word, updateWord] = useState('')
  const [mean, updateMean] = useState('')
  const ref = useRef(null)
  const wordOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateWord(e.currentTarget.value)
  const meanOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateMean(e.currentTarget.value)
  const update = () => {
    setWords(
      words.concat([
        {
          mean,
          state: 5,
          word
        }
      ])
    )
    updateWord('')
    updateMean('')
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      update()
      if (ref.current !== null) {
        // @ts-ignore
        ref.current.focus()
      }
    }
  }
  return (
    <>
      <Row>
        <Col span={9}>
          <Input
            value={word}
            placeholder="Word..."
            onChange={wordOnChange}
            ref={ref}
          />
        </Col>
        <Col span={9}>
          <Input
            value={mean}
            placeholder="Mean..."
            onChange={meanOnChange}
            onKeyDown={onKeyDown}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={update}>
            Add
          </Button>
        </Col>
      </Row>
      <Button type="primary" onClick={save}>
        Save
      </Button>
      <Table dataSource={words} columns={colmuns} rowKey={rowKey} />
    </>
  )
}
