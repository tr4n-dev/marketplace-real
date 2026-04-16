-- Add full-text search indexes for better search performance
-- This migration adds PostgreSQL GIN indexes for text search

-- Create GIN index for titre column with French text search configuration
CREATE INDEX IF NOT EXISTS "annonces_titre_fts_idx" 
ON "Annonce" 
USING GIN (to_tsvector('french', "titre"));

-- Create GIN index for description column with French text search configuration  
CREATE INDEX IF NOT EXISTS "annonces_description_fts_idx" 
ON "Annonce" 
USING GIN (to_tsvector('french', "description"));

-- Create composite GIN index for both titre and description
CREATE INDEX IF NOT EXISTS "annonces_search_fts_idx" 
ON "Annonce" 
USING GIN (to_tsvector('french', COALESCE("titre", '') || ' ' || COALESCE("description", '')));

-- Create partial index for active annonces only (better performance)
CREATE INDEX IF NOT EXISTS "annonces_active_search_idx" 
ON "Annonce" 
USING GIN (to_tsvector('french', COALESCE("titre", '') || ' ' || COALESCE("description", '')))
WHERE "statut" = 'ACTIVE';
