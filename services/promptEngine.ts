import templates from './promptTemplates.json'

type PromptContext = {
  role?: string
  task?: string
  rules?: string[]
  data?: any
  outputFormat?: string
}

export function buildPrompt(name: string, context: PromptContext) {
  const tpl = (templates as any)[name]
  if (!tpl) throw new Error('Template not found: ' + name)

  const role = context.role || tpl.role
  const task = context.task || tpl.task
  const rules = Array.from(new Set([...(tpl.rules || []), ...(context.rules || [])]))
  const data = context.data || {}
  const output = context.outputFormat || tpl.output

  const prompt = `ROLE:\n${role}\n\nTASK:\n${task}\n\nRULES:\n${rules.map((r: string) => '- ' + r).join('\n')}\n\nDATA:\n${JSON.stringify(data, null, 2)}\n\nOUTPUT_SCHEMA:\n${output}\n\nINSTRUCTIONS:\nRespond in JSON matching the output schema. Include confidence levels for any estimates.`
  return prompt
}

export default { buildPrompt }
