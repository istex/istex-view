FROM nginx:1.11.4

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl

# nodejs installation used for build tools
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y build-essential nodejs

# install build tools
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install

# add source code (after npm install for docker build optimization reason)
COPY ./src/ /app/src/
COPY ./public/ /app/public/
# build the react app
RUN npm run build

# ngnix config
COPY ./ngnix/prod.conf /etc/nginx/conf.d/default.conf

# default istex-view config
RUN echo '{ \
  "istexApiProtocol": "https", \
  "istexApiDomain": "api.istex.fr", \
  "istexApiUrl": "https://api.istex.fr", \
  "openUrlFTRedirectTo": "api-with-ezproxy-auth" \
}' > /app/build/config.json

# ezmasterization of istex-view
# see https://github.com/Inist-CNRS/ezmaster
RUN echo '{ \
  "httpPort": 80, \
  "configPath": "/app/build/config.json" \
}' > /etc/ezmaster.json
