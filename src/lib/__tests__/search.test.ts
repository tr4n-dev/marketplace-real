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
      expect(sanitizeSearchQuery('<html>hello</html>)')).toBe('htmlhello/html')
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
})