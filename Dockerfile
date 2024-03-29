FROM debian:bullseye as builder

ARG NODE_VERSION=14.19.1

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

#######################################################################

RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production

COPY . .

RUN npm install
FROM debian:bullseye

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH
ENV URL "https://lyz05-tgbot.fly.dev"

CMD [ "npm", "run", "start" ]
