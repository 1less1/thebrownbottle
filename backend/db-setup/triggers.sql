USE thebrownbottle;

DELIMITER $$
-- -----------------------------------------------------
-- Event: shift prevent double booking
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER shift_prevent_double_booking
BEFORE UPDATE ON shift
FOR EACH ROW
BEGIN
  -- Only check when employee_id is changing
  IF NEW.employee_id IS NOT NULL AND NEW.employee_id != OLD.employee_id THEN

    -- Check if this employee already has a shift on that date
    IF EXISTS (
      SELECT 1
      FROM shift s
      WHERE s.employee_id = NEW.employee_id
        AND s.date = NEW.date
        AND s.shift_id != NEW.shift_id
    ) THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee already has a shift on this date';
    END IF;

  END IF;
END$$

DELIMITER ;
