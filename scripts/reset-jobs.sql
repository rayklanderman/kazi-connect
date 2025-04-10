-- Function to drop jobs table
CREATE OR REPLACE FUNCTION drop_jobs_table()
RETURNS void AS $$
BEGIN
  DROP TABLE IF EXISTS jobs;
END;
$$ LANGUAGE plpgsql;

-- Function to create jobs table
CREATE OR REPLACE FUNCTION create_jobs_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS jobs (
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
END;
$$ LANGUAGE plpgsql;
