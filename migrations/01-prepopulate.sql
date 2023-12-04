 INSERT INTO "group"
            ("id",
             "name")
VALUES      (0,
             'admin');

INSERT INTO "user"
            ("id",
             "username",
             "password")
VALUES      (0,
             'admin',
             '$2a$10$pjKE7ksdTS1t7bg7Qlxwauo9o0dCGK3onU2wuG02kWMxse.qAumly');

INSERT INTO "group_users"
            ("group_id",
             "user_id")
VALUES      (0,
             0);

INSERT INTO "file_descriptor"
            ("id",
             "name",
             "owner_id",
             "group_id",
             "permissions",
             "parent_directory_id")
VALUES      (0,
             'root',
             0,
             0,
             15,
             NULL);

INSERT INTO "directory"
            ("id",
             "descriptor_id")
VALUES      (0,
             0);
