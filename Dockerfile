FROM python:2.7

WORKDIR /tetra/
ADD setup.py tetra.conf tetra-test.conf ./
ADD tetra tetra/
RUN pip install .
RUN pip install gunicorn falcon_cors
RUN adduser --disabled-password --gecos '' tetra-worker
