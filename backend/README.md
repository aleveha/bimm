# Backend challenge 💪

## Assignments:

A new client wants us to develop the services, and create the infrastructure for their new project. The client wants
their services to be fast, maintainable, and scalable. The client wants to create a service that can parse XML data and
transform it to JSON format.

- Service must parse XML
    - Parse all the Makes from: https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML
    - Get all the Vehicle Types per
      Make: https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/440?format=xml
- Service must produce JSON
    - Combine all the of XML information into a single JSON object
    - Produce an array of objects will the all of the information from the XML endpoints
    - The JSON must look like the following: https://gist.github.com/mbaigbimm/d340e7800d17737482e71c9ad1856f68
- Service must have a single endpoint to get all the data
- Service must be Dockerized
- Service must save this into a document based datastore
- Service must follow NodeJS best practices for project structure, and code

## Nice to have:

- Service may schedule a job to get XML information on a regular basis
- Service can expose GraphQL endpoint for GQL queries
- Service can contain tests for each data transformation
