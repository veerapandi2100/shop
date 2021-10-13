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

setp 1: give the database credentials **config/database.js**

setp 2: give the command ** npm install**

stpe 3: give the command **node index** or nodemon start serve

The Project will running

**API Collections below sample json format**

**POST METHOD**
http://localhost:3000/customer/register

{
	"name":"veer",
	"email":"veerapandi2100@gmail.com",
	"password":"welcome"
}

http://localhost:3000/customer/login

{

	"email":"veerapandi2100@gmail.com",
	"password":"welcome"
}

You get a token after Give **Authorization for Bearer token ** for bellow API

http://localhost:3000/product/create

{
	"productName": "dell",
	"productQuantity": 100,
	"productUniqueCode": "M01",
	"productPrice": 15000,
	"productImage": ""            // Optional param
}

http://localhost:3000/order/create

{
	"productId": 1,
	"productQuantity": 1,
	"address": "no.4, jothi nagar, north street, chennai"
}

**GET METHOD**
http://localhost:3000/list/order_list?sort=0?search=""?limit=2?offset=0

**POST METHOD**
http://localhost:3000/order/update_cancel
{
        "orderId": 1
	   "productId": 1,
	   "productQuantity": 1,
	   "address": "no.4, jothi nagar, north street, chennai",
        "orderStatus": 1                    // 1--->sumbit 2-->cancel
}

GET METHOD

http://localhost:3000/list/ordered_product_count

http://localhost:3000/list/customer_ordered_product_count
