#!/bin/bash
git pull origin master
npm install
pm2 reload 0
# EOF