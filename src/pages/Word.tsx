import { Button, Col, Input, message, Row, Table } from 'antd'
import React, { useState } from 'react'
import { FILENAME, IPageProps, LOCALSTORAGE } from '../'

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

export default ({ words, setWords, currentId }: IPageProps) => {
  const [word, updateWord] = useState('')
  const [mean, updateMean] = useState('')
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
  const save = async () => {
    await fetch(`https://api.github.com/gists/${currentId}`, {
      body: JSON.stringify({
        files: {
          [FILENAME]: {
            content: JSON.stringify(words)
          }
        }
      }),
      headers: {
        Authorization: `token ${localStorage.getItem(LOCALSTORAGE.GIST_TOKEN)}`
      },
      method: 'PATCH'
    })
    message.success(`${currentId} saved!`)
  }
  return (
    <>
      <Row>
        <Col span={9}>
          <Input value={word} placeholder="Word..." onChange={wordOnChange} />
        </Col>
        <Col span={9}>
          <Input value={mean} placeholder="Mean..." onChange={meanOnChange} />
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
      <Table dataSource={words} columns={colmuns} />
    </>
  )
}
