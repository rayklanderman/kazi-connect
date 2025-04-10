-- Function to insert a job using JSON data
CREATE OR REPLACE FUNCTION insert_job(job_data JSONB)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO jobs (
    title,
    company_id,
    description,
    requirements,
    type,
    location,
    salary_range,
    status
  ) VALUES (
    (job_data->>'title')::TEXT,
    (job_data->>'company_id')::UUID,
    (job_data->>'description')::TEXT,
    (job_data->>'requirements')::TEXT[],
    (job_data->>'type')::job_type,
    (job_data->>'location')::TEXT,
    (job_data->>'salary_range')::TEXT,
    (job_data->>'status')::job_status
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
