"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { sanitizeSearchQuery } from "@/lib/search"

export default function RecherchePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const query = searchParams.get("q")
    
    if (query) {
      const sanitizedQuery = sanitizeSearchQuery(query)
      // Redirect to annonces page with search parameter
      router.replace(`/annonces?recherche=${encodeURIComponent(sanitizedQuery)}`)
    } else {
      // If no query, redirect to annonces page
      router.replace("/annonces")
    }
  }, [router, searchParams])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-turquoise mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers les résultats...</p>
      </div>
    </div>
  )
}
