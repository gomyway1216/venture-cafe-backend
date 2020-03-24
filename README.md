# Venture Cafe Drink System Backend Code

## About this Project
This is a project I am building for Venture Cafe. 
This application is expected to be used at multiple locations in the world. 
This application consists of 3 parts. 

Backend: 
this repository

Frontend for user signup:
https://github.com/gomyway1216/venture-cafe-tokyo-signup

Frontend for dashboard at the bar:
https://github.com/gomyway1216/venture-cafe-tokyo-signup

Backend is responsible for interacting with MongoDB and FrontEnd to handle GraphQL API calls. All the CRUD operations are implemented. 

Frontend for user signup is responsible for creating new users. A new user goes to a link and fills in name and email. Then, the backend would produce a QR code, which is displayed in signup. Then, the user would save it on the phone.

Frontend for dashboard at the bar is in charge of displaying the drink information and handles interaction between users and backend CRUD APIs. First, an admin user has to log in with the email and password. The backend would return token and login to the dashboard, which is valid for a limited time. (This would be updated to keep the token valid while opening the application.)

Then, the admin would select the event. If the event does not exist, he/she will create one. The event likely needs to be built at the beginning.

After selecting an event, it redirects to the dashboard where the attendee list is displayed with the count of drinks on the left side and the available drink list for the day on the right side. (The UI might be updated.)

The admin would scan the QR code that the user has on their phone. If it is the first time, the user would be checked into the Attendee list. If not, it would just find from the table. 

<img width="2560" alt="Screen Shot 2020-03-24 at 2 19 28 PM" src="https://user-images.githubusercontent.com/32227575/77468011-f5103680-6dda-11ea-9f89-301667ed42c7.png">

The Admin can select/modify the drink for the event. Admin is also able to edit the drink dictionary and types.

<img width="2560" alt="Screen Shot 2020-03-24 at 2 18 03 PM" src="https://user-images.githubusercontent.com/32227575/77468093-1b35d680-6ddb-11ea-8ca4-3178eb1b66d3.png">

## Getting Started
To run this project, ccess keys to MongoDB is required. Currently the keys are hidden because it is using confidential data.
This app runs on Heroku.

### Prerequisites
Node, Heroku Account, Heroku console, Access Keys to MongoDB

### Installing
This would install all the dependencies
```
$ npm install
```

### Running Locally
```
$ npm start
```
This app runs on [localhost:5000](http://localhost:5000/).

### Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Languages and libraries
JavaScript, Node.js, express.js, GraphQL, Mongoose, MongoDB

## Logistics
### Main Database Schema
##### It explains the main schema stored in the database. Schemas for types are not explained here. 
"Event": The event that the Dashboard is used. 
<br />
<br />
"Registered Drink": The drink that registered to the database that can be used for any of the events. The admins can add new drinks, but it is not recommended to delete ones, because some locations need to use it. 
<br />
<br />
"Available Drink": The drinks available for a specific event. So, before the event starts, the organizer would pick the drinks from the Registered Drink list. 
<br />
<br />
"User": User includes everyone who has registered, including admin. Admin would have an admin flag and can access Dashboard.
<br />
<br />
"Attendee": Attendee is a User who attends to a specific event. So the Attendee is associated with an event, which means there could be multiple Attendees with the same User account if the person is attending the different events concurrently. Once the event is done, they are removed to prevent saving unnecessary personal information. 
<br />
<br />
"DrinkHistroy": This saves the history of drink consumed. Each row is associated with event and date, so it is easier to query specific types of data such as "drinks consumed around 7 PM from the event happening in Los Angels." 
<br />

## Task
Working on renaming and restructuring.
