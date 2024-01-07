import { fetcher } from '@/client/fetcher'
import { Expenses } from '@/model'
import { useMutation, useSuspenseInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { addExpenseApi, deleteExpenseApi, updateExpenseApi } from '@/client/expenses'
import { useIntersectionObserver } from 'greenbean-pack'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { expenseDeleteQueue, expenseEditQueue } from '@/store/expenseFetchingState'
import { EXPENSES } from '@/constants/query'
import { searchState, sortState } from '@/store/filterState'

export interface ExpensesListData {
  content: Expenses[]
  currentPage: number
  pageSize: number
  totalCount: number
  totalPage: number
}

export const useExpensesListInfiniteQuery = () => {
  const queryClient = useQueryClient()
  const setExpenseEditQueue = useSetRecoilState(expenseEditQueue)
  const setExpenseDeleteQueue = useSetRecoilState(expenseDeleteQueue)
  const searchQuery = useRecoilValue(searchState)
  const sortQuery = useRecoilValue(sortState)
  const { data, fetchNextPage, isLoading, isFetching, isFetchingNextPage } = useSuspenseInfiniteQuery<ExpensesListData>(
    {
      queryKey: [EXPENSES, searchQuery, sortQuery],
      queryFn: ({ pageParam }) =>
        fetcher(`/api/expenses?page=${pageParam}&q=${searchQuery ?? ''}&sort=${sortQuery ?? ''}`),
      getNextPageParam: (lastPage) => {
        if (lastPage.totalPage > lastPage.currentPage) {
          return lastPage.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 0
    }
  )

  const ref = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(ref, {})

  useEffect(() => {
    if (entry) fetchNextPage()
  }, [entry])

  const errorHandler = (error: Error) => {
    process.env.NODE_ENV === 'development' && console.error(error)
    alert(error.message)
  }

  const addExpense = useMutation({
    mutationFn: addExpenseApi,
    onError: errorHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXPENSES]
      })
    }
  })

  const updateExpense = useMutation({
    mutationFn: updateExpenseApi,
    onSuccess: (_data, variable) => {
      queryClient.invalidateQueries({
        queryKey: [EXPENSES]
      })
      setExpenseEditQueue((prev) => prev.filter((id) => id !== variable.id))
    },
    onError: errorHandler
  })

  const deleteExpense = useMutation({
    mutationFn: deleteExpenseApi,
    onMutate: (expenseId) => {
      queryClient.setQueryData(
        [EXPENSES, searchQuery, sortQuery],
        (prev: { pages: ExpensesListData[]; pageParams: number[] }) => {
          console.log('PREV DATA :', prev)
          const pages = prev.pages.map((page) => ({
            ...page,
            content: page.content.filter((expense) => expense.id !== expenseId)
          }))
          return {
            ...prev,
            pages
          }
        }
      )
    },
    onSuccess: (_data, expenseId) => {
      queryClient.invalidateQueries({
        queryKey: [EXPENSES]
      })
      setExpenseDeleteQueue((prev) => prev.filter((id) => id !== expenseId))
    },
    onError: errorHandler
  })

  const expenseList = data.pages.flatMap((page) => [...page.content])

  return {
    expenseList,
    triggerRef: ref,
    isFetching,
    isFetchingNextPage,
    isLoading,
    updateExpenseMutate: updateExpense.mutate,
    deleteExpenseMutate: deleteExpense.mutate,
    addExpenseMutate: addExpense.mutate
  }
}
