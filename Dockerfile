FROM python:2.7

WORKDIR /tetra/
ADD setup.py ./
ADD tetra tetra/
RUN pip install .
RUN pip install gunicorn
RUN adduser --disabled-password --gecos '' tetra-worker
ADD etc/tetra/tetra.conf.sample ./tetra.conf
