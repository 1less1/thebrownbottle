USE thebrownbottle;


-- -----------------------------------------------------
-- Event: after employee inser --> insert default availability
-- -----------------------------------------------------
DELIMITER $$
CREATE TRIGGER after_employee_insert
AFTER INSERT ON employee
FOR EACH ROW
BEGIN
    INSERT INTO availability (employee_id, day_of_week, is_available, start_time, end_time)
    VALUES 
        (NEW.employee_id, 'Sunday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Monday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Tuesday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Wednesday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Thursday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Friday', 1, NULL, NULL), -- Yes
        (NEW.employee_id, 'Saturday', 1, NULL, NULL); -- Yes
END$$
DELIMITER ;


-- -----------------------------------------------------
-- Event: shift prevent double booking
-- -----------------------------------------------------
DELIMITER $$
CREATE TRIGGER shift_prevent_double_booking_insert
BEFORE INSERT ON shift
FOR EACH ROW
BEGIN
    IF EXISTS (
      SELECT 1 FROM shift 
      WHERE employee_id = NEW.employee_id AND date = NEW.date
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee already has a shift on this date';
    END IF;
END$$

CREATE TRIGGER shift_prevent_double_booking_update
BEFORE UPDATE ON shift
FOR EACH ROW
BEGIN
  -- Only check if employee or date is changing
  IF (NEW.employee_id != OLD.employee_id OR NEW.date != OLD.date) THEN
    IF EXISTS (
      SELECT 1 FROM shift 
      WHERE employee_id = NEW.employee_id AND date = NEW.date AND shift_id != NEW.shift_id
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Employee already has a shift on this date';
    END IF;
  END IF;
END$$
DELIMITER ;
