-- TABLE DROP
DROP TABLE IF EXISTS users cascade;

DROP TABLE IF EXISTS todo_statuses cascade;

DROP TABLE IF EXISTS todos cascade;

DROP TABLE IF EXISTS attachments cascade;

DROP TABLE IF EXISTS todo_lists cascade;

DROP TABLE IF EXISTS shared_todo_lists cascade;

CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(48) UNIQUE NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    firstName VARCHAR(32) NOT NULL,
    lastName VARCHAR(32) NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc'),
    updatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc')
  );

INSERT INTO
  users (email, username, password, firstName, lastName)
VALUES
  (
    'john@test.com',
    'johndoe',
    'test@1234',
    'Johnny',
    'Tester'
  ),
  (
    'dina@test.com',
    'dinadino',
    'test@1234',
    'Dina',
    'Tester'
  );

CREATE TABLE
  todo_statuses (
    id SERIAL PRIMARY KEY,
    status VARCHAR(32) UNIQUE NOT NULL
  );

INSERT INTO
  todo_statuses (status)
VALUES
  ('todo'),
  ('in-progress'),
  ('done');

CREATE TABLE
  todo_lists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc'),
    archived_at TIMESTAMP WITHOUT TIME ZONE
  );

INSERT INTO
  todo_lists (title, owner_id)
VALUES
  ('My First Todo List', 1),
  ('My Second Todo List', 1),
  ('My Third Todo List', 1);

CREATE TABLE
  todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT,
    status_id INTEGER REFERENCES todo_statuses (id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    starred BOOLEAN DEFAULT FALSE,
    todo_list_id INTEGER REFERENCES todo_lists (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc'),
    archived_at TIMESTAMP WITHOUT TIME ZONE,
    parent_id INTEGER REFERENCES todos (id) ON DELETE CASCADE
  );

INSERT INTO
  todos (
    title,
    description,
    status_id,
    owner_id,
    starred,
    todo_list_id
  )
VALUES
  (
    'My First Todo',
    'This is my first todo',
    1,
    1,
    true,
    1
  ),
  (
    'My Second Todo',
    'This is my second todo',
    2,
    1,
    false,
    1
  ),
  (
    'My Third Todo',
    'This is my third todo',
    3,
    1,
    false,
    1
  );

CREATE TABLE
  attachments (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER REFERENCES todos (id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    url VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc')
  );

CREATE TABLE
  shared_todo_lists (
    id SERIAL PRIMARY KEY,
    todo_list_id INTEGER REFERENCES todo_lists (id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW () AT TIME ZONE 'utc')
  );

INSERT INTO
  shared_todo_lists (todo_list_id, user_id)
VALUES
  (1, 2),
  (2, 2),
  (3, 2);