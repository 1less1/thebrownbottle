USE thebrownbottle;

DELIMITER $$
-- -----------------------------------------------------
-- Event: time_off_accept
-- -----------------------------------------------------
CREATE TRIGGER time_off_accept
BEFORE UPDATE ON time_off_request
FOR EACH ROW
BEGIN
  IF NEW.status = 'Accepted' THEN
    IF EXISTS (
      SELECT 1
      FROM shift s
      WHERE s.employee_id = NEW.employee_id
        AND s.date BETWEEN NEW.start_date AND NEW.end_date
    ) THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot accept time off request: employee has a scheduled shift during this period';
    END IF;
  END IF;
END$$

DELIMITER ;
