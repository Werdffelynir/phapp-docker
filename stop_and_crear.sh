#!/usr/bin/env bash

docker stop phapp_c1 && docker rm phapp_c1 && docker rmi phapp:1.0.0
