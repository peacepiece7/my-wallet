'use client'

import GNB from '@/components/GNB/GNB'
import { User } from '@/model'
import ExpenseAddForm from './ExpenseAddForm'
import ExpenseList from './ExpenseList'
import ActionBox from './ActionBox'
import { SSRSuspense } from '@/components/SSRSuspense'
import styled from 'styled-components'
import FloatingImage from '@/components/Layouts/FloatingImage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ExpenseAddFormMobile from './ExpenseAddForm/Mobile'
import Loading from '../loading'

interface HomeContainer {
  user: User
}
export default function HomeContainer({ user }: HomeContainer) {
  const { isMobile } = useMediaQuery()

  return (
    <SSRSuspense fallback={<Loading />}>
      <GNB user={user} />
      <ContentWrapper>
        <FloatingImage>
          {!isMobile ? <ExpenseAddForm /> : <ExpenseAddFormMobile />}
          <ActionBox />
          <ExpenseList />
        </FloatingImage>
      </ContentWrapper>
    </SSRSuspense>
  )
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
`
