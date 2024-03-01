CREATE TABLE launches (
  flight_id VARCHAR(255) PRIMARY KEY,
  mission VARCHAR(255),
  rocket VARCHAR(255),
  launch_date VARCHAR(255),
  target VARCHAR(255),
  customer VARCHAR(255),
  upcoming BOOLEAN DEFAULT true,
  success BOOLEAN DEFAULT true
);

CREATE TABLE launch_dates (
  launch_date VARCHAR(255),
  flight_id VARCHAR(255),
  FOREIGN KEY (flight_id) 
  REFERENCES launches(flight_id)
  ON DELETE CASCADE
  ON UPDATE RESTRICT
);

CREATE TABLE rockets (
  rocket_name VARCHAR(255) NOT NULL,
  rocket_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (rocket_id) 
  REFERENCES launches(flight_id)
  ON DELETE CASCADE
  ON UPDATE RESTRICT
);

CREATE TABLE mission {
    mission VARCHAR(255),
    
};


DROP TABLE launches;

DROP TABLE targets;

DROP TABLE rockets;

DROP TABLE launch_dates;

SELECT * FROM launches;


INSERT INTO targets (target_name) VALUES ('mars');

INSERT INTO launches VALUES (
    'kdldkls3234jkjj',
    'Kepler',
    'KD1,KD1',
    true,
    true,
    NULL,
    NULL,
    NULL
);
