mongo_mongod
------------

This roles helps to install and configure the mongod daemon. This role can be used to install a standalone mongod
daemon or a replicated mongod set.

In addition to that if combined with other roles like mongo_mongoc, mongo_mongos, mongo_shard this can used to 
build a production grade mongodb cluster with multi replication master and shards.
  

Requirements
------------

This role requires ansible 1.4 or higher and platform requirements are listed in the metadata file.

Role Variables
--------------

The variables that can be passed to this role and a brief description about them are as follows:

    mongod_smallfiles: "true"           # Enable small files for mongodb.
    mongod_datadir_prefix: /data/       # The directory prefix where the data would be stored.
    mongod_port: 2700                   # The port where mongod process shoudl listen.
    mongod_replication: false           # Enable replication of the mongod data
    mongod_repl_servers: []             # The hostname's of the server where the data should be replicated.
    mongod_repl_master: "localhost"     # The host which should act as the repl master during configuration.
    mongod_replset_name: rs0            # The name of the replica set.


Examples
--------

1) Eg: Install a standalone mongod instance without replication.


    - hosts: all
      roles:
        - role: bennojoy.mongo_mongod
          mongod_datadir_prefix: "/data/"
          mongod_replication: false
          mongod_port: 2701

2) Eg: Install mongodb with data replicated across two other hosts.


    - hosts: all
      roles:
       - role: bennojoy.mongo_mongod
         mongod_datadir_prefix: "/data/"
         mongod_replication: true
         mongod_port: 2701
         mongod_repl_servers: ['mongo1', 'mongo2', 'mongo3' ]
         mongod_repl_master: mongo1
         mongod_replset_name: rs0



Dependencies
------------

None

License
-------

BSD

Author Information
------------------

Benno Joy
 

