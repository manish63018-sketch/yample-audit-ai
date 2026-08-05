import fs from 'fs'
const path = './data/memory.json'

export function readMemory() {
  try {
    if (!fs.existsSync(path)) return {}
    const raw = fs.readFileSync(path, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    return {}
  }
}

export function writeMemory(obj: any) {
  try {
    fs.mkdirSync('./data', { recursive: true })
    fs.writeFileSync(path, JSON.stringify(obj, null, 2))
    return true
  } catch (err) {
    return false
  }
}

export default { readMemory, writeMemory }
