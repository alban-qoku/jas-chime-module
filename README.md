# jas-web
Web front-end Justified Assessment Solution platform.

## local setup
1. Install the dependencis

    ```$ yarn install```
2. Run

    ```$ yarn run start```
3. Build

    ```$ yarn run build```

## Docker setup
1. Build

    ```$ docker build . -t jas-web```

2. Run

    ```$ docker run -d -p 8080:80 jas-web```

## CI scenario
  The used CI tool is Gitlab-ci, to connect to it run `$ git remote add gitlab https://gitlab.com/enkhalifapro/jas-web.git `

  CI consists of two main steps:

  1. Build:

      Build docker container and push it to Docker registery.

  2. Deploy:

      Pull the built container into destination server and run it.

Note: Push any branch to gitlab `$ git push gitlab <BranchName>` will trigger build, while pushing to development `$ git push gitlab development` branch will trigger build and deploy.
