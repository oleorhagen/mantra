FROM python:3.10-alpine
ENV PYTHONUNBUFFERED 1
WORKDIR /qaportal
RUN apk add --no-cache postgresql-libs && \
  apk add --no-cache --virtual .build-deps \
  gcc \
  musl-dev \
  postgresql-dev \
  curl
COPY requirements.txt setup.py qaportal.conf ./
RUN pip install -r requirements.txt --no-cache-dir && \
  apk --purge del .build-deps
COPY ./qaportal ./qaportal/
RUN pip install .
CMD gunicorn -t 120 --bind 0.0.0.0:7374 --access-logfile - qaportal.app:application
