FROM node:14.16.0-stretch
MAINTAINER Neal
RUN mkdir /opt/dc_bank
COPY . /opt/dc_bank
WORKDIR /opt/dc_bank

#RUN npm install -g node-gyp

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 7001
CMD ["npm","start"]
