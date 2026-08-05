import promptEngine from '../services/promptEngine'
import best from '../services/aiBestPractices'
import fs from 'fs'

async function main() {
  const [, , templateName, dataArg] = process.argv
  if (!templateName) {
    console.error('Usage: ts-node tools/runPrompt.ts <templateName> [jsonData|pathToJson]')
    process.exit(1)
  }

  let data: any = {}
  if (dataArg) {
    try {
      if (fs.existsSync(dataArg)) data = JSON.parse(fs.readFileSync(dataArg, 'utf8'))
      else data = JSON.parse(dataArg)
    } catch (e) {
      console.error('Failed to parse dataArg as JSON or file path:', e.message)
      process.exit(1)
    }
  }

  const prompt = promptEngine.buildPrompt(templateName, { data })
  console.log('--- PROMPT ---')
  console.log(prompt)
  console.log('--------------')

  // If keys are configured, run through Best Practices wrapper
  try {
    const res = await best.runWithBestPractices(templateName, prompt, { measuredData: data })
    console.log('\n--- AI RESULT ---')
    console.log(JSON.stringify(res, null, 2))
  } catch (e: any) {
    console.error('AI run failed (keys/config may be missing):', e.message)
  }
}

main()
