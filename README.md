# shop

About The Project

Using JWT, Bcrypt, Sequalize, Winston (log), nodemon, joi packages.

**Simple Api to create a purchase details portal based on the customer.**

API Coverted like

1. Create an API to upload the product information into the database. All products should be created via upload only.

2. If product info already exist in the database , should update it else insert the product

3. Api for Basic login and registration setup

4. JWT token should be properly handled for all the API.

4. Create an API to create order, update order, cancel order.

5. Create an api to list ordered products based on the customer. (include search and sort functionality)

6. Api to list ordered product count based on date.

7. Api to list customers based on the number of products purchased.

setp 1: give the database credentials config/database.js

setp 2: give the command  npm install

stpe 3: give the command node index or nodemon start serve

The Project will running

the sample register json format
http://localhost:3000/customer/register

{    

     "name": "veeR",
     "email": "veerapandi2100@gmail.com",
     "password": "XC666"
     
}

the sample login json format
http://localhost:3000/customer/login

{   

     "email": "veerapandi2100@gmail.com",
     "password": "XC666"
     
}

http://localhost:3000/order/create
http://localhost:3000/order/update_cancel
http://localhost:3000/product/create
http://localhost:3000/list/order_list



