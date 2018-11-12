import { Button, Col, Input, message, Row } from 'antd'
import React, { useState } from 'react'
import { IPageProps, LOCALSTORAGE } from '../'

export default (_: IPageProps) => {
  const [token, setToken] = useState(
    localStorage.getItem(LOCALSTORAGE.GIST_TOKEN) || ''
  )
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToken(e.currentTarget.value)
  const onClick = () => {
    localStorage.setItem(LOCALSTORAGE.GIST_TOKEN, token)
    message.success(`Updated by ${token}`)
  }
  return (
    <Row>
      <Col span={18}>
        <Input value={token} onChange={onChange} />
      </Col>
      <Col span={6}>
        <Button type="primary" onClick={onClick}>
          Update
        </Button>
      </Col>
    </Row>
  )
}
