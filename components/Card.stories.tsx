import React from 'react'
import { Card } from './Card'

export default { title: 'Card', component: Card }

export const Default = () => (
  <Card>
    <h3 className="text-lg">Performance</h3>
    <p className="text-sm text-[#A1A1AA] mt-2">Overall score: 72</p>
  </Card>
)
