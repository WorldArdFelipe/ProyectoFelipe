-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`ScoreModels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ScoreModels` (
  `Key` INT NOT NULL AUTO_INCREMENT,
  `Modelo` VARCHAR(45) NOT NULL,
  `F1 Score` FLOAT NOT NULL,
  `Score Test` FLOAT NOT NULL,
  `Score Train` FLOAT NOT NULL,
  PRIMARY KEY (`Key`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`OuputModel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`OuputModel` (
  `Key` INT NOT NULL AUTO_INCREMENT,
  `Modelo` VARCHAR(45) NOT NULL,
  `result_dengue` VARCHAR(45) NOT NULL,
  `conduct_dengue` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Key`))
ENGINE = InnoDB;