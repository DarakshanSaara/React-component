import type { Meta, StoryObj } from '@storybook/react'
import { DataTable, type Column } from './DataTable'
import { useState } from 'react'

type User = { id: number; name: string; email: string; age: number }

const data: User[] = [
  { id: 1, name: 'Aisha', email: 'aisha@example.com', age: 26 },
  { id: 2, name: 'Rohit', email: 'rohit@example.com', age: 30 },
  { id: 3, name: 'Zara', email: 'zara@example.com', age: 22 },
  { id: 4, name: 'Kabir', email: 'kabir@example.com', age: 27 },
]

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable<User>,
  args: { data, columns },
}
export default meta
type Story = StoryObj<typeof DataTable<User>>

export const Basic: Story = {}

export const Sortable: Story = { args: { data, columns } }

export const SelectableMultiple: Story = {
  render: (args) => {
    const [sel, setSel] = useState<User[]>([])
    return (
      <>
        <DataTable<User>
          {...args}
          selectable
          selectionMode="multiple"
          rowKey="id"
          onRowSelect={setSel}
        />
        <pre>Selected: {sel.map((u) => u.name).join(', ') || 'none'}</pre>
      </>
    )
  },
}

export const SelectableSingle: Story = {
  render: (args) => {
    const [sel, setSel] = useState<User[]>([])
    return (
      <>
        <DataTable<User>
          {...args}
          selectable
          selectionMode="single"
          rowKey="id"
          onRowSelect={setSel}
        />
        <pre>Selected: {sel.map((u) => u.name).join(', ') || 'none'}</pre>
      </>
    )
  },
}

export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { data: [] } }
