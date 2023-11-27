mongo_mongoc
------------

This roles helps to install and configure the mongo configuration servers. 

In addition to this role if combined with other roles like mongo_mongod, mongo_mongos, mongo_shard this can used to 
build a production grade mongodb cluster with multi replication master and shards.
  

Requirements
------------

This role requires ansible 1.4 or higher and platform requirements are listed in the metadata file.

Role Variables
--------------

The variables that can be passed to this role and a brief description about them are as follows:


    mongoc_datadir_prefix: /data/   # The data directory prefix where the configurations should be stored
    mongoc_port: 2800               # The port for mongoc daemon
    mongoc_admin_pass: "foobar"     # The administrator passoword for monogc


Examples
-------

1) Eg: Install mongoc on all nodes in inventory.

    - hosts: all
      roles:
        - role: bennojoy.mongo_mongoc
          mongoc_datadir_prefix: "/data/"
          mongoc_port: 2800
          mongoc_admin_pass: foobar


Dependencies
------------

None

License
-------

BSD

Author Information
------------------

Benno Joy
 

