# JS-Questions back-end


## Table of contents

- [Set-up](#Set-up)
- [Extras](#Extras)
- [Tech Stack](#tech-stack)
- [Developers team](#developers-team)



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

Feel free to change any value as you see fit.

### Run the development server with docker:

Run the following command from a terminal open in the root directory of the project (where the docker-compose.yml file is)

```bash
docker-compose up
```

This will create a network with a node.js server and a PostgreSQL database.
**We higly recommend populating the database with the provided mock data, following this steps**
[Execute the server's terminal](#Execute-the-server's-terminal)
[db:seed](#db:seed)


*If you'd like to know more about the container have a look at the docker-compose.yml file, it is very well commented.*



## Extras

### Execute the server's terminal

In case you want to access the container's terminal, run the following command in your local computer:

```bash
docker exec -it JSQ-Server /bin/bash
```

### Execute the DB toolbox

If you have PostgreSQL installed in you machine, run the following command:

```bash
psql -h localhost -d js-questions-dev -U suelings
```

If you DO NOT have PostgreSQL installed in you machine:

```bash
docker exec -it postgres psql -U suelings js-questions-dev
```

### Clean the database

Access the index.js file in the root directory and make note of the two commented out lines at the bottom file.
If you uncomment them and while running the server, it will drop all the tables and create them back again.

This will leave you with a database so clean that you can eat out of it.
**Make sure to recomment them back out after it is cleaned**

### db:seed

This command is executed as one of the steps of docker's set-up process.

If you reset the database and would like some mock data back in it, this is your command.
Run it from the server's terminal (how-to in the first point of the Extras section in this file)

```bash
npm run db:seed
```

Populate the database with mock data. All mock files are inside of /database/mocks.


## Tech Stack

- [Node\.js](https://nodejs.org/en/) + [Koa\.js](https://koajs.com/)
- [Socket\.io](https://socket.io/)
- [PostgreSQL](https://www.postgresql.org/) + [Sequelize\.js](http://docs.sequelizejs.com/)
- [Docker](https://www.docker.com/)



## Development team

Amber Williams - [GitHub](https://github.com/Amber-Williams) - [LinkedIn](https://www.linkedin.com/in/amber-williams-dev/)

Sue Li - [GitHub](https://github.com/zsli16) - [LinkedIn](https://www.linkedin.com/in/sueli88/)

Natalia Ortiz - [GitHub](https://github.com/nataliaero) - [LinkedIn](https://www.linkedin.com/in/natalia-ortiz-gomez/)

Julián González - [GitHub](https://github.com/1971S) - [LinkedIn](https://www.linkedin.com/in/jgpicatoste/)

Rodrigo Alcala - [GitHub]( https://github.com/rodalcala) - [LinkedIn](https://www.linkedin.com/in/rodrigoalcala/)
