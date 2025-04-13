CREATE TABLE appliances (
  appliance_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE brands (
  brand_id SERIAL PRIMARY KEY,
  brand_name VARCHAR(100) NOT NULL,
  page_url TEXT
);

CREATE TABLE brand_appliances (
  brand_id INT REFERENCES brands(brand_id) ON DELETE CASCADE,
  appliance_id INT REFERENCES appliances(appliance_id) ON DELETE CASCADE,
  page_url TEXT,
  PRIMARY KEY (brand_id, appliance_id)
);

CREATE TABLE models (
  model_id SERIAL PRIMARY KEY,
  model_number VARCHAR(50) NOT NULL,
  page_url TEXT,
  brand_id INT REFERENCES brands(brand_id) ON DELETE CASCADE,
  appliance_id INT REFERENCES appliances(appliance_id) ON DELETE CASCADE
);

CREATE TABLE part_types (
  type_id SERIAL PRIMARY KEY,
  type_name TEXT NOT NULL,
  page_url TEXT,
  appliance_id INT REFERENCES appliances(appliance_id) ON DELETE CASCADE
);

CREATE TABLE parts (
  part_id SERIAL PRIMARY KEY,
  part_select_number VARCHAR(50),
  manufacturer_number VARCHAR(50),
  part_name TEXT NOT NULL,
  page_url TEXT,
  part_description TEXT,
  price DECIMAL(10,2),
  in_stock BOOLEAN,
  symptoms TEXT[],
  appliance_id INT REFERENCES appliances(appliance_id),
  brand_id INT REFERENCES brands(brand_id),
  type_id INT REFERENCES part_types(type_id) ON DELETE SET NULL
);

CREATE TABLE model_parts (
  model_id INT REFERENCES models(model_id),
  part_id INT REFERENCES parts(part_id),
  PRIMARY KEY (model_id, part_id)
);