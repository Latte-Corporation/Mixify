# Mixify

This web app is a participative music app where the crowd can submit
songs to the DJ in a party. It is open source and open to contributions.
You will need to deploy the app by yourself, we do not provide hosting.

The backend is available here: https://github.com/Latte-Corporation/Mixify-api

## How to deploy it

### The easy way
You will need:
- git 
- nodejs
- pnpm

```bash
git clone git@github.com:Latte-Corporation/Mixify.git
cd mixify
pnpm install
pnpm start
```

### The cloud way
A helm chart is available in the `helm` folder. You can deploy it with:
```bash
helm install mixify ./helm
```

### With docker
You can also build a docker image with:
```bash
docker build -t mixify .
docker run -p 3000:3000 mixify
```

## How to contribute
You can contribute by submitting a pull request. We will review it and
merge it if it fits the project. You can also open an issue if you have
a feature request or a bug to report.

Contact: contact@lattecorp.dev


