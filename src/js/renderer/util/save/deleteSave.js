//@flow
import path from 'path'
import fs from 'fs'
import engine from '../../main/engine'
import store from '../../main/store'
import { deleteSave as deleteSaveAction } from '../../actions/actions'
import { isExistFile } from '../util'
import { SAVE_EXT_NAME } from './config'

export function deleteSave(name: string): void {
  const config = engine.getVar('config')

  const saveFilePath = path.join(
    config.basePath || '',
    config.savePath || '',
    name + SAVE_EXT_NAME
  )

  if (isExistFile(saveFilePath)) {
    fs.unlink(saveFilePath, err => {
      if (err) {
        console.warn(err)
      } else {
        console.log('done delete save data')
      }
    })
  }

  store.dispatch(deleteSave(name))
}
