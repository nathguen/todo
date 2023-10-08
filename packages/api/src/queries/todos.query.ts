export const getTodoByIdQuery = `
  SELECT 
    id,
    title, 
    description, 
    (SELECT status FROM todo_statuses AS ts WHERE ts.id = t.status_id) AS status, 
    owner_id, 
    created_at, 
    updated_at, 
    archived_at, 
    parent_id 
  FROM 
    todos AS t 
  WHERE t.id = $1
`;

export const createTodoQuery = `
  INSERT INTO todos (
    title, 
    description,
    status_id,
    owner_id,
    updated_at
  ) VALUES (
    $1,
    $2,
    (SELECT id FROM todo_statuses AS t WHERE t.status = $3),
    $4,
    NOW()
  ) RETURNING *
`;

export const updateTodoQuery = `
  UPDATE 
    todos 
  SET 
    title = $1, 
    description = $2, 
    status_id = (SELECT id FROM todo_statuses AS ts WHERE ts.status = $3), 
    owner_id = $4,
    updated_at = NOW(),
    archived_at = $5,
    parent_id = $6
  WHERE id = $7
  RETURNING *
`;

export const deleteTodoQuery = `
  DELETE FROM 
    todos 
  WHERE id = $1
`;
