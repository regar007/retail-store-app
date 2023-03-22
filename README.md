Pricing Feed for Retail Store

Client:

Login Page
Admin Page
Employee Page

Session Handling

UserService impletements UserInterface
RecordsService impletements RecordsInterface


Server:

AuthServer: 4000
AppServer: 8000

Auth Server:
  Login - bcrypt
  JWT - validation & expiry

AppServer
AuthServer - middleware
Routes
  UserController
    -getAllUsers
    -create
    -update
    -delete
  RecordController
    -upload -> Multer - upload large file
    -update -> edited records - price, productName, sku
    -getRecords -> all & search with price, productName, sku
  UserService impletements UserInterface
  RecordService impletements RecordsInterface
  
  typorem
  postgres
  redis - NA









TODO:

// comments
// more refactoring
// more error handling - edge cases
// redis side cache implementation
// elastic search if db grows a lot