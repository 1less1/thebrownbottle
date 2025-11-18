USE thebrownbottle;

DELIMITER $$

-- -----------------------------------------------------
-- Procedure: insert_recurring_tasks
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS insert_recurring_tasks_procedure$$

CREATE PROCEDURE insert_recurring_tasks_procedure()
BEGIN
  INSERT INTO task (title, description, author_id, section_id, due_date, timestamp, recurring_task_id)
  SELECT rt.title, rt.description, rt.author_id, rt.section_id, CURDATE(), CURRENT_TIMESTAMP, rt.recurring_task_id
  FROM recurring_task rt
  WHERE
    (
      (DAYOFWEEK(CURDATE()) = 1 AND rt.sun = 1) OR
      (DAYOFWEEK(CURDATE()) = 2 AND rt.mon = 1) OR
      (DAYOFWEEK(CURDATE()) = 3 AND rt.tue = 1) OR
      (DAYOFWEEK(CURDATE()) = 4 AND rt.wed = 1) OR
      (DAYOFWEEK(CURDATE()) = 5 AND rt.thu = 1) OR
      (DAYOFWEEK(CURDATE()) = 6 AND rt.fri = 1) OR
      (DAYOFWEEK(CURDATE()) = 7 AND rt.sat = 1)
    )
    AND CURDATE() >= rt.start_date
    AND (rt.end_date IS NULL OR CURDATE() <= rt.end_date)
    AND NOT EXISTS (
      SELECT 1 FROM task t
      WHERE t.recurring_task_id = rt.recurring_task_id AND t.due_date = CURDATE()
    );
END$$

DELIMITER ;
