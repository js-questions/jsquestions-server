# JS-Questions - Back-end

## Set-up

### Install docker

You can skip this step if you already have Docker installed.

```bash
brew cask install docker
```

If you don't have Homebrew installed (you should), you can download it from [Docker's website](https://www.docker.com/products/docker-desktop).

### Set-up docker

If it's your first time running Docker, open it from Applications, log-in (sign-up) and follow the steps there.

### .env file

To run the server properly, you will need an .env file with some variables.
Our recommendation is to create it with at least this variables:

```bash
SALT=11
JWTSECRET=chabon
SERVER_PORT=4000
NODE_ENV=development
POSTGRES_NAME=postgres
POSTGRES_PORT=5432
POSTGRES_PASSWORD=suelings
POSTGRES_USER=suelings
POSTGRES_DB=js-questions-dev
```

Feel free to change any value.

### Run the development server with docker:

Run the following command from a terminal open in the root directory of the project (where the docker-compose.yml file is)

```bash
docker-compose up
```

This will create a network with a node.js server and a PostgreSQL database.

*If you'd like to know more about the container have a look at the docker-compose.yml file, it is very well commented.*

### Execute the server's terminal

In case you wanna run any of the available scripts, you will need to access the container's terminal.
To do so, run the following comand in your local computer:

```bash
docker exec -it JSQ-Server /bin/bash
```

### Execute the DB toolbox

If you have PostgreSQL installed in you machine, run the following command:

```bash
psql -h localhost -d js-questions-dev -U suelings
```

Otherwise:

```bash
docker exec -it postgres psql -U suelings js-questions-dev
```



## Available scripts

### db:seed

```bash
npm run db:seed
```

Populate the database with mock data. All mock files are inside of /database/mocks.
