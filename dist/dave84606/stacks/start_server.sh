#!/bin/bash
cd /var/transfer_travel/api;\
        nohup ./artisan -vv serve --host  $(ip -4 -o addr show dev eth0 |grep -Pom1 '(?<= inet )[0-9.]*') &

