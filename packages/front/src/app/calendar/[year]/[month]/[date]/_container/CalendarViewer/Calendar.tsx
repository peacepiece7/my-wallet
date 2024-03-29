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
import { useRecoilValue } from 'recoil'
import { calendarModalState } from '@/store/calendarModalState'
import { SHADOW, SPACE, TEXT } from '@/styles/common'
import { useMouseWheel } from 'greenbean-pack'

type CalendarProps = CalendarPageProps['params'] & {
  onOpen: (date: string) => void
}

export default function Calendar({ date, month, year, onOpen }: CalendarProps) {
  const router = useRouter()
  const wheel = useMouseWheel()
  const [activeDate, setActiveDate] = useState(dayManager.formatDate(`${year}/${month}/${date}`))
  const { data, isLoading } = useCalendarQuery(year, month)
  const isOpenCalendarModal = useRecoilValue(calendarModalState)

  const handleTitleContent = (tile: TileArgs): React.ReactNode => {
    const totalCost = getTotalCost(dayManager.formatDate(tile.date), data)

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
    const clickedDate = dayManager.formatDate(date)
    const routeFormatDay = dayManager.formatRouterDate(date)
    if (clickedDate === activeDate) {
      const totalCost = getTotalCost(dayManager.formatDate(date), data)
      if (totalCost) onOpen(clickedDate)
    }
    setActiveDate(clickedDate)
    router.push(`/calendar/${routeFormatDay}`)
  }, [])

  const handleOnClickMonth = useCallback((date: Date) => {
    const routeFormatDate = dayManager.formatRouterDate(date)
    router.push(`/calendar/${routeFormatDate}`)
  }, [])

  useEffect(() => {
    if (isOpenCalendarModal) return
    if (wheel > 0) {
      router.push(`/calendar/${dayManager.addDateWith(`${year}/${month}/${date}`, 'month').formatRouterDate()}`)
    } else if (wheel < 0) {
      router.push(`/calendar/${dayManager.subtractDateWith(`${year}/${month}/${date}`, 'month').formatRouterDate()}`)
    }
  }, [wheel])

  return (
    <Container>
      <LoadingWrapper>{isLoading && '데이터 불러오는 중...'}</LoadingWrapper>
      <CalendarWrapper>
        <ReactCalendar
          value={dayManager.dayToDateObject(`${year}/${month}/${date}`)}
          onClickDay={handleOnClickDay}
          onClickMonth={handleOnClickMonth}
          formatDay={(_props, date) => date.getDate().toString()}
          tileContent={handleTitleContent}
        />
      </CalendarWrapper>
    </Container>
  )
}

function getTotalCost(date: Date | string, data: Expenses[] | undefined) {
  return data?.reduce((prev, item) => (dayManager.formatDate(item.date) === date ? item.cost + prev : prev), 0)
}
const Container = styled.div`
  width: 90%;
  margin: auto;
`

const LoadingWrapper = styled.div`
  min-height: 2rem;
  font-size: ${TEXT.size.base};
  text-align: end;
  padding-right: ${SPACE[12]};
`

const CalendarWrapper = styled.div`
  position: relative;
  height: 100%;
  font-size: ${TEXT.size.xs};
  padding: ${SPACE[8]};
  margin: ${SPACE[8]};
  margin-top: 0;
  box-shadow: ${SHADOW.lg};
  border-radius: 3rem;
  backdrop-filter: blur(2rem);
`

const ContentWrapper = styled.div`
  height: 3rem;
  max-height: 3rem;
  color: rgba(0, 0, 0, 0.8);
  text-align: start;
  padding-top: 1rem;
  & > p:nth-child(2) {
    margin-top: 1rem;
  }
`
