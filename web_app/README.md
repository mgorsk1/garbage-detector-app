Garbage collector Web app
=========================

Building
--------
`make build`

Running
-------
`make run`

Browser client
--------------
`http://localhost:3000`

Pushing messages
----------------
```
POST http://localhost:9000/collections
Content-Type: application/json

{
  "user": "Mariusz",
  "image": "https://test.url",
  "class": "paper"
}
```

Available classes: paper, plastic, glass, rest.
