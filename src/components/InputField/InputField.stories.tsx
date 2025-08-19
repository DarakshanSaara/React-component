import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { InputField, type InputFieldProps } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: { label: 'Your Name', placeholder: 'Type here…' },
}
export default meta
type Story = StoryObj<typeof InputField>

export const Outlined: Story = {
  args: { variant: 'outlined', size: 'md', helperText: 'We never share your data.' },
}

export const Filled: Story = { args: { variant: 'filled', size: 'md' } }
export const Ghost: Story = { args: { variant: 'ghost', size: 'md' } }

export const Sizes: Story = {
  render: (args: InputFieldProps) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <InputField {...args} size="sm" label="Small" />
      <InputField {...args} size="md" label="Medium" />
      <InputField {...args} size="lg" label="Large" />
    </div>
  ),
}

export const Invalid: Story = {
  args: { invalid: true, errorMessage: 'This field is required.' },
}

export const Disabled: Story = { args: { disabled: true, value: 'Readonly' } }

export const Loading: Story = { args: { loading: true, value: 'Checking…' } }

export const WithClearAndPasswordToggle: Story = {
  render: () => {
    const [val, setVal] = useState('hello')
    const [pwd, setPwd] = useState('secret')
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <InputField label="Clearable" value={val} onChange={(e) => setVal(e.target.value)} allowClear />
        <InputField label="Password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </div>
    )
  },
}
