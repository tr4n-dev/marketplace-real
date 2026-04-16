'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

type SortOption = {
  value: 'relevance' | 'date' | 'price_asc' | 'price_desc'
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'date', label: 'Plus récentes' },
  { value: 'relevance', label: 'Plus pertinentes' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
]

export function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get('sortBy') as SortOption['value'] || 'date'

  const handleSortChange = (newSort: SortOption['value']) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (newSort === 'date') {
        params.delete('sortBy')
      } else {
        params.set('sortBy', newSort)
      }
      
      // Reset to page 1 when sorting changes
      params.delete('page')
      
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value as SortOption['value'])}
      disabled={isPending}
      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs sm:text-sm outline-none focus:border-turquoise bg-white disabled:opacity-50"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
