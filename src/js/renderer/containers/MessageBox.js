import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import engine from '../main/engine'
import Ruby from '../components/Ruby'

export type Props = {
  classList: string[],
  path: string,
  loadCallback: () => void,
}

const STRONG_RUBY_STRING = '﹅'
const DEFAULT_MARKER = { wait: '▽', clear: '▼' }

class MessageBox extends React.Component {
  render() {
    if (this.props.message) {
      return (
        <div className={`ender-messageBox ${this.props.classNames.join(' ')}`}>
          <div className="ender-messageBox-inner">
            {this._generateMessageDoms(this.props.message, this.props.next)}
          </div>
        </div>
      )
    } else {
      return <div />
    }
  }

  /**
   * メッセージのDOMをメッセージ種別に応じて生成して配列にする
   * @param  {MessageInst[]} message メッセージ情報
   * @return {[type]}
   */
  _generateMessageDoms(message, next) {
    let messageDoms = []
    let style = {}
    let index = this.props.index || message.length
    let lastMessageType = get(message, '[index - 1].type')
    let periodWait =
      lastMessageType === 'period' &&
      engine.getVar('config.text.periodWait', false)
    for (let i = 0; i < index; i++) {
      let word = message[i]
      let key = `message-${i}`
      let body = word.body || ''
      let position
      if (this.props.position != null && i === index - 1) {
        position = this.props.position
        body = body.slice(0, position)
      }
      switch (word.type) {
        // 標準メッセージ
        case 'period':
        case 'text':
          messageDoms.push(
            <span key={key} style={style}>
              {body}
            </span>
          )
          break
        // メッセージ(強調)
        case 'strong':
          messageDoms.push(
            <Ruby
              key={key}
              style={style}
              kanji={word.body}
              kana={this._generateStrongRuby(word.body.length)}
              position={position}
            />
          )
          break
        // ルビ
        case 'ruby':
          messageDoms.push(
            <Ruby
              key={key}
              style={style}
              kanji={word.body}
              kana={word.kana}
              position={position}
            />
          )
          break
        // 改行
        case 'br':
          messageDoms.push(<br key={key} style={style} />)
          break
        // 書式、スタイル指定
        case 'style':
          style = word.value
          break
        // 未定義の種別ならエラー
        default:
          console.error(word)
      }
    }
    if (lastMessageType === 'br') {
      messageDoms.pop()
    }
    // マーカ
    if (periodWait || (!this.props.index && !this.props.position)) {
      const markers = engine.getVar('config.text.marker', DEFAULT_MARKER)
      if (markers[next]) {
        messageDoms.push(
          <span key="marker" className="marker">
            {markers[next]}
          </span>
        )
      }
    }
    return messageDoms
  }

  /**
   * 強調ルビの文字列生成
   * @param  {int} wordCount 強調する文字数
   * @return {string}
   */
  _generateStrongRuby(wordCount: int) {
    let ruby = ''
    const strong = engine.getVar('config.text.strong', STRONG_RUBY_STRING)
    for (let i = 0; i < wordCount; i++) {
      ruby += strong
    }
    return ruby
  }
}

const mapStateToProps = state => {
  return {
    message: state.MessageBox.message,
    next: state.MessageBox.next,
    classNames: state.MessageBox.classNames,
    index: state.MessageBox.index,
    position: state.MessageBox.position,
  }
}

export default connect(mapStateToProps)(MessageBox)
