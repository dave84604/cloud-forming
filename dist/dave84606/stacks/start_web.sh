#!/bin/bash
cd /var/transfer_travel/web;\
        nohup ng serve --disable-host-check --host $(ip -4 -o addr show dev eth0 |grep -Pom1 '(?<= inet )[0-9.]*')  &
