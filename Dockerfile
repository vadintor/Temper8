# base-image for node on any machine using a template variable,
# see more about dockerfile templates here: http://docs.resin.io/deployment/docker-templates/
# and about resin base images here: http://docs.resin.io/runtime/resin-base-images/
# Note the node:slim image doesn't have node-gyp
FROM balenalib/%%BALENA_MACHINE_NAME%%-node:10-stretch-run

# use apt-get if you need to install dependencies,
# for instance if you need ALSA sound utils, just uncomment the lines below.

#RUN apt-get update && apt-get install -yq \
#    alsa-utils libasound2-dev && \
#    apt-get clean && rm -rf /var/lib/apt/lists/*

#RUN apt-get update && apt-get install -yq \
#    python2.7 make gcc && \
#    rm -rf /var/lib/apt/lists/* && ln -s /usr/bin/python2.7 /usr/bin/python

RUN apt-get update && apt-get install -yq \
    libudev-dev \
    libusb-1.0-0-dev \
    libsecret-1-dev \
    && rm -rf /var/lib/apt/lists/*

# Defines our working directory in container
WORKDIR /usr/src/app

# Copies the package.json first for better cache on later pushes
COPY package.json package.json

COPY README.md README.md 
COPY CHANGELOG.md CHANGELOG.md


# This install npm dependencies on the resin.io build server,
# making sure to clean up the artifacts it creates in order to reduce the image size.
RUN npm install --production node-hid --build-from-source --unsafe-perm && \
    npm cache clean && rm -rf /tmp/*
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*

# This will copy all files in our root to the working  directory in the container
COPY ./build ./build

# Enable systemd init system in container
ENV INITSYSTEM on

# server.js will run when container starts up on the device
CMD ["npm", "start"]
