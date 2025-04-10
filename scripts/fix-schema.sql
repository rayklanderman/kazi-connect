-- First, create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- First, drop existing tables in correct order
DROP TABLE IF EXISTS jobs CASCADE;

-- Recreate ENUM types to ensure they're correct
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;

CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE job_status AS ENUM ('active', 'closed');

-- Create jobs table with correct types
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    location TEXT,
    salary_range TEXT,
    type job_type NOT NULL,
    status job_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Set up RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (true);

CREATE POLICY "Company owners can create jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM companies
            WHERE id = jobs.company_id
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Company owners can update jobs"
    ON jobs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM companies
            WHERE id = jobs.company_id
            AND created_by = auth.uid()
        )
    );

-- Add trigger for updated_at
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Reset PostgREST schema cache
NOTIFY pgrst, 'reload schema';
