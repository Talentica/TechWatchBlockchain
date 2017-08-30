FROM hemant24/cloud9
MAINTAINER hemant.sachdeva04@gmail.com 


RUN apt-get update \
        && apt-get upgrade -q -y \
        && apt-get dist-upgrade -q -y \
        && apt-get install -q -y wget curl \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/* \
        && cd /tmp \
        && wget http://www.multichain.com/download/multichain-1.0-release.tar.gz \
        && tar -xvzf multichain-1.0-release.tar.gz \
        && cd multichain-1.0-release \
        && mv multichaind multichain-cli multichain-util /usr/local/bin \
        && cd /tmp \
        && rm -Rf multichain*

