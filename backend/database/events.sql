-- Use the Restaurant Database
USE thebrownbottle;

-- -----------------------------------------------------
-- Event: add_recurring_tasks
-- -----------------------------------------------------
DROP EVENT IF EXISTS add_recurring_tasks_event;

CREATE EVENT add_recurring_tasks_event
ON SCHEDULE EVERY 1 HOUR
STARTS CURRENT_TIMESTAMP
DO CALL insert_recurring_tasks_procedure();
