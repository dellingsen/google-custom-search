# URL Selector Challenge

## Installation
Prerequisite: Install MongoDB NoSQL server and run
DB Server should be running on: localhost:27017

1. clone project from repo
2. Install server npm modules: `npm install`
3. Install client npm modules: `cd public && npm install`
4. Run standalone client: `cd public && npm start`
5. Add test users to application database - from root directory: `npm run initdata` 
6. Start up the server - from root directory: `npm start`
7. Login to application at: http://localhost:8080/login (admin, password)
8. Navigate to `Add Company` (http://localhost:8080/addcompany) to submit company names for search
9. Run REST API tests - from root directory: `mocha`