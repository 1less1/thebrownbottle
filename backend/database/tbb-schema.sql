-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;

-- -----------------------------------------------------
-- Schema thebrownbottle
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `thebrownbottle` DEFAULT CHARACTER SET utf8mb3 ;
USE `thebrownbottle` ;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`role` (
  `role_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`section`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`section` (
  `section_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `section_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`section_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`employee` (
  `employee_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(250) NOT NULL,
  `last_name` VARCHAR(250) NOT NULL,
  `email` VARCHAR(250) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `wage` DECIMAL(10,2) NOT NULL,
  `admin` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `primary_role` INT UNSIGNED NOT NULL,
  `secondary_role` INT UNSIGNED DEFAULT NULL,
  `tertiary_role` INT UNSIGNED DEFAULT NULL,
  `is_active` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  CONSTRAINT `fk_primary_role`
    FOREIGN KEY (`primary_role`)
    REFERENCES `thebrownbottle`.`role` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_secondary_role`
    FOREIGN KEY (`secondary_role`)
    REFERENCES `thebrownbottle`.`role` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_tertiary_role`
    FOREIGN KEY (`tertiary_role`)
    REFERENCES `thebrownbottle`.`role` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`recurring_task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`recurring_task` (
  `recurring_task_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  `mon` TINYINT(1) NOT NULL, -- 1 = true is put into the day the task recurrs
  `tue` TINYINT(1) NOT NULL,
  `wed` TINYINT(1) NOT NULL,
  `thu` TINYINT(1) NOT NULL,
  `fri` TINYINT(1) NOT NULL,
  `sat` TINYINT(1) NOT NULL,
  `sun` TINYINT(1) NOT NULL,
  `start_date` DATE NOT NULL,  -- The start date for the task
  `end_date` DATE NULL,  -- Optional: the end date for recurring tasks
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recurring_task_id`),
  INDEX `fk_recurring_task_author_idx` (`author_id`), -- Indexes improves query performance
  CONSTRAINT `fk_recurring_task_author`
    FOREIGN KEY (`author_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recurring_task_section`
    FOREIGN KEY (`section_id`)
    REFERENCES `thebrownbottle`.`section` (`section_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`task` (
  `task_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  `due_date` DATE NOT NULL,
  `complete` TINYINT(1) NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  `recurring_task_id` INT UNSIGNED DEFAULT NULL,  -- Foreign key to the recurring_task table, nullable for non-recurring tasks
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- creation time
  `last_modified_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP, -- last updated time
  `last_modified_by` INT UNSIGNED DEFAULT NULL,  -- Tracks the employee who last modified the task
  PRIMARY KEY (`task_id`),
  INDEX `fk_task_author_idx` (`author_id`),
  INDEX `fk_task_recurring_task_idx` (`recurring_task_id`),
  INDEX `fk_task_last_modified_by_idx` (`last_modified_by`),
  CONSTRAINT `fk_task_author`
    FOREIGN KEY (`author_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_task_section`
    FOREIGN KEY (`section_id`)
    REFERENCES `thebrownbottle`.`section` (`section_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_task_recurring_task`
    FOREIGN KEY (`recurring_task_id`)
    REFERENCES `thebrownbottle`.`recurring_task` (`recurring_task_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_task_last_modified_by`
    FOREIGN KEY (`last_modified_by`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`announcement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`announcement` (
  `announcement_id` INT NOT NULL AUTO_INCREMENT,
  `author_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `role_id` INT UNSIGNED NOT NULL DEFAULT 1,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`),
  UNIQUE INDEX `announcement_id_UNIQUE` (`announcement_id` ASC) VISIBLE,
  CONSTRAINT `fk_author`
    FOREIGN KEY (`author_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `thebrownbottle`.`role` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `thebrownbottle`.`announcement_acknowledgment`
-- -----------------------------------------------------

CREATE TABLE announcement_acknowledgment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    announcement_id INT NOT NULL,
    employee_id  INT NOT NULL,
    acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (announcement_id, employee_id )
);

-- -----------------------------------------------------
-- Table `thebrownbottle`.`shift`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`shift` (
  `shift_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `start_time` TIME NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`shift_id`),
  UNIQUE INDEX employee_date_idx (employee_id, date),
  INDEX `section_id_idx` (`section_id`),
  CONSTRAINT `sch_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `shift_section_id`
    FOREIGN KEY (`section_id`)
    REFERENCES `thebrownbottle`.`section` (`section_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`shift_cover_request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`shift_cover_request` (
  `cover_request_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `shift_id` INT UNSIGNED NOT NULL,
  `accepted_employee_id` INT UNSIGNED DEFAULT NULL,
  `requested_employee_id` INT UNSIGNED NOT NULL,
  `status` ENUM('Pending', 'Awaiting Approval', 'Accepted', 'Denied') NOT NULL DEFAULT 'Pending',
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cover_request_id`),
  INDEX `fk_shift_cover_request_shift1_idx` (`shift_id` ASC),
  CONSTRAINT `fk_cover_shift`
    FOREIGN KEY (`shift_id`)
    REFERENCES `thebrownbottle`.`shift` (`shift_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cover_requested_employee`
    FOREIGN KEY (`requested_employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cover_accepted_employee`
    FOREIGN KEY (`accepted_employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `thebrownbottle`.`time_off_request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`time_off_request` (
  `request_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('Pending', 'Accepted', 'Denied') NOT NULL DEFAULT 'Pending',
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  CONSTRAINT `fk_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `chk_dates` CHECK (`end_date` >= `start_date`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
