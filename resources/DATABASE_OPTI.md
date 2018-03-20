# Database optimization

## PostgreSQL

### Indexes

One of the quickest and fastest way of increasing your database performance is to index your data. Several type of data should be indexed:

1) Primary Key: should be done automatically by the database engine.
2) Foreign Key: it is not done by the database engine automatically so it is your responsability (or your ORM's).
3) Field in `where` clause: definitely not done automatically but increases performances.

#### JSONB

`JSONB` type should be index using a `gin()` index.

#### Side notes

PostgreSQL does not handle composite indexes, it only indexes the first element so make sure you create indexes with only one element.

30% to 40% of your database data should be indexed.
