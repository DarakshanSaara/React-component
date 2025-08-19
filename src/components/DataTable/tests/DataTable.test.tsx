import { render, screen, fireEvent } from '@testing-library/react'
import { DataTable, type Column } from '../DataTable'
import { describe, it, expect, vi } from 'vitest'   // ✅ use Vitest instead of node:test

type Row = { id: number; name: string; age: number }

const rows: Row[] = [
  { id: 1, name: 'C', age: 30 },
  { id: 2, name: 'A', age: 22 },
  { id: 3, name: 'B', age: 26 },
]

const cols: Column<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

describe('DataTable', () => {
  it('sorts by clicking header', () => {
    render(<DataTable<Row> data={rows} columns={cols} />)

    const nameHeader = screen.getByRole('button', { name: /sort by name/i })
    fireEvent.click(nameHeader) // asc sort

    const cells = screen.getAllByRole('cell').filter((_, i) => i % 2 === 0) // first col
    expect(cells.map((c) => c.textContent)).toEqual(['A', 'B', 'C'])
  })

  it('selects rows (multiple)', () => {
    const onSel = vi.fn()
    render(
      <DataTable<Row>
        data={rows}
        columns={cols}
        selectable
        selectionMode="multiple"
        rowKey="id"
        onRowSelect={onSel}
      />
    )

    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    fireEvent.click(boxes[2])

    expect(onSel).toHaveBeenLastCalledWith([rows[0], rows[2]])
  })
})
