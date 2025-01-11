import type { Meta, StoryObj } from '@storybook/react'
import 'styled-components'

import { Test } from '.'

const meta: Meta<typeof Test> = {
  component: Test,
  title: 'Component/Test'
}

export default meta

type Story = StoryObj<typeof Test>

export const Default: Story = {}
