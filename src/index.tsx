import '@babel/polyfill'
import { Layout, LocaleProvider, Menu, message } from 'antd'
import ja_JP from 'antd/lib/locale-provider/ja_JP'
import React, { useState } from 'react'
import { render } from 'react-dom'
import Quiz from './pages/Quiz'
import Token from './pages/Token'
import Top from './pages/Top'
import Word from './pages/Word'

const { Header, Content } = Layout
const { Item } = Menu

export const FILENAME = 'db.json'

enum PAGE {
  TOP = 'TOP',
  TOKEN = 'TOKEN',
  WORD = 'REGISTER_WORD',
  QUIZ = 'QUIZ'
}

export enum LOCALSTORAGE {
  GIST_TOKEN = 'GIST_TOKEN',
  CURRENT_ID = 'CURRENT_ID'
}

export interface IWord {
  word: string
  mean: string
  state: number
}

export interface IPageProps {
  words: IWord[]
  currentId: string
  setWords(next: IWord[]): void
  setCurrentId(next: string): void
  save(): void
}

const Pages = {
  [PAGE.TOKEN]: Token,
  [PAGE.TOP]: Top,
  [PAGE.WORD]: Word,
  [PAGE.QUIZ]: Quiz
}

const Page = () => {
  const [page, setPage] = useState<PAGE>(PAGE.TOP)
  const [words, setWords] = useState<IWord[]>([])
  const [currentId, setCurrentId] = useState(
    localStorage.getItem(LOCALSTORAGE.CURRENT_ID) || ''
  )
  const onClick = (e: any) => setPage(e.key)
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
  const TargetPage = Pages[page]
  return (
    <LocaleProvider locale={ja_JP}>
      <Layout>
        <Header style={{ backgroundColor: '#fff' }}>
          <Menu onClick={onClick} selectedKeys={[page]} mode="horizontal">
            <Item key={PAGE.TOP}>Top</Item>
            <Item key={PAGE.QUIZ}>Quiz</Item>
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
            save={save}
          />
        </Content>
      </Layout>
    </LocaleProvider>
  )
}

render(<Page />, document.getElementById('app'))
