import { useMemo, useState } from 'react'
import styles from './DataTable.module.css'

export interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  /** Optional extras to satisfy single/multiple requirement cleanly */
  selectionMode?: 'single' | 'multiple'
  rowKey?: keyof T | ((row: T) => string | number)
  emptyMessage?: string
}

function getVal(v: unknown) {
  if (v instanceof Date) return v.getTime()
  if (typeof v === 'number') return v
  if (typeof v === 'string') return v.toLowerCase()
  return String(v ?? '').toLowerCase()
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  selectionMode = 'multiple',
  rowKey,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; dir: 'asc' | 'desc' } | null>(null)
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set())

  const getKey = (row: T, index: number) => {
    if (typeof rowKey === 'function') return rowKey(row)
    if (rowKey) return row[rowKey] as unknown as string | number
    return index
  }

  const sorted = useMemo(() => {
    if (!sort) return data
    const { key, dir } = sort
    const copy = [...data]
    copy.sort((a, b) => {
      const av = getVal((a as any)[key])
      const bv = getVal((b as any)[key])
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [data, sort])

  const toggleSort = (col: Column<T>) => {
    if (!col.sortable) return
    setSort((prev) => {
      const dir: 'asc' | 'desc' = prev && prev.key === col.dataIndex && prev.dir === 'asc' ? 'desc' : 'asc'
      return { key: col.dataIndex, dir }
    })
  }

  const onSelectKey = (key: string | number) => {
    const next = new Set(selectedKeys)
    if (selectionMode === 'single') {
      next.clear()
      next.add(key)
    } else {
      next.has(key) ? next.delete(key) : next.add(key)
    }
    setSelectedKeys(next)
    onRowSelect?.(sorted.filter((row, i) => next.has(getKey(row, i))))
  }

  if (loading) {
    return (
      <div className={styles.statusWrap} role="status" aria-live="polite">
        Loading…
        <span className={styles.spinner} aria-hidden="true" />
      </div>
    )
  }

  if (!sorted.length) {
    return (
      <div className={styles.statusWrap} role="status" aria-live="polite">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && <th aria-label="Selection column" />}
            {columns.map((c) => {
              const isSorted = sort?.key === c.dataIndex
              const ariaSort = c.sortable ? (isSorted ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined
              return (
                <th key={c.key} aria-sort={ariaSort as any}>
                  {c.sortable ? (
                    <button
                      type="button"
                      className={styles.sortBtn}
                      onClick={() => toggleSort(c)}
                      aria-label={`Sort by ${c.title}`}
                    >
                      {c.title}
                      <span className={styles.sortIcon} aria-hidden="true">
                        {isSorted ? (sort!.dir === 'asc' ? '▲' : '▼') : '⇅'}
                      </span>
                    </button>
                  ) : (
                    c.title
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => {
            const key = getKey(row, idx)
            const checked = selectedKeys.has(key)
            return (
              <tr key={String(key)} className={checked ? styles.rowSelected : undefined}>
                {selectable && (
                  <td>
                    {selectionMode === 'single' ? (
                      <input
                        aria-label="Select row"
                        type="radio"
                        checked={checked}
                        onChange={() => onSelectKey(key)}
                      />
                    ) : (
                      <input
                        aria-label="Select row"
                        type="checkbox"
                        checked={checked}
                        onChange={() => onSelectKey(key)}
                      />
                    )}
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key}>{String((row as any)[c.dataIndex] ?? '')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
