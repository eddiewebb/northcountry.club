#!/bin/bash

cd /home/safeuser/apps/northcountry.club
git pull --rebase
pm2 restart gameclub