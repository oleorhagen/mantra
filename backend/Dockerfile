FROM python:3.6
WORKDIR /tetra
COPY requirements.txt setup.py tetra.conf ./
RUN pip install -r requirements.txt
COPY . ./tetra/
RUN pip install .
