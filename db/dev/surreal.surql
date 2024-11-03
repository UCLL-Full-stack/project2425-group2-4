-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- ACCESSES
-- ------------------------------

DEFINE ACCESS user ON DATABASE TYPE RECORD SIGNUP (CREATE user CONTENT { email: $email, password: crypto::argon2::generate($password), role: $role, username: $name }) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)) WITH JWT ALGORITHM HS512 KEY 'enMIR5S6hHboqYTpbhe8/Re4cdmD5eMEjX05yD13AsbwWPy7kytLRLCjf7KOSBYYwIuYf99YC+wVeOJUQ7Lb3A==' WITH ISSUER KEY 'enMIR5S6hHboqYTpbhe8/Re4cdmD5eMEjX05yD13AsbwWPy7kytLRLCjf7KOSBYYwIuYf99YC+wVeOJUQ7Lb3A==' DURATION FOR TOKEN 1d, FOR SESSION 1d;

-- ------------------------------
-- TABLE: chat
-- ------------------------------

DEFINE TABLE chat TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update WHERE array::any(->hasUser->user, $auth.id), FOR delete WHERE NONE;

DEFINE FIELD created_at ON chat TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
DEFINE FIELD name ON chat TYPE string DEFAULT 'Untitled' PERMISSIONS FULL;

-- ------------------------------
-- TABLE: hasUser
-- ------------------------------

DEFINE TABLE hasUser TYPE RELATION IN chat OUT user SCHEMALESS PERMISSIONS FOR select, create, update, delete WHERE out = $auth.id;

DEFINE FIELD in ON hasUser TYPE record<chat> PERMISSIONS FULL;
DEFINE FIELD out ON hasUser TYPE record<user> PERMISSIONS FULL;

-- ------------------------------
-- TABLE: message
-- ------------------------------

DEFINE TABLE message TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD messenger ON message TYPE record<user> DEFAULT $auth.id PERMISSIONS FULL;
DEFINE FIELD text ON message TYPE string PERMISSIONS FULL;
DEFINE FIELD timestamp ON message TYPE datetime DEFAULT time::now() PERMISSIONS FULL;

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select FULL, FOR create NONE, FOR update, delete WHERE id = $auth.id;

DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value) PERMISSIONS FULL;
DEFINE FIELD password ON user TYPE string PERMISSIONS FOR select NONE, FOR create, update FULL;
DEFINE FIELD role ON user TYPE string PERMISSIONS FULL;
DEFINE FIELD username ON user TYPE string PERMISSIONS FOR select FULL, FOR create, update WHERE FULL;

DEFINE INDEX email ON user FIELDS email UNIQUE;
DEFINE INDEX username ON user FIELDS username UNIQUE;

-- ------------------------------
-- TABLE: writtenIn
-- ------------------------------

DEFINE TABLE writtenIn TYPE RELATION IN message OUT chat ENFORCED SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON writtenIn TYPE record<message> PERMISSIONS FULL;
DEFINE FIELD out ON writtenIn TYPE record<chat> PERMISSIONS FULL;

-- ------------------------------
-- TABLE DATA: chat
-- ------------------------------

INSERT [ { created_at: d'2024-11-01T11:48:33.204Z', id: chat:7dmsznbtiygigl64g9rn, name: 'boys' }, { created_at: d'2024-11-03T12:46:39.916862400Z', id: chat:7v416jbcmiwsqlveii6t, name: "Sunny's chat" }, { created_at: d'2024-11-02T12:59:30.623799587Z', id: chat:ax7c0wthqo4679o1bd8j, name: 'Private Party' }, { created_at: d'2024-11-02T20:09:59.560627476Z', id: chat:b59vt6xxw3penhu0mr5j, name: 'Thunder' }, { created_at: d'2024-11-02T20:30:46.921473994Z', id: chat:m6dne04wwpx774o0nzj8, name: "Sunny's chat" } ];

-- ------------------------------
-- TABLE DATA: hasUser
-- ------------------------------

INSERT RELATION [ { __: true, id: hasUser:2lcqkzog2hpdvzsuumns, in: chat:7v416jbcmiwsqlveii6t, out: user:jzg4g63tdrykqv9kj1iv }, { __: true, id: hasUser:5xiguthxwkbxrpbq3q1b, in: chat:ax7c0wthqo4679o1bd8j, out: user:9j3aucmkjf78crukmmts }, { __: true, id: hasUser:6xcib5qago74mnjrps7t, in: chat:m6dne04wwpx774o0nzj8, out: user:jzg4g63tdrykqv9kj1iv }, { __: true, id: hasUser:7n11g3hyr5mka4qn5ndu, in: chat:7dmsznbtiygigl64g9rn, out: user:g6ga3f0hr7nzqeqwa22w }, { __: true, id: hasUser:bryum93mk8es2h05dl01, in: chat:ax7c0wthqo4679o1bd8j, out: user:j8c31dew47v4z8u9sffq }, { __: true, id: hasUser:f7fvavotmshohlwbf9s4, in: chat:b59vt6xxw3penhu0mr5j, out: user:jzg4g63tdrykqv9kj1iv }, { __: true, id: hasUser:y0gmnplsytkrm5rqcj0y, in: chat:7dmsznbtiygigl64g9rn, out: user:dswuwqqwlm0vdrpupo6e } ];

-- ------------------------------
-- TABLE DATA: message
-- ------------------------------

INSERT [ { id: message:6i6ua9z3crc0miwvjdtw, messenger: user:g6ga3f0hr7nzqeqwa22w, text: 'this is a test message', timestamp: d'2024-11-01T15:21:46.042573486Z' }, { id: message:70509mkgouqw3qn2z4nq, messenger: user:g6ga3f0hr7nzqeqwa22w, text: 'this is a test message', timestamp: d'2024-11-01T15:22:39.428770845Z' }, { id: message:bfaw4ebniq3aqfbnjmch, messenger: user:g6ga3f0hr7nzqeqwa22w, text: 'this is a test message', timestamp: d'2024-11-01T13:57:39.137287956Z' }, { id: message:dgeskiy5dpq5q33i8rkl, messenger: user:jzg4g63tdrykqv9kj1iv, text: 'Hello? anyone here?', timestamp: d'2024-11-02T20:11:21.557146852Z' }, { id: message:qid914nvb1d90lwdy7ky, messenger: user:jzg4g63tdrykqv9kj1iv, text: 'Hello? anyone here?', timestamp: d'2024-11-02T20:32:02.501974110Z' }, { id: message:spm1ixdvsa7g7uthff6u, messenger: user:g6ga3f0hr7nzqeqwa22w, text: 'hello, how are you doing?', timestamp: d'2024-11-01T11:54:55.826239416Z' }, { id: message:zxxrabahmou7v78q8hip, messenger: user:dswuwqqwlm0vdrpupo6e, text: "I'm doing great, hby?", timestamp: d'2024-11-01T11:55:27.476308263Z' } ];

-- ------------------------------
-- TABLE DATA: user
-- ------------------------------

INSERT [ { email: 'frits@frits.be', id: user:3w1vkk6nbmv52xmp441g, password: '$argon2id$v=19$m=19456,t=2,p=1$RkSspqVvU1Gj2u+HojqhXQ$tKQpyBgJ8o/fOTMZ0gxCHpkj1dooqV/90FfS22g/Q7Q', role: 'User', username: 'frits' }, { email: 'admin@admin.be', id: user:9j3aucmkjf78crukmmts, password: '$argon2id$v=19$m=19456,t=2,p=1$lLLYdOE35gTQlwUiElZP+Q$SLxnvAp7f3aZBlVlydEKj3fWjoOLQYLCv2VeSvpjVEA', role: 'Admin', username: 'admin' }, { email: 'nassim@gmail.com', id: user:dswuwqqwlm0vdrpupo6e, password: '$argon2id$v=19$m=19456,t=2,p=1$wFGdkdmSMLdyrqHwblPhlg$+o/YzrGexvmTBq8kfj0LsfDWQKnfzV8KJkoVObf5RG0', role: 'admin', username: 'nassim' }, { email: 'jan@jan.be', id: user:g6ga3f0hr7nzqeqwa22w, password: '$argon2id$v=19$m=19456,t=2,p=1$5j+fPw8SLthyosAt7ymHAw$saMQ3nkfJBbSjzJZFQpqabzzmAcqHy3idlpf2oId+Wg', role: 'User', username: 'jan' }, { email: 'frans@frans.be', id: user:j8c31dew47v4z8u9sffq, password: '$argon2id$v=19$m=19456,t=2,p=1$y2nwL+zjOLdXiSjm25kE6g$oPFrJMMVgY9JtxoLKNB0FQ0E/NHtNPWsOM7+9V4arXk', role: 'Admin', username: 'frans' }, { email: 'test3@test.be', id: user:jzg4g63tdrykqv9kj1iv, password: '$argon2id$v=19$m=19456,t=2,p=1$hA/a/O7XBnBkdASt1pqZGQ$NzYd9GUfFF4ZLGzwX30yBEs6FDwRi3MHXFlpIuBi4UI', role: 'user', username: 'test3' }, { email: 'test2@test.be', id: user:lo9g40e1pf8sxtrsi0g5, password: '$argon2id$v=19$m=19456,t=2,p=1$0P/jzPbdrQIi2GWFG4NO7g$HyJVmBxn8W/aJFyg7R2BGUz//5+Yz5/oHIdN9RglEIA', role: 'user', username: 'test2' }, { email: 'test@test.be', id: user:qm1xbwt0n1u4ci10uw4l, password: '$argon2id$v=19$m=19456,t=2,p=1$OiKHWAyAnVstD+eC5T2VLw$O/vD+mPrRaztGpMFbTfX27o87mfpXFXslMd4RHivwTc', role: 'user', username: 'test' } ];

-- ------------------------------
-- TABLE DATA: writtenIn
-- ------------------------------

INSERT RELATION [ { __: true, id: writtenIn:2xdfvy37df4foi8o1dio, in: message:zxxrabahmou7v78q8hip, out: chat:7dmsznbtiygigl64g9rn }, { __: true, id: writtenIn:89pblx97hmzsty2phjjp, in: message:spm1ixdvsa7g7uthff6u, out: chat:7dmsznbtiygigl64g9rn }, { __: true, id: writtenIn:jvfsesbsrpxxjuys0ysj, in: message:dgeskiy5dpq5q33i8rkl, out: chat:b59vt6xxw3penhu0mr5j }, { __: true, id: writtenIn:ko5512nr9jk4dsjw2sjw, in: message:qid914nvb1d90lwdy7ky, out: chat:m6dne04wwpx774o0nzj8 } ];


