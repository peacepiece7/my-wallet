import { authOptions } from '@/service/nextAuth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import HomeContainer from './_container/HomeContainer'

export default async function HomePage() {
  const start = Date.now()
  const session = await getServerSession(authOptions)

  if (!session) return redirect('/auth/signin')

  // HACK : 로딩 애니메이션이 보고싶어서 잠시 대기하겠습니다..
  // prettier-ignore
  await new Promise((resolve) => setTimeout(resolve, 2000 - (Date.now() - start)))

  return (
    <main>
      <HomeContainer user={session.user} />
    </main>
  )
}
