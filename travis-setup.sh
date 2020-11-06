#!/bin/bash
set -x

cp etc/tetra/tetra.conf.sample tetra.conf
cp etc/tetra/tetra-test.conf.sample tetra-test.conf

if [ "$TOXENV" = "functional" ]; then
    docker --version
    docker-compose --version

    make docker-build

    make docker-db docker-queue
    sleep 5
    make docker-dev
    sleep 5

    make docker-port || true

    docker-compose -f docker-compose.yml -f development.yml logs
fi
