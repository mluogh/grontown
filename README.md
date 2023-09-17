<!-- <video autoplay loop style="width:100%; height: auto; position:absolute; z-index: -1;">
  <source src="public/assets/web/gameplay.mp4" />
</video> -->

## nob hill noir

An open-world murder mystery.

This game serves mostly as a demo and a playground for the development of our
[open-source game agent framework - eastworld](https://github.com/mluogh/eastworld).

### Playing Locally

#### Install backend

If you want to run this locally, you will need to run
[eastworld](https://github.com/mluogh/eastworld).

Abbreviated eastworld install for MacOS:

```

$ brew install redis pdm node

$ git clone git@github.com:mluogh/eastworld.git

$ cd eastworld && pdm install

$ cp example_config.ini config.ini

*** put your OpenAI key or configure local LLM  in config.ini ***

$ redis-server

$ pdm run uvicorn server.main:app --reload
```

See
[eastworld install instructions](https://github.com/mluogh/eastworld#installation)
for other operating systems.

#### Install the game

```
$ git clone git@github.com:mluogh/grontown.git

$ cd grontown

$ npm install

$ npm start
```

Play at http://localhost:3000
