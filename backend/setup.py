from setuptools import setup

setup_params = dict(
    name="qaportal",
    version="0.0.1",
    url="https://github.com/mendersoftware/mantra",
    packages=["qaportal"],
    install_requires=[
        "celery",
        "falcon",
        "oslo.config",
        "psycopg2",
        "sqlalchemy",
        "xunitparser",
    ],
)

if __name__ == "__main__":
    setup(**setup_params)
