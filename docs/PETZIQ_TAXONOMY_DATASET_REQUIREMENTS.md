# Petziq taxonomy dataset requirements

## Current status

The import infrastructure is installed, but no taxonomy dataset has been imported.

**3,500,000+ new records: NOT YET IMPORTED.**

Existing Petziq frontend records under `src/data/` and existing user pets are not
part of the imported-record count.

## Accepted input formats

The server-side importer accepts CSV, JSON arrays, and NDJSON. Files must be
processed in bounded batches; the browser must never upload or insert millions of
rows directly.

Required fields per record:

- `source_hash`: stable hash of the canonical source record
- `taxonomic_rank`: species, subspecies, variety, breed, genus, or another supported rank
- `scientific_name` and/or `common_name`
- `external_id` when the source provides one
- `parent_external_id` when a source provides a parent taxon
- `aliases`: optional array of alternate names

Optional fields include `description`, source image metadata, language code,
conservation status, registry name, and breed group.

## Provenance and licensing

Every import requires a row in `taxonomy_sources` containing the publisher,
version, provenance URL, license name, license URL, and attribution text. The
source must permit storage, indexing, and the intended Petziq display use. A
source file hash and source-record hash must be retained so an import can be
reproduced and audited.

## Duplicate rules

The importer normalizes case, whitespace, and punctuation. A taxon is protected
by a unique canonical key derived from rank plus scientific/common name, with a
source external ID retained separately. A source and source hash may be imported
only once. Aliases are unique per taxon after normalization. Repeated imports
update provenance timestamps and existing canonical records rather than creating
copies.

## Validation rules

Records with no rank, no usable name, or no source hash are rejected into
`taxonomy_import_errors`. Parent links must resolve to an imported or previously
loaded taxon. Invalid ranks, malformed JSON, missing provenance, and records that
violate source licensing requirements must be rejected before a production import.

## Import operation

1. Register the dataset in `taxonomy_sources`.
2. Create a `taxonomy_import_jobs` row with format, file metadata, and total count.
3. Parse and validate the file in a trusted server-side worker.
4. Send bounded JSON batches to `taxonomy_upsert_batch(job_id, records)`.
5. Persist the returned counters and resume using the job cursor after interruption.
6. Mark the job completed only after the source has been fully processed and
   failed records have been reviewed.

The admin counters distinguish `existing_records` from
`new_imported_records` using `animal_taxa.import_job_id`. No existing Petziq
animal records are counted as new imports.
