CREATE TABLE events (
    id              INT            NOT NULL AUTO_INCREMENT,
    visitorID       INT            NULL,
    timestamp       DATETIME       NULL,
    category        VARCHAR(128)   NULL,
    action          VARCHAR(128)   NULL,
    label           TEXT           NULL,
    value           INT            NULL,
    count           INT            NULL,
    
    PRIMARY KEY (id)
);


CREATE TABLE visitors (
    id              INT            NOT NULL AUTO_INCREMENT,
    remoteAddr      VARCHAR(64)    NULL,
    firstVisit      DATETIME       NULL,
    lastVisit       DATETIME       NULL,
    visitCount      INT            NOT NULL DEFAULT 1,
    
    PRIMARY KEY (id)
);


CREATE TABLE users (
    id              INT            NOT NULL AUTO_INCREMENT,
    visID           INT            NULL,
    username        VARCHAR(64)    NOT NULL,
#    password        CHAR(32)       NOT NULL,                 # salted MD5 hash
	role            VARCHAR(32)    NULL,
    signupDate      DATETIME       NULL,
    lastLogin       DATETIME       NULL,
  
    # more fields to come...
    firstName       VARCHAR(32),
    lastName        VARCHAR(32),
    email           VARCHAR(64),                              # same as the username initially
    country         VARCHAR(32),
    context         VARCHAR(32),
    expnum          INT NULL,
    
    PRIMARY KEY (id)
);


CREATE TABLE templates (
    id              INT            NOT NULL AUTO_INCREMENT,
    name            VARCHAR(128)   NOT NULL,
	types           VARCHAR(64)    NULL,
	keywords        VARCHAR(1024)  NULL,
	categories      VARCHAR(1024)  NULL,
    contents        TEXT           NULL,

	FULLTEXT INDEX (name),
	FULLTEXT INDEX (keywords),
	FULLTEXT INDEX (categories),
	FULLTEXT INDEX (contents),
    PRIMARY KEY(id),
	UNIQUE(name)
) ENGINE = MYISAM;

ALTER TABLE templates ADD COLUMN ratingScore INT NULL AFTER name;
ALTER TABLE templates ADD COLUMN ratingCount INT NULL AFTER ratingScore;





INSERT INTO templates SET name='Absence Request', type='pdf';
INSERT INTO templates SET name='Admissions Application2', type='pdf';
INSERT INTO templates SET name='Bill Of Lading', type='pdf';
INSERT INTO templates SET name='clean-Contact2', type='pdf';
INSERT INTO templates SET name='clean-Employee Time Tracking', type='pdf';
INSERT INTO templates SET name='clean-Feedback Form', type='pdf';
INSERT INTO templates SET name='clean-Order Supplies', type='pdf';
INSERT INTO templates SET name='contact Form3', type='pdf';
INSERT INTO templates SET name='Contact Us', type='pdf';
INSERT INTO templates SET name='Contact2', type='pdf';
INSERT INTO templates SET name='Employee Request for Leave', type='pdf';
INSERT INTO templates SET name='Employee Time Tracking', type='pdf';
INSERT INTO templates SET name='Employment Application', type='pdf';
INSERT INTO templates SET name='Feedback Form', type='pdf';
INSERT INTO templates SET name='Feedback Form2', type='pdf';
INSERT INTO templates SET name='Grant Application', type='pdf';
INSERT INTO templates SET name='Hotel Survey', type='pdf';
INSERT INTO templates SET name='Meeting Sign-in Sheet', type='pdf';
INSERT INTO templates SET name='Order Supplies2', type='pdf';
INSERT INTO templates SET name='Order Supplies', type='pdf';
INSERT INTO templates SET name='Purchase Order', type='pdf';
INSERT INTO templates SET name='Rental Application', type='pdf';
INSERT INTO templates SET name='School Survey', type='pdf';
INSERT INTO templates SET name='Volunteer Application', type='pdf';



CREATE TABLE categories (
    id              INT            NOT NULL AUTO_INCREMENT,
    name            VARCHAR(128)   NOT NULL
)


INSERT INTO categories SET name='Application';
INSERT INTO categories SET name='Contact';
INSERT INTO categories SET name='Employee';
INSERT INTO categories SET name='Feedback';
INSERT INTO categories SET name='Order';
INSERT INTO categories SET name='Questionnaire';
INSERT INTO categories SET name='Registration';
INSERT INTO categories SET name='Request';
INSERT INTO categories SET name='Service';


CREATE TABLE template_categories (
    template_id     INT            NOT NULL,
	category_id     INT            NOT NULL
);

CREATE TABLE forms (
    id              INT            NOT NULL AUTO_INCREMENT,
    visitorID       INT            NULL,
    created         DATETIME       NULL,
    modified        DATETIME       NULL,
    title           VARCHAR(128)   NULL,
	category        VARCHAR(64)    NULL,                 # registration, order, contact, application, etc.
	type            INT            NOT NULL DEFAULT 1,   # 0 = template, 1 = user created
    
    PRIMARY KEY (id)
);



CREATE TABLE field_templates (
    id              INT            NOT NULL AUTO_INCREMENT,
    label           VARCHAR(128)   NULL,
	type            INT            NULL,
    
    PRIMARY KEY (id)
);

