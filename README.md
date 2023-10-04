# Gateway Management Application

This is a sample application for managing gateways. Gateways are master devices that control multiple peripheral devices. This application provides a REST API to manage gateways and their associated devices.

## Setup

Ensure that you have Node.js and MongoDB installed on your system before proceeding.

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/dev-gateways.git
   cd dev-gateways

2. Clone this repository:

`npm install`

3. Configure environment variables:

`Create a .env file in the project's root directory and set the following environment variable:

``MONGO_URI=mongodb://localhost:27017/gateways
Make sure the MongoDB connection URL is correct and available.``


Start the application:

`npm start`


The application will be available at http://localhost:3000 by default.
You can change the port by editing the` bin/www` file if necessary.

Usage
You can use Postman or any similar tool to test the API endpoints. The Postman collection with example requests is available here.

**API Endpoints**

` GET /gateways:` Get all gateways.

 ` POST /gateways:` Create a new gateway.

`GET /gateways/:serialNumber:` Get a gateway by its serial number.

`PUT /gateways/:serialNumber:` Update a gateway by its serial number.  

`DELETE /gateways/:serialNumber:` Delete a gateway by its serial number.

`POST /gateways/:serialNumber/devices:` Add a new device to a gateway.

`PUT /gateways/:serialNumber/devices/:uid:` Update a device in a gateway.

`DELETE /gateways/:serialNumber/devices/:uid:` Delete a device from a gateway.


**Examples**

Here are some examples of how to use the API with Postman:

Get all gateways
Method: GET
URL: http://localhost:3000/gateways
Create a new gateway
Method: POST

URL: http://localhost:3000/gateways

Request Body (JSON):

``
{
"serialNumber": "GT123456",
"name": "Gateway 1",
"ipv4": "192.168.1.1"
}``
