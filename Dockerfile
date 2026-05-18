FROM node:22

WORKDIR /app

ARG GITHUB_ACCESS_TOKEN

COPY package*.json .
COPY pnpm-lock.yaml .
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN echo NEXT_PUBLIC_SITE_URL=https://book.meeting.ai >> .env

RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build

ENTRYPOINT ["/bin/bash"]
CMD ["/app/entrypoint.sh"]

EXPOSE 80
