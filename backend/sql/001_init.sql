
CREATE TABLE IF NOT EXISTS pipelines (
    id SERIAL PRIMARY KEY,
    _name STRING NOT NULL,
    time_start TIMESTAMP,
    time_end TIMESTAMP,
    status STRING,
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    pipeline_id SERIAL NOT NULL,
    _name STRING NOT NULL,
    status STRING,
    FOREIGN KEY(pipeline_id)
        REFERENCES pipelines (id)
);

CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    job_id SERIAL NOT NULL,
    _name STRING NOT NULL,
    status STRING NOT NULL,
    time_start TIMESTAMP,
    time_end TIMESTAMP,
    result_message STRING,
    FOREIGN KEY(job_id)
        REFERENCES jobs (id)
);
