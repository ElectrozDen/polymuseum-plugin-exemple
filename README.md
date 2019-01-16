# polymuseum-plugin-exemple

## How to create

Clone the project above to begin and run `npm install`.

Currently, you can only modify four files to create your plugin. Any files you have added will be ignored. The plugins's system is under developpement and can't manage other files. It will come soon ! :)

- index_admin.html

It's the html page for the administration.

- index_admin.js

It's the script that index_admin.html will use.

- index_visitor.html

It's the html page for visitors.

- index_visitor.js

It's the script that index_visitor.html will use.

Don't inject scripts in the html pages, it will be automatically made by our system.

There are already few dependencies in the project that you can use (React, Babel,..)

Templates are already configured with react.

Our system works around activities. They are the main exchange between the system and your plugin.

The administration must can create activities from your plugin and visitors must play theses activities from your plugin.

Here the interface of an activity

```
name: string
description: string
keywords: Array[string] // categories
location: string
participants: Array[string]
max_participants: integer
public: boolean
guide: string
schedule: string
points: integer
items: Json Object // A small database for the activity if you need to store more informations.
difficulty: integer //1,2,3
```

A SDK is provided in the project to manage activities with the system.

## How to build

Juste run `npm run build`

The files builds are available in the folder dist.

You need to create a json file nommed `plugin.json` to give a name and a description for your plugin.

Zip the builded files and your json file together.

Your plugin is ready !
