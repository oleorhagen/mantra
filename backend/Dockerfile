FROM python:2.7

WORKDIR /tetra/
ADD setup.py ./
ADD . tetra/
RUN pip install .
RUN pip install gunicorn
ADD tetra.conf ./tetra.conf
