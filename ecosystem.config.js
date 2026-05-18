module.exports = {
  apps: [{
    name: 'book-meeting-ai',
    script: 'pnpm',
    args: 'start --port 5569',
    wait_ready: true,
    autorestart: true,
    max_restarts: 5,
    env: {
      NODE_OPTIONS: '-r dotenv/config',
    },
  }],
}
