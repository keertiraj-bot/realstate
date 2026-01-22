-- ============================================
-- SUPABASE RLS POLICIES FOR REAL ESTATE PLATFORM
-- ============================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROPERTIES TABLE POLICIES
-- ============================================

-- Policy: Public users can view available properties
CREATE POLICY "Public properties are viewable by everyone"
ON properties
FOR SELECT
USING (status = 'available');

-- Policy: Only authenticated admins can insert properties
CREATE POLICY "Admins can insert properties"
ON properties
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only authenticated admins can update properties
CREATE POLICY "Admins can update properties"
ON properties
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only authenticated admins can delete properties
CREATE POLICY "Admins can delete properties"
ON properties
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- LEADS TABLE POLICIES
-- ============================================

-- Policy: Public can insert leads (for enquiry forms)
CREATE POLICY "Anyone can create leads"
ON leads
FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated admins can view leads
CREATE POLICY "Admins can view leads"
ON leads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only authenticated admins can update leads
CREATE POLICY "Admins can update leads"
ON leads
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Policy: Only authenticated admins can delete leads
CREATE POLICY "Admins can delete leads"
ON leads
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- USERS TABLE POLICIES (for admin user management)
-- ============================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON auth.users
FOR SELECT
USING (auth.uid() = id);

-- Policy: Only admins can view all users
CREATE POLICY "Admins can view all users"
ON auth.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- SECURITY ENHANCEMENTS
-- ============================================

-- Prevent anonymous users from accessing admin resources
-- (This is enforced by the middleware, but RLS adds defense in depth)

-- Function to get current user's role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
END;
$$;
