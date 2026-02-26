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
-- -----------------------------------------------------
-- Event: out_of_date_request
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER out_of_date_request
BEFORE INSERT ON shift_cover_request
FOR EACH ROW
BEGIN
  IF (SELECT date FROM shift WHERE shift_id = NEW.shift_id) < CURDATE() THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot create a shift cover request for a shift that has already passed';
  END IF;
END$$

DELIMITER ;
-- -----------------------------------------------------
-- Event: out_of_date_SC_accept
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER out_of_date_SC_accept
BEFORE UPDATE ON shift_cover_request
FOR EACH ROW
BEGIN
  IF NEW.status = 'Accepted' AND OLD.status != 'Accepted' THEN
    IF (SELECT date FROM shift WHERE shift_id = NEW.shift_id) < CURDATE() THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot accept a shift cover request for a shift that has already passed';
    END IF;
  END IF;
END$$

DELIMITER ;
-- -----------------------------------------------------
-- Event: duplicate_time_off_SC_request
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER duplicate_time_off_SC_request
BEFORE INSERT ON time_off_request
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM time_off_request
    WHERE employee_id = NEW.employee_id
      AND status != 'Denied'
      AND NEW.start_date <= end_date
      AND NEW.end_date >= start_date
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'A time off request already exists that overlaps with these dates';
  END IF;
END$$

DELIMITER ;
-- -----------------------------------------------------
-- Event: no_time_off_if_scheduled
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER no_time_off_if_scheduled
BEFORE INSERT ON time_off_request
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM shift
    WHERE employee_id = NEW.employee_id
      AND date BETWEEN NEW.start_date AND NEW.end_date
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot request time off: you have a scheduled shift during this period';
  END IF;
END$$

DELIMITER ;
-- -----------------------------------------------------
-- Event: out_of_date_TO_request
-- -----------------------------------------------------
DELIMITER $$

CREATE TRIGGER out_of_date_TO_request
BEFORE INSERT ON time_off_request
FOR EACH ROW
BEGIN
  IF NEW.start_date < CURDATE() THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot submit a time off request for dates that have already passed';
  END IF;
END$$

DELIMITER ;