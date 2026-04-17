// lib/search.ts
// Robust search utilities for annonces

export interface SearchOptions {
  query?: string
  categorie?: string
  ville?: string
  prixMin?: number
  prixMax?: number
  typePrix?: string
  page?: number
  userId?: string // For favorites
}

export interface SearchResult {
  id: string
  titre: string
  description: string
  score: number
  highlights?: {
    titre?: string
    description?: string
  }
}

/**
 * Nettoie et normalise une requête de recherche
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return ''
  
  return query
    .trim()
    .replace(/[<>()\"']/g, '') // Supprime les caractères HTML/JS potentiellement dangereux
    .replace(/\s+/g, ' ') // Normalise les espaces
    .slice(0, 100) // Limite la longueur
}

/**
 * Extrait les mots-clés d'une requête de recherche
 */
export function extractSearchTerms(query: string): string[] {
  const sanitized = sanitizeSearchQuery(query)
  if (!sanitized) return []
  
  // Sépare les mots, ignore les mots trop courts (< 2 caractères)
  return sanitized
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length >= 2)
    .filter((term, index, arr) => arr.indexOf(term) === index) // Supprime les doublons
}

/**
 * Calcule le score de pertinence pour une annonce
 * Titre exact: 100 points
 * Titre partiel: 50 points
 * Description exacte: 30 points
 * Description partielle: 10 points
 */
export function calculateRelevanceScore(
  annonce: { titre: string; description: string },
  searchTerms: string[]
): number {
  if (searchTerms.length === 0) return 0
  
  const titreLower = annonce.titre.toLowerCase()
  const descriptionLower = annonce.description.toLowerCase()
  let score = 0
  
  searchTerms.forEach(term => {
    // Recherche exacte dans le titre (score le plus élevé)
    if (titreLower === term) {
      score += 100
    }
    // Recherche partielle dans le titre
    else if (titreLower.includes(term)) {
      score += 50
    }
    // Recherche exacte dans la description
    else if (descriptionLower.includes(term)) {
      score += 30
    }
    // Recherche partielle dans la description
    else if (descriptionLower.includes(term)) {
      score += 10
    }
  })
  
  // Bonus si tous les termes sont trouvés dans le titre
  const allTermsInTitle = searchTerms.every(term => titreLower.includes(term))
  if (allTermsInTitle && searchTerms.length > 1) {
    score += 25
  }
  
  return score
}

/**
 * Met en évidence les termes de recherche dans le texte
 */
export function highlightSearchTerms(text: string, searchTerms: string[]): string {
  if (searchTerms.length === 0) return text
  
  let highlighted = text
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    highlighted = highlighted.replace(regex, '**$1**')
  })
  
  return highlighted
}

/**
 * Échappe les caractères spéciaux pour les expressions régulières
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Crée un index de recherche全文 (pour optimisation future)
 */
export function createSearchIndex(annonces: Array<{ id: string; titre: string; description: string }>) {
  const index = new Map<string, Set<string>>()
  
  annonces.forEach(annonce => {
    const words = extractSearchTerms(annonce.titre + ' ' + annonce.description)
    words.forEach(word => {
      if (!index.has(word)) {
        index.set(word, new Set())
      }
      index.get(word)!.add(annonce.id)
    })
  })
  
  return index
}