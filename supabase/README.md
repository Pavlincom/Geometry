# Geometry Supabase setup

The Geometry editor saves structures to `public.artworks` using the browser Supabase client.

## Required project settings

1. In Supabase Dashboard open **Authentication → Providers → Anonymous Sign-Ins** and enable anonymous sign-ins for the MVP.
2. Run `supabase/schema.sql` in the Geometry project's SQL Editor.

The schema explicitly grants Data API access only to `authenticated` users and enables Row Level Security. Each user can select, insert, update, and delete only rows where `user_id = auth.uid()`.

Anonymous Supabase users still use the `authenticated` Postgres role, so the same ownership policies protect their saved structures. Later these accounts can be upgraded by linking an email or OAuth identity.

For production, add CAPTCHA or Turnstile before relying heavily on anonymous sign-ins, because Supabase recommends abuse protection for anonymous account creation.
