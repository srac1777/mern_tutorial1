## React Setup

Before starting this section, you will want to review the [Create React App user guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

Let's start setting up the frontend of our application:

* In your terminal, run ```npm install -g create-react-app``` - this will install React globally.
  * Update npm if prompted to do so.
* In the root directory of your project, run ```create-react-app frontend``` - this will install a new React application in a new folder called 'frontend'.
* If you look in the 'frontend' directory, you will notice that it has its own node_modules folder. Make sure to .gitignore this folder.
* When setting up routes for our React app, we don't want to be required to type the full path; we would rather just write something like '/api/users/:id'. To do this we will need to add a key-value pair to the ```package.json``` **in our frontend folder**: ```"proxy": "http://localhost:5000"```
* React runs on its own development server - ```localhost:3000```. While we could write separate commands to run each server, this would quickly become rote. We will use an npm package called 'concurrently' to run both servers at once.
  * Navigate to the root directory of your project
  * Run ```npm install concurrently```
  * Add three new scripts to your ```package.json```:
    * ```"frontend-install": "npm install --prefix frontend"```
      * This will allow users who download your project from GitHub to easily install dependencies from both folders
    * ```"frontend": "npm start --prefix frontend"```
    * ```"dev": "concurrently \"npm run server\" \"npm run frontend\""```
  * Now, if we type ``npm run dev``` in the terminal, both of our servers will start running. You can view the frontend on ```localhost:3000```
* You may find the Chrome [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) useful for your project.
* If you installed the 'ES7 React/Redux/GraphQL/React-Native snippets' extension in VS Code, you can run 'rfc => tab' to create a functional component or 'rcc => tab' to create a class component.
* Create a 'components' directory in your frontend.
* Create a new 'Register' component to display the registration form:

```JavaScript
// frontend/src/components/Register.js

import React, { Component } from 'react'

export default class Register extends Component {
  constructor() {
    super();
    this.state ={
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }

    // We'll come back and change this later - for now, let's just log our new user for testing purposes
    console.log(newUser);
  }

  render() {
    return(
        <div>
        <h3>Register</h3>
          <form onSubmit={this.onSubmit}>
            <label>Name
              <input type="text" name="name" value={this.state.name} onChange={this.onChange} />
            </label>
            <label>Email
              <input type="email" name="email" value={this.state.email} onChange={this.onChange} />
            </label>
            <label>Password
              <input type="password" name="password" value={this.state.password} onChange={this.onChange} />
            </label>
            <label>Confirm Password
              <input type="password" name="password2" value={this.state.password2} onChange={this.onChange} />
            </label>
            <input type="submit" value="submit"/>
          </form>
        </div>
    );
  }
}
```

Make sure to add it to `App.js`:

```JavaScript
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Register from './components/Register';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Register />
      </div>
    );
  }
}

export default App;
```

You should also create a function component named ```Success``` to test your login functionality - just return a success message wrapped in a div. Later on, you can use it to display all events or test the creation of new events.

### React Router

* Stop your server with 'ctrl + c'
* Make sure you are in in your 'frontend' directory
* Run ```npm install react-router-dom```
* Navigate to the root directory of your project and restart your server
* Let's add a few things to 'App.js' (this step should look familiar):

```JavaScript
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Register from './components/Register';
import Success from './components/Success';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component{ Register } />
          <Route exact path="/success" component{ Success } />
        </div>
      </Router>
    );
  }
}

export default App;
```

### Axios

Let's add [axios](https://www.npmjs.com/package/axios) to our frontend so that we can fetch information from our server.

* Navigate to your frontend folder
* Run ```npm install axios```
* Head back to ```Register.js``` and import axios:

```JavaScript
import axios from 'axios';
```

Next, let's modify our ```onSubmit``` function to create a new user:

```JavaScript
onSubmit(e) {
  e.preventDefault();

  const newUser = {
    name: this.state.name,
    email: this.state.email,
    password: this.state.password,
    password2: this.state.password2
  }

  axios.post('/api/users/register', newUser)
    .then(res => console.log(res.data))
    .catch(err => err => this.setState({errors: err.repsonse.data}));
}
```

Try registering a new user with your form - was the user has created in mLab?

You should have enough knowledge of React to render the form errors on the page, so this tutorial will not cover error rendering.

### Redux

At this point you will need to setup Redux. You should by now be very familiar with the Redux cycle, but if necessary you can review [the curriculum from week 7](https://github.com/appacademy/curriculum/blob/master/react/README.md#w7d1). There is also a link to the complete project skeleton at the end of this markdown file.

### User Login

Let's setup our registration form so that our user is logged in when creating a new account. As a reminder, when a user logs in, they are passed a token which they need to access any protected routes. We will save that token to local storage in a similar fashion to the process you adopted during the Rails curriculum.

First, install the ```jwt-decode``` npm package so that we can parse our user's token. Then create the appropriate authorization actions:

```JavaScript
// authActions.js

import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

export const GET_ERRORS = "GET_ERRORS";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
```

In our 'utils' folder, let's create a file called ```setAuthToken.js```:

```JavaScript
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
```

Finally, we need to setup our auth reducer:

```JavaScript
// authReducer.js

import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER } from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
```
