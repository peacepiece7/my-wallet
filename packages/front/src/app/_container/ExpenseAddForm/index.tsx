'use client'
import { useState } from 'react'
import styled from 'styled-components'
import { SPACE } from '@/styles/common'
import { usePersistCategory } from '@/hooks/usePersistCategory'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { expenseAddIsFetchingState, searchQueryState } from '@/store/expenseFetchingState'
import { Spin } from '@/components/Loading/Spin'
import { Button } from '@/components/Buttons/Button'
import { UncontrolledInput as Input } from '@/components/Inputs/UncontrolledInput'
import { ChildrenWith } from '@/components/UI/ChildrenWith'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { AddIcon } from '@/components/UI/AddIcon'
import { AutoCompleteInput } from './AutoCompleteInput'
import { dayManager } from '@/util/dayManager'
import { useExpensesListMutation } from '@/hooks/mutation/expense'
import { DatePicker } from '@/components/DatePicker'
interface AddExpenseBody {
  date: string
  cost: number
  content: string
}

export default function ExpenseAddForm() {
  const [date, setDate] = useState<Date | null>(new Date())
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState)
  const [isFetching, setIsFetching] = useRecoilState(expenseAddIsFetchingState)
  const { setPersist } = usePersistCategory()
  const { addExpenseMutate } = useExpensesListMutation()
  const { register, reset, handleSubmit } = useForm<AddExpenseBody>()
  const { isMobile } = useMediaQuery()

  const onSubmit = (body: AddExpenseBody) => {
    if (!date) return
    body.date = dayManager.formatDate(date)
    addExpenseMutate({ ...body, category: searchQuery })
    setIsFetching(true)
    setPersist(searchQuery)
    reset()
    setSearchQuery('')
  }

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} $isMobile={isMobile}>
      <DatePicker selected={date} onChange={(currentDate) => setDate(currentDate)} />
      <AutoCompleteInput />
      {/* prettier-ignore */}
      <Input type="number" placeholder="금액" required min={0} $size={isMobile ? 'full' : 'medium'} {...register('cost')} />
      <Input type="text" placeholder="내용" $size={isMobile ? 'full' : 'large'} {...register('content')} />
      <Button
        type="submit"
        $size="small"
        title="소비 내역 추가하기"
        style={
          isMobile
            ? {
                alignSelf: 'flex-end'
              }
            : {
                margin: 0,
                marginLeft: '0.5rem'
              }
        }
      >
        <ChildrenWith
          isLoading={isFetching}
          loadingElement={<Spin />}
          isMobile={isMobile}
          mobileElement={<AddIcon />}
          defaultElement={<p>추가</p>}
        />
      </Button>
    </FormContainer>
  )
}

const FormContainer = styled.form<{ $isMobile: boolean }>`
  display: flex;
  justify-content: flex-end;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
  margin: ${SPACE[12]};
  & > * {
    margin: ${({ $isMobile }) => ($isMobile ? `${SPACE[4]} 0` : `0 ${SPACE[2]}`)};
  }
  button {
    width: fit-content;
    white-space: nowrap;
  }
`
