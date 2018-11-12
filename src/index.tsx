import '@babel/polyfill'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'
import { render } from 'react-dom'
import Token from './pages/Token'
import Top from './pages/Top'
import Word from './pages/Word'

const { Header, Content } = Layout
const { Item } = Menu

export const FILENAME = 'db.json'

enum PAGE {
  TOP = 'TOP',
  TOKEN = 'TOKEN',
  WORD = 'REGISTER_WORD'
}

export enum LOCALSTORAGE {
  GIST_TOKEN = 'GIST_TOKEN',
  CURRENT_ID = 'CURRENT_ID'
}

interface IWord {
  word: string
  mean: string
  state: number
}

export interface IPageProps {
  words: IWord[]
  currentId: string
  setWords(next: IWord[]): void
  setCurrentId(next: string): void
}

const Pages = {
  [PAGE.TOKEN]: Token,
  [PAGE.TOP]: Top,
  [PAGE.WORD]: Word
}

const Page = () => {
  const [page, setPage] = useState<PAGE>(PAGE.TOP)
  const [words, setWords] = useState<IWord[]>([])
  const [currentId, setCurrentId] = useState(
    localStorage.getItem(LOCALSTORAGE.CURRENT_ID) || ''
  )
  const onClick = (e: any) => setPage(e.key)
  const TargetPage = Pages[page]
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <Menu onClick={onClick} selectedKeys={[page]} mode="horizontal">
          <Item key={PAGE.TOP}>Top</Item>
          <Item key={PAGE.WORD}>Register words</Item>
          <Item key={PAGE.TOKEN}>Register token</Item>
        </Menu>
      </Header>
      <Content>
        <TargetPage
          words={words}
          setWords={setWords}
          currentId={currentId}
          setCurrentId={setCurrentId}
        />
      </Content>
    </Layout>
  )
}

render(<Page />, document.getElementById('app'))
