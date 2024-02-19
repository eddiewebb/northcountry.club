#!/bin/bash

cd /home/safeuser/apps/northcountry.club
git pull --rebase
npm install
pm2 restart gameclub