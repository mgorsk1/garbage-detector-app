Garbage collector Web app
=========================

Building
--------
`docker build -t garbage-collector-web-app`

Running
-------
`docker run -p 3000:3000 -p 9000:9000 garbage-collector-web-app -n garbage-collector-web-app`

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