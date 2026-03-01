-- 0002_product_blog_media_fields.sql
-- Add media URL support for product and blog CRUD APIs

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images(product_id, sort_order);

ALTER TABLE blog_posts ADD COLUMN featured_image_url TEXT;

UPDATE blog_posts
SET featured_image_url = '/images/blog/brownies-recipe.jpg'
WHERE featured_image_url IS NULL;
