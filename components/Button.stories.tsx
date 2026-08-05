import React from 'react'
import { Button } from './Button'

export default { title: 'Button', component: Button }

export const Primary = () => <Button variant="primary">Start Audit</Button>
export const Ghost = () => <Button variant="ghost">Cancel</Button>
export const Loading = () => <Button variant="primary" loading>Analyzing</Button>
