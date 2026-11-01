-- NULL represents "Sob orçamento"; existing fixed prices are preserved.
BEGIN;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price numeric(8, 2);
ALTER TABLE public.products ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.products ADD CONSTRAINT products_valid_price
  CHECK (price IS NULL OR (price > 0 AND price <= 999999.99));
COMMIT;
