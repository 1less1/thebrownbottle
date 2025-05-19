-- Use the Restaurant Database
USE thebrownbottle;

-- -----------------------------------------------------
-- Procedure: insert_recurring_tasks
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS insert_recurring_tasks;

CREATE PROCEDURE insert_recurring_tasks()
INSERT INTO task (title, description, author_id, section_id, due_date, timestamp, recurring_task_id)
SELECT rt.title, rt.description, rt.author_id, rt.section_id, CURDATE(), CURRENT_TIMESTAMP, rt.task_id
FROM recurring_task rt
WHERE DAYNAME(CURDATE()) = rt.recurrence_day
  AND CURDATE() >= rt.start_date
  AND (rt.end_date IS NULL OR CURDATE() <= rt.end_date)
  AND NOT EXISTS (
      SELECT 1 FROM task t
      WHERE t.recurring_task_id = rt.task_id AND t.due_date = CURDATE()
  );