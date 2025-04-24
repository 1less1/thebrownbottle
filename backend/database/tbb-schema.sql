-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema thebrownbottle
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema thebrownbottle
-- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `thebrownbottle` DEFAULT CHARACTER SET utf8mb3 ;
USE `thebrownbottle` ;

-- -----------------------------------------------------
-- Table `thebrownbottle`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`employee` (
  `employee_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(128) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `wage` DECIMAL(10,2) NOT NULL,
  `admin` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`employee_id`),
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`announcement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`announcement` (
  `announcement_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`announcement_id`, `employee_id`),
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  UNIQUE INDEX `anncouncement_id_UNIQUE` (`announcement_id` ASC) VISIBLE,
  CONSTRAINT `employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`attendance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`attendance` (
  `attendance_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `clock_in_time` TIMESTAMP NOT NULL,
  `clock_out_time` TIMESTAMP NOT NULL,
  PRIMARY KEY (`attendance_id`, `employee_id`),
  UNIQUE INDEX `attendance_id_UNIQUE` (`attendance_id` ASC) VISIBLE,
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `att_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`availibility`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`availibility` (
  `availibility_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `day_of_week` ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Denied') NOT NULL,
  PRIMARY KEY (`availibility_id`, `employee_id`),
  UNIQUE INDEX `avalibility_id_UNIQUE` (`availibility_id` ASC) VISIBLE,
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `ava_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`chat` (
  `chat_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`chat_id`, `sender_id`, `receiver_id`),
  UNIQUE INDEX `sender_id_UNIQUE` (`sender_id` ASC) VISIBLE,
  UNIQUE INDEX `receiver_id_UNIQUE` (`receiver_id` ASC) VISIBLE,
  UNIQUE INDEX `chat_id_UNIQUE` (`chat_id` ASC) VISIBLE,
  CONSTRAINT `receiver_id`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `sender_id`
    FOREIGN KEY (`sender_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`role` (
  `role_id` INT UNSIGNED NOT NULL,
  `employee_id` INT UNSIGNED NOT NULL,
  `role_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`role_id`, `employee_id`),
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  CONSTRAINT `role_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`permissions` (
  `permission_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` INT UNSIGNED NOT NULL,
  `module_name` VARCHAR(255) NOT NULL,
  `can_create` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `can_read` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `can_update` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  `can_delete` TINYINT UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`permission_id`, `role_id`),
  UNIQUE INDEX `permission_id_UNIQUE` (`permission_id` ASC) VISIBLE,
  INDEX `role_id_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `thebrownbottle`.`role` (`role_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
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
-- Table `thebrownbottle`.`shift`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`shift` (
  `shift_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `employee_id` INT UNSIGNED NOT NULL,
  `start_time` TIME NULL DEFAULT NULL,
  `end_time` TIME NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`shift_id`, `employee_id`),
  UNIQUE INDEX `schedule_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  UNIQUE INDEX `employee_id_UNIQUE` (`shift_id` ASC) VISIBLE,
  INDEX `section_id_idx` (`section_id` ASC) VISIBLE,
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
  `accepted_employee_id` INT UNSIGNED NOT NULL,
  `requested_employee_id` INT UNSIGNED NOT NULL,
  `status` ENUM('Pending', 'Accepted', 'Denied') NOT NULL,
  PRIMARY KEY (`cover_request_id`, `shift_id`, `accepted_employee_id`, `requested_employee_id`),
  UNIQUE INDEX `cover_request_id_UNIQUE` (`cover_request_id` ASC) VISIBLE,
  UNIQUE INDEX `employee_id_UNIQUE` (`accepted_employee_id` ASC) VISIBLE,
  UNIQUE INDEX `requested_employee_id_UNIQUE` (`requested_employee_id` ASC) VISIBLE,
  INDEX `fk_shift_cover_request_shift1_idx` (`shift_id` ASC) VISIBLE,
  CONSTRAINT `fk_shift_cover_request_shift1`
    FOREIGN KEY (`shift_id`)
    REFERENCES `thebrownbottle`.`shift` (`shift_id`),
  CONSTRAINT `requested_employee_id`
    FOREIGN KEY (`requested_employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `scr_employee_id`
    FOREIGN KEY (`accepted_employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `thebrownbottle`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `thebrownbottle`.`task` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(250) NOT NULL,
  `description` VARCHAR(250) NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `assignee_id` INT UNSIGNED NOT NULL,
  `due_date` DATE NOT NULL,
  `complete` TINYINT(1) NOT NULL,
  PRIMARY KEY (`task_id`),
  UNIQUE INDEX `task_id_UNIQUE` (`task_id` ASC) VISIBLE,
  INDEX `fk_task_employee_idx` (`author_id` ASC) VISIBLE,
  INDEX `fk_task_assignee_idx` (`assignee_id` ASC) VISIBLE,
  CONSTRAINT `fk_task_assignee`
    FOREIGN KEY (`assignee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_task_author`
    FOREIGN KEY (`author_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
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
  `status` ENUM('Pending', 'Accepted', 'Denied') NOT NULL,
  PRIMARY KEY (`request_id`, `employee_id`),
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) VISIBLE,
  UNIQUE INDEX `request_id_UNIQUE` (`request_id` ASC) VISIBLE,
  CONSTRAINT `tof_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `thebrownbottle`.`employee` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
