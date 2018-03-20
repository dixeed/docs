# NoSQL

## Definition

* **node**: In the context of distributed data store, a node represents a server in such a system which is linked to other servers.

## Introduction

In the context of a distributed data store the CAP theorem takes place which states that it is impossible for such data store to simutaneously provide more than two out of the following three guarantees:

* **C**onsistency: every node in the system have access to the same data at the same moment.
* **A**vailability: every request receives a response without garantee that it contains the most recent version of the data.
* **P**artition tolerance: The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes.

Source: [Wikipedia](https://en.wikipedia.org/wiki/CAP_theorem).

Usually NoSQL database system are of: **AP** or **CP**.

## Categories

### Key/value

* The simplest
* Every object is identified by an unique key which is the only way to request that object.
* The object structure is not constrained and the developer is free to do as he pleases. Be careful of what you create, it can become really messy.
* 4 operations (CRUD).
* Usually has an HTTP Rest interface to interact with.
* Upsides: read/write performances are pretty high, can scale horizontaly.
* Values are of type string. You cannot query the content of data, for example if you store a JSON object you would not be able to make a query to select objects where `firstname = 'bob'`. You'd have to do that in your programming language.

### Document oriented

* An extension of the key/value paradigm.
* Can query the object content.
* Made of document collection.
* Is schemaless so you don't need to declare a schema structure as you would in a relational database.
* You can embed object within each other.
* Usually has an HTTP Rest interface to interact with.
* High performance, model flexibility. It is very well suited for CMS content management.
* Examples: MongoDB, RavenDB, CouchBase, CouchDB, DynamoDB.

### Column oriented

* The most complicated.
* Data structure is suitable for data analysis processing and massive data processing.
* Base entity represents a data field. Every column is defined by a key/value pair.
* A column containing other columns is called a **super column**. It is closed to the concept of a row in relational database. The key identifies the super column where the value is the list of columns it's made of. The super column is not available in all NoSQL column oriented database.
* A **column family** can regroup multiple columns. It is close to the table concept in relational database.
* It is possible to add a column or super column to any column family.
* Examples: Cassandra, Amazon SimpleDB, Google BigTable, Elasticsearch, HBase, Spark SQL.

### Graph oriented

* Primarily used for network oriented data (cartography, relations between people)
* Use a storage engine for objects in the form of document oriented database where each entity within this database is called _node_.
* It can describe relations between objects called _arc_. An arc has an orientation and can hold properties.
* Examples: Neo4J, OrientDB, Info Grid, Infinite Graph

### Search Engines

* Tools designed for indexation and data search.
* Provide a distributed and multi-entity search engine usually through an HTTP Rest interface.
* Usually they embed a NoSQL database (document or column oriented database) with a layer of abstraction.
* Examples: ElasticSearch

### Time Series database

* Designed to handle chronological data series or table numbers indexed by hours: periodic temperature readings, chronological energy consumption readings, stock exchange price.
* Designed to handle complex logic or business rules and a high transaction volume for time based data series.
* Examples: Riak-TS, InfluxDB, eXtremDB.

## When to use NoSQL?

### Pros

* Becomes relevant when having more than 10 millions lines in the database, below that mark relational databases can perfectly be as good as NoSQL performance-wise (indexes all the things).
* It is easier to build a distributed and high-availability data source system using NoSQL than with relation databases.
* Dynamic database structure. You don't have to define a structure thus two entities of the same type can have different structure.
* Easy to increase computational and storage capacity by adding new servers (horizontal scaling).
* It is easy and simple to request the system.

### Cons

* **No transactional mode**.
* **No join**. In the context of distributed servers this would have a serious impact on the performance otherwise.
* Dynamic database structure. As the structure is not forced upon the developer you can do whatever you want but it can lead to numerous problem if not done right. There are **no integrity contraints**.
* Can lead to race conditions for data update depending on the location of the server and the time needed to access it. The update to win the race is usually the one that performs the closest to the node storing the data.
* It is the developer's job to ensure data integrity through its code as the database system doesn't do it by itself.
* No query language standard. When you switch to another NoSQL database you'd have to rewrite your app because they do not share the same language syntax.

### Context

* Capturing and requesting incoming data from a multitude of data sources such as surveillance network.
* Data Service: Web oriented services, high performance/scalability, customer oriented services.

## Database design

As NoSQL database systems do not offer join feature you need to duplicate data to make the relation between them. Depending on the way you choose to structure your data it can have an impact on either read or write performance. You have to decide whether you want data integrity or better read performance.

To handle relations between entities, you can either:

1) Fully embed the entities you are linked to in your document (**good read performance** and **slow write performance**) such as:
```json
// document Person: Bob
{
  "id": "47c24738-abe7-4391-9a1a-84dac6da35de",
  "firstname": "Bob",
  "lastname": "Henri",
  "mother": {
    "id": "e415d0e8-919c-4b80-a82e-d0aecc6f4e06",
    "firstname": "Clara",
    "lastname": "Henri"
  }
}

// document Person: Clara
{
  "id": "e415d0e8-919c-4b80-a82e-d0aecc6f4e06",
  "firstname": "Clara",
  "lastname": "Henri",
}
```

So if you wanted to update Henri's mother information you'd have to update in both places. You should start to see how it can drastically impact your performance when you have to do multiple updates in different location. Let's imagine we are not talking about the `mother` relationship but rather the `friends` which can also have sub-properties plus they can be spread over different nodes that might not be on the same continent. The complexity of the update would be exponential. The longer the update the least you are sure to request up-to-date data. That's the reason you gain your read performance because each document includes everything you'd need to know but it comes with a write performance tradeoff.

2) Embed only the `id` of your document inside other linked documents (**slow read performance** and **good write performance**). If we continue with our previous example we would have:
```json
// document Person: Bob
{
  "id": "47c24738-abe7-4391-9a1a-84dac6da35de",
  "firstname": "Bob",
  "lastname": "Henri",
  "mother": {
    "id": "e415d0e8-919c-4b80-a82e-d0aecc6f4e06"
  }
}

// document Person: Clara
{
  "id": "e415d0e8-919c-4b80-a82e-d0aecc6f4e06",
  "firstname": "Clara",
  "lastname": "Henri",
}
```

The update would be much faster because the data would be stored only in one document thus all other linked documents would also be updated if an update is performed on the source document. However it would slow down the read action because you would need to jump between documents to find the information you are looking for. Again in a distributed data source context this could be quite an expensive operation to perform.

In order to make the best design decision you'd need to know that upfront. For example, Facebook uses NoSQL database to store messages and posts because if they lose some information or if they are not all up-to-date that's not really important however your critical information that they sell are stored in relation databases where you can ensure data integrity.

## Best solutions

### Key/value
* Redis
* Oracle NoSQL Database
* Riak-TS

### Document oriented
* MongoDB
* CouchDB
* CouchBase

### Column oriented

* Cassandra

#### Graph oriented

* Neo4J

### Search Engines

* ElasticSearch

## Conclusion

NoSQL will not replace relational databases but rather they solve problem that relation db are not good at.

NoSQL databases should not be used for management software such as ERP or accountability software where data integrity is a must have and not really a tradeoff you can afford.

### Aside: NewSQL

A new brand of database system rose: NewSQL. It combines the best of both worlds: SQL and NoSQL.

Examples:
* MemSQL
* Google Scanner (only available in cloud)
* CockRoach
* PostgreSQL: there are extension to handle JSON data structure (key/value and document).
  * As of 9.3, you can use JSON data types:
    * JSON: stored as string and as such you should not query on their content which would have big performance impact.
    * JSONB: stored as binary and content is searchable through `@>` operator with far less performance impact.
* VoltDB
* MariaDB
