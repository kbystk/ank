import { Button, Col, Input, message, Row } from 'antd'
import React from 'react'
import { FILENAME, IPageProps, LOCALSTORAGE } from '../'

export default ({ setWords, currentId, setCurrentId }: IPageProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCurrentId(e.currentTarget.value)
  const onClick = () => {
    localStorage.setItem(LOCALSTORAGE.CURRENT_ID, currentId)
    message.success(`${currentId} set suceed.`)
  }
  const load = async () => {
    const res = await fetch(`https://api.github.com/gists/${currentId}`, {
      headers: {
        Authorization: `token ${localStorage.getItem(LOCALSTORAGE.GIST_TOKEN)}`
      }
    })
    const json = await res.json()
    const parsed = JSON.parse(json.files[FILENAME].content)
    setWords(parsed)
    message.success(`${currentId} loaded!`)
  }
  return (
    <>
      <Row>
        <Col span={18}>
          <Input value={currentId} onChange={onChange} />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={onClick}>
            Update
          </Button>
        </Col>
      </Row>
      <Button type="primary" onClick={load}>
        Load
      </Button>
    </>
  )
}
