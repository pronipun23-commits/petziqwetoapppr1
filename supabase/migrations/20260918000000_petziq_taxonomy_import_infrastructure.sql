/* Petziq taxonomy import infrastructure

This migration prepares storage and server-side batch primitives only. It does
not import or fabricate animal records. Existing Petziq pet/breed data remains
unchanged and is never counted as imported taxonomy data.
*/

CREATE TABLE IF NOT EXISTS public.taxonomy_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  publisher text,
  homepage_url text,
  license_name text,
  license_url text,
  attribution text,
  version text,
  provenance_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, version)
);

CREATE TABLE IF NOT EXISTS public.taxonomy_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.taxonomy_sources(id),
  source_file_name text,
  source_file_hash text,
  source_format text NOT NULL CHECK (source_format IN ('csv', 'json', 'ndjson')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'paused', 'completed', 'failed', 'cancelled')),
  total_records bigint NOT NULL DEFAULT 0,
  processed_records bigint NOT NULL DEFAULT 0,
  inserted_records bigint NOT NULL DEFAULT 0,
  updated_records bigint NOT NULL DEFAULT 0,
  skipped_records bigint NOT NULL DEFAULT 0,
  failed_records bigint NOT NULL DEFAULT 0,
  cursor_token text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.animal_taxa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES public.taxonomy_sources(id),
  import_job_id uuid REFERENCES public.taxonomy_import_jobs(id),
  source_record_id uuid,
  external_id text,
  scientific_name text,
  common_name text,
  normalized_name text NOT NULL,
  canonical_key text NOT NULL UNIQUE,
  taxonomic_rank text NOT NULL CHECK (taxonomic_rank IN ('domain', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'subspecies', 'variety', 'breed', 'other')),
  parent_id uuid REFERENCES public.animal_taxa(id),
  description text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  introduced_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.animal_species (
  taxon_id uuid PRIMARY KEY REFERENCES public.animal_taxa(id),
  genus_name text,
  species_epithet text,
  conservation_status text
);

CREATE TABLE IF NOT EXISTS public.animal_subspecies (
  taxon_id uuid PRIMARY KEY REFERENCES public.animal_taxa(id),
  species_id uuid REFERENCES public.animal_taxa(id),
  subspecies_epithet text
);

CREATE TABLE IF NOT EXISTS public.animal_breeds (
  taxon_id uuid PRIMARY KEY REFERENCES public.animal_taxa(id),
  species_id uuid REFERENCES public.animal_taxa(id),
  registry_name text,
  breed_group text
);

CREATE TABLE IF NOT EXISTS public.animal_varieties (
  taxon_id uuid PRIMARY KEY REFERENCES public.animal_taxa(id),
  species_id uuid REFERENCES public.animal_taxa(id),
  variety_epithet text
);

CREATE TABLE IF NOT EXISTS public.animal_taxon_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taxon_id uuid NOT NULL REFERENCES public.animal_taxa(id),
  alias text NOT NULL,
  normalized_alias text NOT NULL,
  language_code text,
  alias_type text,
  UNIQUE (taxon_id, normalized_alias)
);

CREATE TABLE IF NOT EXISTS public.taxonomy_source_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.taxonomy_sources(id),
  import_job_id uuid REFERENCES public.taxonomy_import_jobs(id),
  external_id text,
  source_hash text NOT NULL,
  raw_record jsonb NOT NULL,
  taxon_id uuid REFERENCES public.animal_taxa(id),
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'updated', 'skipped', 'failed')),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, source_hash)
);

CREATE TABLE IF NOT EXISTS public.taxonomy_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taxon_id uuid NOT NULL REFERENCES public.animal_taxa(id),
  source_id uuid REFERENCES public.taxonomy_sources(id),
  source_image_id text,
  image_url text NOT NULL,
  license_name text,
  attribution text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (taxon_id, image_url)
);

CREATE TABLE IF NOT EXISTS public.taxonomy_import_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id uuid NOT NULL REFERENCES public.taxonomy_import_jobs(id),
  record_number bigint,
  source_external_id text,
  error_code text NOT NULL,
  error_message text NOT NULL,
  raw_record jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.taxonomy_sources ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.taxonomy_import_jobs ADD COLUMN IF NOT EXISTS cursor_token text;
ALTER TABLE public.animal_taxa ADD COLUMN IF NOT EXISTS import_job_id uuid REFERENCES public.taxonomy_import_jobs(id);
ALTER TABLE public.animal_taxa ADD COLUMN IF NOT EXISTS source_record_id uuid;
ALTER TABLE public.animal_taxa ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.animal_taxa ADD COLUMN IF NOT EXISTS introduced_at timestamptz NOT NULL DEFAULT now();

-- Optional structured link for existing Petziq pets. Existing text species/breed
-- values remain authoritative when this column is null.
ALTER TABLE public.pets
  ADD COLUMN IF NOT EXISTS animal_taxon_id uuid REFERENCES public.animal_taxa(id);

ALTER TABLE public.taxonomy_source_records ADD COLUMN IF NOT EXISTS source_hash text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_taxonomy_source_records_source_hash
  ON public.taxonomy_source_records(source_id, source_hash);

CREATE INDEX IF NOT EXISTS idx_taxa_rank_name ON public.animal_taxa(taxonomic_rank, normalized_name);
CREATE INDEX IF NOT EXISTS idx_taxa_parent ON public.animal_taxa(parent_id);
CREATE INDEX IF NOT EXISTS idx_taxa_source ON public.animal_taxa(source_id, external_id);
CREATE INDEX IF NOT EXISTS idx_taxa_import_job ON public.animal_taxa(import_job_id);
CREATE INDEX IF NOT EXISTS idx_pets_animal_taxon ON public.pets(animal_taxon_id);
CREATE INDEX IF NOT EXISTS idx_taxa_public_name ON public.animal_taxa(is_public, normalized_name);
CREATE INDEX IF NOT EXISTS idx_taxa_scientific_name ON public.animal_taxa(scientific_name);
CREATE INDEX IF NOT EXISTS idx_taxa_common_name ON public.animal_taxa(common_name);
CREATE INDEX IF NOT EXISTS idx_taxon_aliases_normalized ON public.animal_taxon_aliases(normalized_alias);
CREATE INDEX IF NOT EXISTS idx_source_records_job ON public.taxonomy_source_records(import_job_id, status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.taxonomy_import_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_errors_job ON public.taxonomy_import_errors(import_job_id, record_number);

CREATE OR REPLACE FUNCTION public.taxonomy_normalize(p_value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $fn$
  SELECT lower(regexp_replace(trim(coalesce(p_value, '')), '[^[:alnum:]]+', ' ', 'g'));
$fn$;

CREATE OR REPLACE FUNCTION public.taxonomy_canonical_key(
  p_rank text,
  p_scientific_name text,
  p_common_name text,
  p_external_id text
)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $fn$
  SELECT lower(trim(coalesce(p_rank, 'other'))) || ':' ||
    coalesce(nullif(public.taxonomy_normalize(p_scientific_name), ''),
             nullif(public.taxonomy_normalize(p_common_name), ''),
             'external:' || lower(trim(coalesce(p_external_id, ''))));
$fn$;

CREATE OR REPLACE FUNCTION public.taxonomy_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT public.is_full_admin();
$fn$;

ALTER TABLE public.taxonomy_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_taxa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_subspecies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_taxon_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_source_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_import_errors ENABLE ROW LEVEL SECURITY;

DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_taxa' AND policyname = 'public_read_animal_taxa') THEN
    CREATE POLICY public_read_animal_taxa ON public.animal_taxa FOR SELECT TO anon, authenticated USING (is_public = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_species' AND policyname = 'public_read_animal_species') THEN
    CREATE POLICY public_read_animal_species ON public.animal_species FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_subspecies' AND policyname = 'public_read_animal_subspecies') THEN
    CREATE POLICY public_read_animal_subspecies ON public.animal_subspecies FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_breeds' AND policyname = 'public_read_animal_breeds') THEN
    CREATE POLICY public_read_animal_breeds ON public.animal_breeds FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_varieties' AND policyname = 'public_read_animal_varieties') THEN
    CREATE POLICY public_read_animal_varieties ON public.animal_varieties FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_taxon_aliases' AND policyname = 'public_read_animal_aliases') THEN
    CREATE POLICY public_read_animal_aliases ON public.animal_taxon_aliases FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_images' AND policyname = 'public_read_taxonomy_images') THEN
    CREATE POLICY public_read_taxonomy_images ON public.taxonomy_images FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.animal_taxa t WHERE t.id = taxon_id AND t.is_public = true));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_sources' AND policyname = 'admin_manage_taxonomy_sources') THEN
    CREATE POLICY admin_manage_taxonomy_sources ON public.taxonomy_sources FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_import_jobs' AND policyname = 'admin_manage_taxonomy_jobs') THEN
    CREATE POLICY admin_manage_taxonomy_jobs ON public.taxonomy_import_jobs FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_source_records' AND policyname = 'admin_manage_taxonomy_source_records') THEN
    CREATE POLICY admin_manage_taxonomy_source_records ON public.taxonomy_source_records FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_import_errors' AND policyname = 'admin_read_taxonomy_import_errors') THEN
    CREATE POLICY admin_read_taxonomy_import_errors ON public.taxonomy_import_errors FOR SELECT TO authenticated USING (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'taxonomy_images' AND policyname = 'admin_manage_taxonomy_images') THEN
    CREATE POLICY admin_manage_taxonomy_images ON public.taxonomy_images FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_taxa' AND policyname = 'admin_manage_animal_taxa') THEN
    CREATE POLICY admin_manage_animal_taxa ON public.animal_taxa FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_species' AND policyname = 'admin_manage_animal_species') THEN
    CREATE POLICY admin_manage_animal_species ON public.animal_species FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_subspecies' AND policyname = 'admin_manage_animal_subspecies') THEN
    CREATE POLICY admin_manage_animal_subspecies ON public.animal_subspecies FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_breeds' AND policyname = 'admin_manage_animal_breeds') THEN
    CREATE POLICY admin_manage_animal_breeds ON public.animal_breeds FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'animal_varieties' AND policyname = 'admin_manage_animal_varieties') THEN
    CREATE POLICY admin_manage_animal_varieties ON public.animal_varieties FOR ALL TO authenticated USING (public.taxonomy_is_admin()) WITH CHECK (public.taxonomy_is_admin());
  END IF;
END
$do$;

CREATE OR REPLACE FUNCTION public.taxonomy_search(
  p_query text DEFAULT NULL,
  p_rank text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (id uuid, common_name text, scientific_name text, taxonomic_rank text, parent_id uuid, total_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  WITH matches AS (
    SELECT t.*
    FROM public.animal_taxa t
    WHERE t.is_public = true
      AND (nullif(trim(p_query), '') IS NULL OR t.normalized_name LIKE '%' || public.taxonomy_normalize(p_query) || '%' OR public.taxonomy_normalize(t.scientific_name) LIKE '%' || public.taxonomy_normalize(p_query) || '%' OR EXISTS (SELECT 1 FROM public.animal_taxon_aliases a WHERE a.taxon_id = t.id AND a.normalized_alias LIKE '%' || public.taxonomy_normalize(p_query) || '%'))
      AND (nullif(trim(p_rank), '') IS NULL OR t.taxonomic_rank = lower(trim(p_rank)))
  )
  SELECT m.id, m.common_name, m.scientific_name, m.taxonomic_rank, m.parent_id, count(*) OVER ()
  FROM matches m
  ORDER BY coalesce(m.common_name, m.scientific_name, m.normalized_name), m.id
  LIMIT greatest(1, least(coalesce(p_limit, 50), 200))
  OFFSET greatest(0, coalesce(p_offset, 0));
$fn$;

GRANT EXECUTE ON FUNCTION public.taxonomy_search(text, text, integer, integer) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.taxonomy_upsert_batch(p_job_id uuid, p_records jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  job_row public.taxonomy_import_jobs;
  source_row public.taxonomy_sources;
  item jsonb;
  taxon_id uuid;
  existing_id uuid;
  canonical text;
  rank_name text;
  scientific text;
  common text;
  external text;
  source_hash text;
  source_record_uuid uuid;
  inserted_count bigint := 0;
  updated_count bigint := 0;
  skipped_count bigint := 0;
  failed_count bigint := 0;
  processed_count bigint := 0;
BEGIN
  IF NOT public.taxonomy_is_admin() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501'; END IF;
  SELECT * INTO job_row FROM public.taxonomy_import_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Import job not found'; END IF;
  SELECT * INTO source_row FROM public.taxonomy_sources WHERE id = job_row.source_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Import source not found'; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(coalesce(p_records, '[]'::jsonb)) LOOP
    processed_count := processed_count + 1;
    BEGIN
      rank_name := lower(trim(item->>'taxonomic_rank'));
      scientific := nullif(trim(item->>'scientific_name'), '');
      common := nullif(trim(item->>'common_name'), '');
      external := nullif(trim(item->>'external_id'), '');
      source_hash := nullif(trim(item->>'source_hash'), '');
      IF rank_name IS NULL OR (scientific IS NULL AND common IS NULL) OR source_hash IS NULL THEN RAISE EXCEPTION 'rank, name, and source_hash are required'; END IF;
      canonical := public.taxonomy_canonical_key(rank_name, scientific, common, external);
      SELECT id INTO existing_id FROM public.animal_taxa WHERE canonical_key = canonical;
      IF existing_id IS NULL THEN
        INSERT INTO public.animal_taxa (source_id, import_job_id, external_id, scientific_name, common_name, normalized_name, canonical_key, taxonomic_rank, description)
        VALUES (source_row.id, p_job_id, external, scientific, common, coalesce(public.taxonomy_normalize(scientific), public.taxonomy_normalize(common)), canonical, rank_name, item->>'description') RETURNING id INTO taxon_id;
        inserted_count := inserted_count + 1;
      ELSE
        taxon_id := existing_id;
        UPDATE public.animal_taxa SET updated_at = now(), description = coalesce(item->>'description', description) WHERE id = existing_id;
        updated_count := updated_count + 1;
      END IF;
      INSERT INTO public.taxonomy_source_records (source_id, import_job_id, external_id, source_hash, raw_record, taxon_id, status, last_seen_at)
      VALUES (source_row.id, p_job_id, external, source_hash, item, taxon_id, CASE WHEN existing_id IS NULL THEN 'accepted' ELSE 'updated' END, now())
      ON CONFLICT (source_id, source_hash) DO UPDATE SET last_seen_at = now(), taxon_id = excluded.taxon_id, status = 'updated'
      RETURNING id INTO source_record_uuid;
      UPDATE public.animal_taxa SET source_record_id = source_record_uuid WHERE id = taxon_id;
      IF jsonb_typeof(item->'aliases') = 'array' THEN
        INSERT INTO public.animal_taxon_aliases (taxon_id, alias, normalized_alias)
        SELECT taxon_id, value, public.taxonomy_normalize(value) FROM jsonb_array_elements_text(item->'aliases') WHERE trim(value) <> '' ON CONFLICT (taxon_id, normalized_alias) DO NOTHING;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
      INSERT INTO public.taxonomy_import_errors (import_job_id, record_number, source_external_id, error_code, error_message, raw_record) VALUES (p_job_id, processed_count, item->>'external_id', SQLSTATE, SQLERRM, item);
    END;
  END LOOP;
  UPDATE public.taxonomy_import_jobs SET processed_records = processed_records + processed_count, inserted_records = inserted_records + inserted_count, updated_records = updated_records + updated_count, skipped_records = skipped_records + skipped_count, failed_records = failed_records + failed_count, status = 'running', updated_at = now() WHERE id = p_job_id;
  RETURN jsonb_build_object('processed', processed_count, 'inserted', inserted_count, 'updated', updated_count, 'skipped', skipped_count, 'failed', failed_count);
END
$fn$;

REVOKE EXECUTE ON FUNCTION public.taxonomy_upsert_batch(uuid, jsonb) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.taxonomy_upsert_batch(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.taxonomy_import_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT jsonb_build_object(
    'existing_records', (SELECT count(*) FROM public.animal_taxa WHERE import_job_id IS NULL),
    'new_imported_records', (SELECT count(*) FROM public.animal_taxa WHERE import_job_id IS NOT NULL),
    'total_records', (SELECT count(*) FROM public.animal_taxa),
    'active_jobs', (SELECT count(*) FROM public.taxonomy_import_jobs WHERE status IN ('queued', 'running', 'paused'))
  ) WHERE public.taxonomy_is_admin();
$fn$;

REVOKE EXECUTE ON FUNCTION public.taxonomy_import_stats() FROM anon;
GRANT EXECUTE ON FUNCTION public.taxonomy_import_stats() TO authenticated;
