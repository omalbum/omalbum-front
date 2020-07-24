# OMAlbum Frontend

## Testing locally
To start the server, run `./server.py`.

To recompile run `make`

The webpage can be accessed at `https://localhost:8000/`

It is possible to use either a local backend or the testing backend by editing `/src/backend.js`
- `var host = "var host = "http://localhost:8080/";`
- `var host = "https://testing.omalbum.tk/";`

## Build and Run on Testing Server -
1. Tag a commit as a release version with the following rule:
``` vM.m.pRC ``` being M: Major version, m: minor version and p: patch
2. Push tag:
``` git push --tag ```

## Build and Run on Production Server
1. Tag a commit as a release version with the following rule:
``` vM.m.p ``` being M: Major version, m: minor version and p: patch
2. Push tag:
``` git push --tag ```

Example:
1. ``` git tag v1.0.2 ```
2. ``` git push --tag ```
