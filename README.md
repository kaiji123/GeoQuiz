# Team Project '22

## Links

- [Kanban Board](https://trello.com/invite/)
- [Meeting Diary](https://bham-my.sharepoint.com/personal/lrw080_student_bham_ac_uk/_layouts/15/doc.aspx?sourcedoc={78600b20-63de-4488-933a-1986afef655b}&action=edit)
- [Technology stack selection, justification and GDPR privacy policy](https://bham-my.sharepoint.com/personal/lrw080_student_bham_ac_uk/_layouts/15/guestaccess.aspx?share=EUFyEMWo7mxHiENxH8I2QV4Bn71bFM9QDCSdQsxNo7TEYA&email=LRW080%40student.bham.ac.uk&e=jgWO1g)
- [Team organisation and contribution report](https://bham-my.sharepoint.com/personal/lrw080_student_bham_ac_uk/_layouts/15/guestaccess.aspx?guestaccesstoken=IkcuglyMxhrYZjfruIgRQbP%2FdVdVWHK9b%2BC3o%2B7Mue0%3D&docid=2_1ab22f11bd482451fb4a95ec3d079496d&rev=1&e=Lwor02)

## Replicating pipeline

##### Introduction

Our project is built in nodejs, which serves as a main core for our application. Therefore, on your machine, you need to install

* git (>= 2.31.1)
* nodejs  (6.14.12)

To fork our project , please use [https://git-teaching.cs.bham.ac.uk/mod-team-project-2021/team22-21.git]() to clone it. Subsequently, you must enable CI in Gitlab for the repository.

##### Running on local machine

To run our repository, you have to install all the dependencies that our project uses. This can be achieved using a simple

```
npm install
```

command on our repo. Once you do that, you start the server by

```
npm start
```

command, and then you can access the application through http://localhost:3000/ endpoint. Also you need to load your own enviroment variables to run the application without problems. Be careful, don't commit it to the repository as this would be a vulnerability, and add the .env file to .gitignore.

##### New server

Create a new Ubuntu server on DigitalOcean with following specs .

```bash
 1 GB RAM / 1vCPU / 10 GB Disk / Primary only / LON1 - MySQL 8
```

After creating the new server you need to ssh to your server using local machine. Then, install gitlab-runner.

```bash
apt install -y gitlab-runner
```

Regiter your Gitlab runner token like below

```bash
gitlab-runner register --url https://git.cs.bham.ac.uk/ --registration-token $REGISTRATION_TOKEN
```

##### Database cluster

Once created a new server, add a database cluster on DigitalOcean with following specs

```bash
1 GB / 10 GB Disk / LON1 - MySQL 8
```

You would need to access this database cluster later on.

##### Pipeline

Our .gitlab-ci.yaml looks like below

```yaml
image : node:alpine

stages :
  - build
  - test
  - deploy
  - e2e
cache:
  key: $CI_COMMIT_REF_SLUG
  paths:
    - .npm/

.prep :
  before_script:
    - apk add --no-cache python3 py3-pip
    - apk add pkgconfig
    - apk add --no-cache pixman-dev

    - apk add --no-cache build-base 
    - apk add --no-cache g++ 
    - apk add --no-cache cairo-dev 
    - apk add --no-cache jpeg-dev 
    - apk add --no-cache pango-dev 
    - apk add --no-cache giflib-dev

build :

  stage: build 
  extends: 
    - .prep
  script:
    - rm -rf node_modules package-lock.json
    - npm install



  artifacts:
    expire_in: 1h
    paths:
      - node_modules/


test:
  stage: test
  extends: 
    - .prep
  script: 
    - npm test
  cache:
    key: $NODE_MODULES
    paths: 
      - .npm/


deploy:
  stage : deploy
  timeout: 1h
  before_script :
    - 'command -v ssh-agent >/dev/null || ( apk add --update openssh )'
    - eval $(ssh-agent -s)
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa

    - ssh-add
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS ufw allow 3000
    - 'apk add --upgrade gettext'
    - 'apk add --upgrade nodejs'
    - envsubst < deploy/env.template > $CI_PROJECT_DIR/.env
    - envsubst < deploy/apache.template > $CI_PROJECT_DIR/apache
    - scp $CI_PROJECT_DIR/apache root@$SERVER_IPADDRESS:/etc/apache2/sites-available/
  script :
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS 'apt install nodejs;'
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS "test -d /etc/apache2 || (apt update && apt install -y apache2 && systemctl restart apache2 && ufw allow 'Apache Full')"
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS "test -d /etc/letsencrypt/live/$DOMAIN || ( apt update && apt install -y python3-certbot-apache && certbot --apache -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL && rm -f /etc/apache2/sites-enabled/* && ln -s /etc/apache2/sites-available/$CI_PROJECT_DIR /etc/apache2/sites-enabled/$CI_PROJECT_DIR && systemctl restart apache2 && ufw allow 'Apache Full' && chmod +x+r -R /root/ )"
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS 'test -d /home/project || mkdir /home/project;'
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS 'cd /home/project; rm -r team22-21;'
    - scp -r /builds/mod-team-project-2021/team22-21 root@$SERVER_IPADDRESS:/home/project
    - ssh -o StrictHostKeyChecking=no root@$SERVER_IPADDRESS 'pm2 delete all;cd /home/project/team22-21;rm -r node_modules;npm install;pm2 start npm -- start;docker rm $(docker ps -a -q) || true;'



e2e:
  stage: e2e
  services:
    - selenium/standalone-chrome
  variables:
    SELENIUM_HOST: selenium__standalone-chrome
  script:
    - npm run selenium "/e2e/main.js"
    - npm run selenium "/e2e/title.js"
    - npm run selenium "/e2e/homepage.js"
  artifacts:
    when: always
    paths:
      - tests_output/
    expire_in: 1 hour

```

Enable nodejs (for build) and selenium/standalone-chrome (for automated testing) images on docker.

##### CI variables

You need to create following CI variables on Gitlab.

* SERVER_IPADDRESS - the IP address of your server
* CLIENT_ID - the client id of google api
* GEOCODE_KEY - google maps geocoding api key
* JWT_KEY - jwt key for authentication
* HOSTNAME - hostname of your database cluster in which you created in DigitalOcean
* DBPORT - port number of your database cluster (default is 25060)
* DBUSER - username of your database (default is doadmin)
* DBPASSWORD - password of your database
* DBDATABASE - database of your cluster (default is defaultdb)
* EMAIL - your email
* SSH_PRIVATE_KEY - ssh private key from server machine
* DOMAIN - domain of your web application

After following above instructions, you are good to go. Make some changes on our app !
