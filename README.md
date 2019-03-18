# JS-Questions - Back-end

## Set-up the database

### Install docker

You can skip this step if you already have Docker installed.

```bash
brew cask install docker
```

If you don't have Homebrew installed (you should), you can download it from [Docker's website](https://www.docker.com/products/docker-desktop).

### Set-up docker

If it's your first time running Docker, open it fron Applications, log-in (sign-up) and follow the steps there.

### Run the development DB with docker:

```bash
docker run -p 5432:5432 -d \
    -e POSTGRES_PASSWORD=suelings \
    -e POSTGRES_USER=suelings \
    -e POSTGRES_DB=js-questions-dev \
    postgres:11
```

This runs a container with PostgreSQL (v11). It passes 3 enviroment variables:
- database name 'js-questions-dev',
- user name 'suelings',
- user password 'suelings'

It also binds the port 5432 of the container with the port 5432 of the local machine.

** For now we don't have any persistent data

### Execute the DB toolbox

```bash
docker exec -it [CONTAINER ID] psql -U suelings js-questions-dev
```

Replace [CONTAINER ID] for the ID of the PostgreSQL container.
To get the containerID you need to run:

```bash
docker ps
```