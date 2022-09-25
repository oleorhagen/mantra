

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL8 PRIMARY KEY,
    pipeline_id SERIAL8 FOREIGN KEY REFERENCES pipelines.id,
    _name STRING,
    status STRING,
);

CREATE TABLE IF NOT EXISTS pipelines (
    id SERIAL8 PRIMARY KEY,
    _name STRING,
    status STRING,
);

CREATE TABLE IF NOT EXISTS results (
    job_id SERIAL8 PRIMARY KEY,
    _name STRING,
    status STRING,
    t TIMESTAMP,
    _result STRING,
    result_message STRING
);
