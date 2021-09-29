# take default image of node boron i.e  node 6.x
FROM nginx:alpine

# set /app directory as default working directory
WORKDIR /usr/share/nginx/html

# copy all file from current dir to /app in container
ADD dist .

# expose port 8080
EXPOSE 80
