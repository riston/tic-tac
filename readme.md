# Tic-Tac-Toe

This is REST implementation for the famous game tic-tac-toe.

## Authentication

First make sure you have created the user with ```POST /users``` call. Now you the
values of ```_id``` and ```token```, which are joined into one and then encoded with base64.
All the ___authed___ requests require special header called ```Authorization``` where the secret
base64 is used.

## REST API

Here is the list of all the routes which are included in the current server.

*** POST /users *** (no auth) - create a new user, the ```_id``` and ```token``` are used for
the authentication.
```
{
    token: "56a2c062c45fa8867cbac3790b84315d45941e79d35f26bbe56c27d1df3adc70"
    email: "Random"
    created: "2014-08-05T20:33:59.280Z"
    modified: "2014-08-05T20:33:59.280Z"
    _id: "53e13fb747bad1b1156357cc"
}
```

***  POST /games *** (authed) - create a new game, the user id is taken from the auth header.
The returned object contains the game information and also the first turn, ```status``` currently
duplicates the value who's turn it is. The ```_id``` is reference to the game, which is used later
to make moves.
```
{
    "turns": [
        262144
    ],
    "status": 1,
    "player": "53dca56c5e64b50b5f8e9fe0",
    "created": "2014-08-05T20:37:10.736Z",
    "modified": "2014-08-05T20:37:10.736Z",
    "_id": "53e140766592d6a216303844"
}
```

*** POST /games/53e140766592d6a216303844/move (authed) - Make move on the board and then
also the AI makes the turn and returns the results.
```
{
    "_id": "53e140766592d6a216303844",
    "turns": [
        262144,
        2,
        270338
    ],
    "status": 1,
    "player": "53dca56c5e64b50b5f8e9fe0",
    "created": "2014-08-05T20:37:10.736Z",
    "modified": "2014-08-05T20:41:05.952Z"
}
```

*** GET /games/53e140766592d6a216303844 (authed) - you get the information about the current
game and also see the human readable game boards.
```
{
    "_id": "53e140766592d6a216303844",
    "turns": [
        262144,
        2,
        270338
    ],
    "status": 1,
    "player": "53dca56c5e64b50b5f8e9fe0",
    "created": "2014-08-05T20:37:10.736Z",
    "modified": "2014-08-05T20:41:05.952Z",
    "boards": [
        [
            "___",
            "___",
            "___"
        ],
        [
            "_X_",
            "___",
            "___"
        ],
        [
            "_X_",
            "_O_",
            "___"
        ]
    ]
}
```

## The turn field protocol

Here is small guide of the turn bits are used.

  - The bit position 18 stores the current turn is it 0 or 1.

  - The bit positions from 9 to 17 belongs to ___AI___.

  - The bit positions from 0 to 8 belongs to ___user___.
```
TR <--------AI-------------><-------user----->
18|17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1|0
```

## TODO

These are the current tasks that has to be finished

- Fix the game logic, currently there seems to be problems with detecting the user
winning. [X]

- Separate game logic error instances, which should make the HTTP request errors more readable. [-]

- Host in [Heroku](heroku.com) demo.

## Install

Make sure you have Node.js and MongoDB.

```npm install```

Change the database credentials in ```/config/default.js```.

To run the server, if all went well you should see no errors and the server should
be started.

```node index.js```

## License

MIT
