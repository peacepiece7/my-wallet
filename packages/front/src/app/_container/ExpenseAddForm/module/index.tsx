'use client'

import useKeyboardEvent from '@/hooks/useKeyboardEvent'
import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { ForwardList } from './List'

export interface AutoCompleteItem {
  id: string
  value: string
  selected?: boolean
}

export interface AutoCompleteProps<T extends AutoCompleteItem> {
  items?: T[]
  onEnter: (item: T) => void
  onSelect?: (value: string) => void
  isLoading?: boolean
  recommendStateBeforeChange?: string[]
  reset: boolean
  style?: HTMLAttributes<HTMLElement>['style']
  renderListOptions: (item: AutoCompleteItem, isSelected: boolean) => JSX.Element | string
  renderListIsLoading?: () => JSX.Element | string
  inputStyle?: HTMLAttributes<HTMLInputElement>['style']
}

export default function AutoComplete<T extends AutoCompleteItem>({
  items,
  onEnter,
  onSelect: onSelectList,
  isLoading,
  recommendStateBeforeChange: state,
  reset,
  renderListIsLoading,
  renderListOptions,
  inputStyle
}: AutoCompleteProps<T>) {
  const [list, setList] = useState<T[]>()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const { open, setOpen } = useKeyboardEvent<HTMLInputElement, T>(inputRef, list, handleKeyDown, handleSubmit)

  function handleKeyDown(item: T) {
    setList(
      (prev) =>
        prev?.map((prevItem) =>
          prevItem.id === item.id ? { ...prevItem, selected: true } : { ...prevItem, selected: false }
        )
    )
  }

  function handleSubmit(item: T) {
    inputRef.current!.value = ''
    setInputValue(item.value)
    onEnter(item)
  }

  function handleMounseDown(item: T) {
    inputRef.current!.value = ''
    setInputValue(item.value)
    onEnter(item)
  }

  // * Open 상태이고, 인풋 창이 비었을 때, 추천 카테고리를 보여줍니다.
  useEffect(() => {
    if (open && !inputValue) {
      const recommendList = state?.map((item) => ({
        id: item,
        value: item,
        selected: false
      }))
      setList(recommendList as T[])
    } else {
      setList(items)
    }
  }, [inputValue, open, state, items])

  useEffect(() => {
    if (reset) {
      setInputValue('')
    }
  }, [reset])

  return (
    <div
      className="greenbean-pack-auto-complete"
      style={{
        position: 'relative',
        width: `${inputStyle?.width ?? '100%'}`,
        height: `${inputStyle?.height ?? 'auto'}`,
        padding: `${inputStyle?.padding ?? '0'}`,
        margin: `${inputStyle?.margin ?? '0'}`
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="카테고리"
        autoComplete="off"
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setInputValue(e.target.value)
          onSelectList && onSelectList(e.target.value)
        }}
        value={inputValue}
        required
        style={{ ...inputStyle, margin: 0, padding: 0 }}
      />
      <ForwardList
        ref={listRef}
        items={list}
        open={open}
        onMounseDown={(item) => handleMounseDown(item as T)}
        isLoading={isLoading}
        renderListOptions={renderListOptions}
        renderListIsLoading={renderListIsLoading}
      />
    </div>
  )
}
