# Pricing Feed Retail Store App
## Description: _An Client Server app for retail store pricing feed._

## Tech Stack:
**Client** : React, Typescript, Redux, MaterialUI, Axios

**Backend**: Node, Typescript, Express, Postgres, TypeORM, JWT, Multer

## Pages:
**App Client**:
* Login Page
* Admin Page
* Employee Page

**App Server:**
* Routes
    - UserController
        - getAllUsers
        - create
        - update
        - delete
    - RecordController
        - upload -> Multer - upload large file
        - update -> edited records - price, productName, sku
        - getRecords -> all & search with price, productName, sku
        - 
**Auth Server:**
* Login - bcrypt
* JWT - validation & expiry

## Features
* Session Handling
* User Login
* Admin: 
    - CRUD users for store access management
    - Fetch list of users in app
* Employee:
    - Uploads csv file containing pricing feed
    - Fetch list of records for the same store
    - Edits fields in table (productName, price, sku)
    - Search records with combination of fields

## Installation
Client:
```sh
cd client
npm i
npm start
```

App Server:
```sh
cd server
npm i
npm run start:dev
```
Auth Server:
```sh
cd server
npm i
npm run start:auth
```

## Ports
ClientServer: 3000

AuthServer: 4000

AppServer: 8000


## Links:
* [System Design Diagram, Assumptions & Questions]
* [App Screenshots]

TODO:
1. comments
2. more refactoring
3. more error handling - edge cases
4. redis side cache implementation
5. elastic search if db grows a lot
6. tests


[System Design Diagram, Assumptions & Questions]: <https://github.com/regar007/retail-store-app/blob/dev/ContextDiagram.pdf>
[App Screenshots]: <https://github.com/regar007/retail-store-app/tree/dev/app-screenshots>
