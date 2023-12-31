import { sanity } from '@/service/sanity'

export async function deleteExepnseTransaction(id: string) {
  try {
    const response = await sanity.client.delete(id)
    if (!response.results.length) {
      return {
        message: 'Expense not found',
        code: 22
      }
    }
    return {
      message: 'Expense deleted successfully',
      code: 0
    }
  } catch (error) {
    console.error(error)
    return {
      message: 'Expense delete failed',
      code: 22
    }
  }
}
