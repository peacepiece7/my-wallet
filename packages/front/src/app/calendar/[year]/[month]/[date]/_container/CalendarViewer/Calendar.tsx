'use client'
import { useRouter } from 'next/navigation'
import ReactCalendar, { TileArgs } from 'react-calendar'
import { dayManager } from '@/util/dayManager'
import { CalendarPageProps } from '../../page'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCalendarQuery } from '@/hooks/useCalendarQuery'
import { Expenses } from '@/model'
import './Calendar.css'
import { useMouseWheel } from '@/hooks/useMouseWheel'
import { useRecoilValue } from 'recoil'
import { calendarModalState } from '@/store/calendarModalState'

type CalendarProps = CalendarPageProps['params'] & {
  onOpen: (date: string) => void
}

export default function Calendar({ date, month, year, onOpen }: CalendarProps) {
  const router = useRouter()
  const wheel = useMouseWheel()
  const [activeDate, setActiveDate] = useState(dayManager.dayToDefaultFormat(`${year}/${month}/${date}`))
  const { data, isLoading } = useCalendarQuery(year, month)
  const isOpenCalendarModal = useRecoilValue(calendarModalState)

  const handleTitleContent = (tile: TileArgs): React.ReactNode => {
    const totalCost = getTotalCost(dayManager.dayToDefaultFormat(tile.date), data)

    return (
      <ContentWrapper>
        {!isLoading && totalCost ? (
          <>
            <p>총 지출</p>
            <p>{totalCost.toLocaleString()}원</p>
          </>
        ) : null}
      </ContentWrapper>
    )
  }

  const handleOnClickDay = useCallback((date: Date) => {
    const clickedDate = dayManager.dayToDefaultFormat(date)
    const routeFormatDay = dayManager.dayToRouterFormat(date)
    if (clickedDate === activeDate) {
      const totalCost = getTotalCost(dayManager.dayToDefaultFormat(date), data)
      if (totalCost) onOpen(clickedDate)
    }
    setActiveDate(clickedDate)
    router.push(`/calendar/${routeFormatDay}`)
  }, [])

  const handleOnClickMonth = useCallback((date: Date) => {
    const routeFormatDate = dayManager.dayToRouterFormat(date)
    router.push(`/calendar/${routeFormatDate}`)
  }, [])

  useEffect(() => {
    if (isOpenCalendarModal) return
    if (wheel > 0) {
      router.push(`/calendar/${dayManager.addDateWith(`${year}/${month}/${date}`, 'month').dayToRouterFormat()}`)
    } else if (wheel < 0) {
      router.push(`/calendar/${dayManager.subtractDateWith(`${year}/${month}/${date}`, 'month').dayToRouterFormat()}`)
    }
  }, [wheel])

  return (
    <CalendarWrapper>
      <ReactCalendar
        value={dayManager.dayToDateObject(`${year}/${month}/${date}`)}
        onClickDay={handleOnClickDay}
        onClickMonth={handleOnClickMonth}
        onClickYear={(date, e) => {
          console.log('onClickYear :', date, e)
        }}
        formatDay={(_props, date) => date.getDate().toString()}
        tileContent={handleTitleContent}
      />
    </CalendarWrapper>
  )
}

function getTotalCost(date: Date | string, data: Expenses[] | undefined) {
  return data?.reduce((prev, item) => (dayManager.dayToDefaultFormat(item.date) === date ? item.cost + prev : prev), 0)
}

const CalendarWrapper = styled.div`
  position: relative;
  height: 100%;
`

const ContentWrapper = styled.div`
  height: 3rem;
  max-height: 4rem;
  color: rgba(0, 0, 0, 0.8);
  text-align: start;
  padding-top: 1rem;
  & > p:nth-child(2) {
    margin-top: 1rem;
  }
`
