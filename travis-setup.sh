#!/bin/bash
set -x

cp etc/tetra/tetra-test.conf.sample tetra-test.conf

if [ "$TOXENV" = "functional" ]; then
    docker --version
    docker-compose --version

    make docker-build
    make docker-deploy
    sleep 5

    make docker-port || true

    docker-compose -f docker-compose.yml logs
fi
