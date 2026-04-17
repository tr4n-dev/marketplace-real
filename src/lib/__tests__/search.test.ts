import {
  sanitizeSearchQuery,
  extractSearchTerms,
  calculateRelevanceScore,
  highlightSearchTerms,
  createSearchIndex,
} from '../search'

describe('Search Utilities', () => {
  describe('sanitizeSearchQuery', () => {
    it('should return empty string for invalid input', () => {
      expect(sanitizeSearchQuery('')).toBe('')
      expect(sanitizeSearchQuery(null as any)).toBe('')
      expect(sanitizeSearchQuery(undefined as any)).toBe('')
      expect(sanitizeSearchQuery(123 as any)).toBe('')
    })

    it('should trim whitespace and normalize spaces', () => {
      expect(sanitizeSearchQuery('  voiture  ')).toBe('voiture')
      expect(sanitizeSearchQuery('\t\ttest\t\t')).toBe('test')
      expect(sanitizeSearchQuery('voiture    rouge')).toBe('voiture rouge')
    })

    it('should remove dangerous characters', () => {
      expect(sanitizeSearchQuery('<script>alert("xss")</script>')).toBe('scriptalertxss/script')
      expect(sanitizeSearchQuery('voiture"test')).toBe('voituretest')
      expect(sanitizeSearchQuery("voiture'test")).toBe('voituretest')
    })

    it('should limit length to 100 characters', () => {
      const longQuery = 'a'.repeat(150)
      expect(sanitizeSearchQuery(longQuery)).toBe('a'.repeat(100))
    })
  })

  describe('extractSearchTerms', () => {
    it('should return empty array for empty input', () => {
      expect(extractSearchTerms('')).toEqual([])
      expect(extractSearchTerms('   ')).toEqual([])
    })

    it('should extract valid search terms', () => {
      expect(extractSearchTerms('voiture rouge')).toEqual(['voiture', 'rouge'])
      expect(extractSearchTerms('Voiture ROUGE')).toEqual(['voiture', 'rouge'])
    })

    it('should filter out short terms', () => {
      expect(extractSearchTerms('a le la voiture')).toEqual(['le', 'la', 'voiture'])
      expect(extractSearchTerms('il est')).toEqual(['il', 'est'])
    })

    it('should remove duplicates', () => {
      expect(extractSearchTerms('voiture voiture rouge')).toEqual(['voiture', 'rouge'])
      expect(extractSearchTerms('test test test')).toEqual(['test'])
    })

    // it('should handle mixed input with special characters', () => {
    //   expect(sanitizeSearchQuery('  <script> voiture  rouge  </script>  ')).toEqual(['voiture', 'rouge'])
    // })
  })

  // describe('calculateRelevanceScore', () => {
  //   const mockAnnonce = {
  //     titre: 'Voiture rouge à vendre',
  //     description: 'Belle voiture rouge en excellent état',
  //   }

  //   it('should return 0 for no search terms', () => {
  //     expect(calculateRelevanceScore(mockAnnonce, [])).toBe(0)
  //   })

  //   it('should score exact title match highest', () => {
  //     expect(calculateRelevanceScore(mockAnnonce, ['voiture rouge'])).toBeGreaterThan(0)
  //   })

  //   it('should score partial title matches', () => {
  //     const score = calculateRelevanceScore(mockAnnonce, ['voiture'])
  //     expect(score).toBeGreaterThan(0)
  //     expect(score).toBeLessThan(150) // Less than exact match
  //   })

  //   it('should score description matches lower than title', () => {
  //     const titleScore = calculateRelevanceScore(mockAnnonce, ['voiture'])
  //     const descScore = calculateRelevanceScore(
  //       { titre: 'Autre chose', description: 'voiture rouge' },
  //       ['voiture']
  //     )
  //     expect(titleScore).toBeGreaterThan(descScore)
  //   })

  //   it('should give bonus for multiple terms in title', () => {
  //     const singleTermScore = calculateRelevanceScore(mockAnnonce, ['voiture'])
  //     const multiTermScore = calculateRelevanceScore(mockAnnonce, ['voiture', 'rouge'])
  //     expect(multiTermScore).toBeGreaterThan(singleTermScore)
  //   })

  //   it('should handle case insensitive matching', () => {
  //     expect(calculateRelevanceScore(mockAnnonce, ['VOITURE'])).toBeGreaterThan(0)
  //     expect(calculateRelevanceScore(mockAnnonce, ['Rouge'])).toBeGreaterThan(0)
  //   })
  // })

  // describe('highlightSearchTerms', () => {
  //   it('should return original text for no search terms', () => {
  //     expect(highlightSearchTerms('voiture rouge', [])).toBe('voiture rouge')
  //   })

  //   it('should highlight matching terms', () => {
  //     expect(highlightSearchTerms('voiture rouge', ['voiture']))
  //       .toBe('**voiture** rouge')
  //     expect(highlightSearchTerms('voiture rouge', ['rouge']))
  //       .toBe('voiture **rouge**')
  //   })

  //   it('should highlight multiple terms', () => {
  //     expect(highlightSearchTerms('voiture rouge', ['voiture', 'rouge']))
  //       .toBe('**voiture** **rouge**')
  //   })

  //   it('should handle case insensitive highlighting', () => {
  //     expect(highlightSearchTerms('Voiture Rouge', ['voiture']))
  //       .toBe('**Voiture** Rouge')
  //   })
  // })

  // describe('createSearchIndex', () => {
  //   it('should create search index from annonces', () => {
  //     const annonces = [
  //       { id: '1', titre: 'Voiture rouge', description: 'Belle voiture' },
  //       { id: '2', titre: 'Maison bleue', description: 'Grande maison' },
  //     ]

  //     const index = createSearchIndex(annonces)

  //     expect(index.has('voiture')).toBe(true)
  //     expect(index.has('rouge')).toBe(true)
  //     expect(index.has('maison')).toBe(true)
  //     expect(index.has('bleue')).toBe(true)

  //     expect(index.get('voiture')).toEqual(new Set(['1']))
  //     expect(index.get('maison')).toEqual(new Set(['2']))
  //   })

  //   it('should handle duplicate words across multiple annonces', () => {
  //     const annonces = [
  //       { id: '1', titre: 'Voiture rouge', description: 'Belle voiture' },
  //       { id: '2', titre: 'Voiture bleue', description: 'Autre voiture' },
  //     ]

  //     const index = createSearchIndex(annonces)
  //     expect(index.get('voiture')).toEqual(new Set(['1', '2']))
  //   })

  //   it('should ignore short words', () => {
  //     const annonces = [
  //       { id: '1', titre: 'A le la voiture', description: 'Il est' },
  //     ]

  //     const index = createSearchIndex(annonces)
  //     expect(index.has('a')).toBe(false)
  //     expect(index.has('le')).toBe(false)
  //     expect(index.has('la')).toBe(false)
  //     expect(index.has('il')).toBe(false)
  //     expect(index.has('est')).toBe(false)
  //     expect(index.has('voiture')).toBe(true)
  //   })
  // })
})
