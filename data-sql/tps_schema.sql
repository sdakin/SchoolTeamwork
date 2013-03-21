
CREATE TABLE users (
	id 				INT NOT NULL AUTO_INCREMENT,
	username        VARCHAR(32)    	NOT NULL,	# for logging in
	password        CHAR(32)       	NOT NULL,   # MD5 hash

	firstName       VARCHAR(32)    	NOT NULL,
	lastName        VARCHAR(32)    	NOT NULL,
	emailAddress    VARCHAR(64)    	NULL,
	role			INT 			NOT NULL,	# 1=teacher, 2=student, 3=parent

#	lastLogin       DATETIME       	NULL,
#	signupDate      DATETIME       	NOT NULL,   # when the user signed up for an account
#	verifiedDate    DATETIME       	NULL,   	# when the user verified their email address
#	tempPassword    CHAR(32)       	NULL,       # MD5 hash, only set if user requests a reset
	                                            # and only valid for a certain amount of time
#	tempPasswordCreated DATETIME  	NULL,       # when the tempPassword was generated
    
    PRIMARY KEY (id)
);


CREATE TABLE classInfo (
	id 			INT 			NOT NULL AUTO_INCREMENT,
	teacherID   INT 			NOT NULL,
	name 		VARCHAR(64) 	NOT NULL,
	slot        VARCHAR(32)		NOT NULL,

	PRIMARY KEY (id)
);


CREATE TABLE classRoster (
	classID		INT 	NOT NULL,
	studentID	INT 	NOT NULL
);


CREATE TABLE categories (
	id 			INT NOT NULL AUTO_INCREMENT,
	name 		VARCHAR(32)		NOT NULL,

	PRIMARY KEY (id)
);


CREATE TABLE scores (
	scoreDate   DATE         NOT NULL,
	scorerID    INT          NOT NULL,
	scoreeID    INT          NOT NULL,
	scoreData   TEXT         NOT NULL,
	note        TEXT         NULL,
	
	PRIMARY KEY (scoreDate, scorerID, scoreeID)
);


INSERT INTO users ('username', 'password', 'firstName', 'lastName', 'role') VALUES
('david', '', 'DK', 'Sweet', 1),
('annie', '', 'Annabelle', 'Vince', 2),
('max', '', 'Maxwewll', 'Vince', 3);


INSERT INTO categories ('name') VALUES
('Creativity'),
('Collaboration'),
('Likeability'),
('Empathy'),
('Leadership');
