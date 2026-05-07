-- ============================================
-- HUKRA DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#1B3A6B',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, color) VALUES
  ('Hukum Pidana', 'hukum-pidana', 'Berita dan opini seputar hukum pidana', '#DC2626'),
  ('Hukum Perdata', 'hukum-perdata', 'Berita dan opini seputar hukum perdata', '#2563EB'),
  ('Konstitusi', 'konstitusi', 'Isu konstitusional dan ketatanegaraan', '#7C3AED'),
  ('Hukum Internasional', 'hukum-internasional', 'Hukum internasional dan hubungan antar negara', '#0891B2'),
  ('HAM', 'ham', 'Hak asasi manusia', '#059669'),
  ('Akademik', 'akademik', 'Jurnal dan tulisan akademik', '#D97706'),
  ('Agraria', 'agraria', 'Hukum agraria dan pertanahan', '#65A30D'),
  ('Bisnis', 'bisnis', 'Hukum bisnis dan korporasi', '#DB2777')
ON CONFLICT DO NOTHING;

-- ============================================
-- ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  type TEXT DEFAULT 'opini' CHECK (type IN ('berita', 'opini')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_headline BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  admin_note TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Articles policies
CREATE POLICY "Published articles viewable" ON public.articles FOR SELECT USING (
  status = 'published' OR auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Authenticated users create articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own articles" ON public.articles FOR UPDATE USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admin delete articles" ON public.articles FOR DELETE USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories policies
CREATE POLICY "Categories viewable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments policies
CREATE POLICY "Approved comments viewable" ON public.comments FOR SELECT USING (is_approved = true OR auth.uid() = author_id);
CREATE POLICY "Authenticated users comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Likes viewable" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users like" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTR(NEW.id::TEXT, 1, 6)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS VOID AS $$
  UPDATE public.articles SET view_count = view_count + 1 WHERE id = article_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public images viewable" ON storage.objects FOR SELECT USING (bucket_id IN ('article-images', 'avatars'));
CREATE POLICY "Auth users upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('article-images', 'avatars') AND auth.role() = 'authenticated'
);
CREATE POLICY "Users delete own images" ON storage.objects FOR DELETE USING (
  bucket_id IN ('article-images', 'avatars') AND auth.uid()::TEXT = (storage.foldername(name))[1]
);
