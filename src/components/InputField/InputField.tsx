import React, { useId, useMemo, useState } from 'react'
import clsx from 'clsx'
import styles from './InputField.module.css'

export type InputVariant = 'filled' | 'outlined' | 'ghost'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputFieldProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  invalid?: boolean
  loading?: boolean
  variant?: InputVariant
  size?: InputSize
  /** optional additions beyond brief */
  type?: React.HTMLInputTypeAttribute
  allowClear?: boolean
  showPasswordToggle?: boolean
  id?: string
  name?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  allowClear = true,
  showPasswordToggle = true,
  id,
  name,
}) => {
  const reactId = useId()
  const inputId = id ?? `input-${reactId}`
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  const [showPassword, setShowPassword] = useState(false)
  const actualType = type === 'password' && showPassword ? 'text' : type

  const describedBy = useMemo(() => {
    const ids: string[] = []
    if (!invalid && helperText) ids.push(helperId)
    if (invalid && errorMessage) ids.push(errorId)
    return ids.join(' ') || undefined
  }, [invalid, helperText, errorMessage, helperId, errorId])

  return (
    <div className={clsx(styles.wrapper, styles[size])}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={clsx(
          styles.field,
          styles[variant],
          disabled && styles.disabled,
          invalid && styles.invalid,
          loading && styles.loadingState
        )}
      >
        <input
          id={inputId}
          name={name}
          className={styles.input}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        {/* Clear button */}
        {allowClear && !disabled && !loading && value && value.length > 0 && (
          <button
            type="button"
            aria-label="Clear input"
            className={styles.iconBtn}
            onClick={(e) => {
              const target = e.currentTarget.previousElementSibling as HTMLInputElement | null
              if (target && onChange) {
                const evt = { target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>
                onChange(evt)
                target.focus()
              }
            }}
          >
            ×
          </button>
        )}

        {/* Password toggle */}
        {type === 'password' && showPasswordToggle && !disabled && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={styles.iconBtn}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}

        {/* Loading spinner */}
        {loading && <span className={clsx(styles.spinner)} aria-hidden="true" />}
      </div>

      {helperText && !invalid && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
      {invalid && errorMessage && (
        <p id={errorId} role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}
    </div>
  )
}
