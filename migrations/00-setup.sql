 CREATE TABLE "group"
  (
     "id"   SERIAL PRIMARY KEY,
     "name" VARCHAR(255) NOT NULL
  );

ALTER TABLE "group"
  ADD CONSTRAINT "group_name_unique" UNIQUE ("name");

CREATE TABLE "user"
  (
     "id"       SERIAL PRIMARY KEY,
     "username" VARCHAR(255) NOT NULL,
     "password" VARCHAR(255) NOT NULL
  );

CREATE INDEX "user_username_index"
  ON "user" ("username");

ALTER TABLE "user"
  ADD CONSTRAINT "user_username_unique" UNIQUE ("username");

CREATE TABLE "group_users"
  (
     "group_id" INT NOT NULL,
     "user_id"  INT NOT NULL,
     CONSTRAINT "group_users_pkey" PRIMARY KEY ("group_id", "user_id")
  );

CREATE TABLE "file_descriptor"
  (
     "id"                  SERIAL PRIMARY KEY,
     "owner_id"            INT NOT NULL,
     "permissions"         INT NOT NULL,
     "parent_directory_id" INT NOT NULL
  );

CREATE TABLE "file"
  (
     "id"            SERIAL PRIMARY KEY,
     "data"          JSONB NOT NULL,
     "descriptor_id" INT NOT NULL
  );

ALTER TABLE "file"
  ADD CONSTRAINT "file_descriptor_id_unique" UNIQUE ("descriptor_id");

CREATE TABLE "directory"
  (
     "id"            SERIAL PRIMARY KEY,
     "descriptor_id" INT NOT NULL
  );

ALTER TABLE "directory"
  ADD CONSTRAINT "directory_descriptor_id_unique" UNIQUE ("descriptor_id");

ALTER TABLE "group_users"
  ADD CONSTRAINT "group_users_group_id_foreign" FOREIGN KEY ("group_id")
  REFERENCES "group" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "group_users"
  ADD CONSTRAINT "group_users_user_id_foreign" FOREIGN KEY ("user_id")
  REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "file_descriptor"
  ADD CONSTRAINT "file_descriptor_owner_id_foreign" FOREIGN KEY ("owner_id")
  REFERENCES "user" ("id") ON UPDATE CASCADE;

ALTER TABLE "file_descriptor"
  ADD CONSTRAINT "file_descriptor_parent_directory_id_foreign" FOREIGN KEY (
  "parent_directory_id") REFERENCES "directory" ("id") ON UPDATE CASCADE;

ALTER TABLE "file"
  ADD CONSTRAINT "file_descriptor_id_foreign" FOREIGN KEY ("descriptor_id")
  REFERENCES "file_descriptor" ("id") ON UPDATE CASCADE;

ALTER TABLE "directory"
  ADD CONSTRAINT "directory_descriptor_id_foreign" FOREIGN KEY ("descriptor_id")
  REFERENCES "file_descriptor" ("id") ON UPDATE CASCADE;
