DELIMITER //

CREATE EVENT IF NOT EXISTS add_recurring_tasks
ON SCHEDULE EVERY 1 HOUR
DO
  BEGIN
    -- Insert recurring tasks for weekly recurrence on the specified day
    INSERT INTO `thebrownbottle`.`task` (`title`, `description`, `author_id`, `section_id`, `due_date`, `timestamp`, `recurring_task_id`)
    SELECT rt.title, rt.description, rt.author_id, rt.section_id, CURDATE(), CURRENT_TIMESTAMP, rt.task_id
    FROM `thebrownbottle`.`recurring_task` rt
    WHERE rt.recurrence_type = 'weekly' AND DAYNAME(CURDATE()) = rt.recurrence_day
    AND (rt.end_date IS NULL OR CURDATE() <= rt.end_date);

  END //

DELIMITER ;