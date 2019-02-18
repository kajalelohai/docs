Top 10 Javascript Errors :

1: Uncaught TypeError: Cannot read property 'xyz' of undefined
	occurs when we read a property or call a method on an undefined object.
	improper initialisation of state while rendering the UI components.
	
Eg : class Quiz extends Component {
	  componentWillMount() {
	    axios.get('/thedata').then(res => {
	      this.setState({items: res.data});
	    });
	  }
	  render() {
	    return (
	      <ul>
		{this.state.items.map(item =>
		  <li key={item.id}>{item.name}</li>
		)}
	      </ul>
	    );
	  }
	}

In this example 
- this.state begins with the life as undefined
- when we fetch data here the component will render before the data is loaded
	regardless of whether its fetched in constructor,componentWillMount or 
	componentDidMount. And when the Quiz component is first rendered then the
	this.state.items is undefined and will get an error "Uncaught TypeError: Cannot read property ‘map’ of undefined".

Fix of the issue: 
- Initialize state with resonable default value in the constructor.
	class Quiz extends Component {
	  // Added this:
	  constructor(props) {
	    super(props);
	    // Assign state itself, and a default value for items
	    this.state = {
	      items: []
	    };
	  }
	  componentWillMount() {
	    axios.get('/thedata').then(res => {
	      this.setState({items: res.data});
	    });
	  }
	  render() {
	    return (
	      <ul>
		{this.state.items.map(item =>
		  <li key={item.id}>{item.name}</li>
		)}
	      </ul>
	    );
	  }
	}

- "TypeError: 'Undefined' is not an object(evaluating"
	- this error occurs in Safari when we read a property or call a method on an undefined object.
	- this error message is same as mentioned first but safari gives the message differently.

- "TypeError: null is not an object (evaluating"
	- occurs in safari when we read or call a method on a "null" object

In Javascript null is when the value is blank and undefined is a variable that has not been assigned.
This error might occur if we try using DOM element in javascript before the element is loaded.
	This is because the DOM API returns null for object references that are blank.

- "(Unknown):Script error"
	- occurs when an uncaught Javascript error crosses domain boundaries in violation of the cross-origin policy.
	- hosting javascript code on CDN any uncaught errors(errors that bubble up to the window.onerror handler,instead of being caught in try-catch)
		will get reortedly as simply "Script Error" instead of containing useful info.
	- This is for browser security measure intended to prevent passing data across domains that otherwise wouldn't be allowed to communicate.
	so, to get the real error messages we need to do the following:

	1: Send the Access-Control-Allow-Origin header : 
			- setting "Access-Control-Allow-Domain" to "*" means the resource can be accessed properly from any domain.
			- we ca replace the "*" with the domain name as "www.example.com".
		Some of the the examples to set this header on various environments are:
	- APACHE : we need to create .htaccess file in the folders from where our javascript files are served.
			in the htaccess file we will write the following content:
			- Header add Access-Control-Allow-Origin "*"
	
	-Nginx : Add the "add_header" directive to the location block that serves our javascript files: 
			- location ~ ^/assets/ {
				add_header Access-Control-Allow-Origin *;
				}

	-HAProxy : Add the following to the asset backend where javascript files are served from:
			- rspadd Access-Control-Allow-Origin:\ *

	2: Set crossorigin = "anonymous" on the script tag :
		- In our HTML source forEach script we have set the Access-Control-Allow-Origin header for,set crossorigin="anonymous" on the SCRIPT tag.
		- we need to add the crossorigin only if the header is being sent for the script file on the SCRIPT tag.
		- Exception: In firefox: crossorigin attribute is present but Access-Control-Allow-Origin header is not so the script won't be executed.

- TypeError : Object doesn't support property
	- this error occurs in IE when we call an undefined method.
	- equivalent to error "TypeError: 'undefined' is not a function in chrome".
	- IE is unable to bind methods within the currrent namespace to "this" keyword.
	- Eg : we have a method isAwesome inside the JS namespace "Rollbar" then we can invoke the isAwesome method with the following syntax:
		- this.isAwesome(), but except IE browsers like Chrome,Firefox and Opera accept this.isAwesome syntax.
	- the safest bet while using JS Namespacing is to always prefix the actual namespace as : Rollbar.isAwesome();

- TypeError : 'undefined' is not a function
	- its an error in chrome occurs when we call an undefined function.
	Example :
	function clearBoard(){
	alert("Cleared");
	}
	
	document.addEventListener("click",function(){
	this.clearBoard(); // "this" is for ?
	})
		
	- when we execute the above code and click on page the error will be "Uncaught TypeError : this.clearBoard is not a function"
	- Reason is that the anonymous function being executed is in context of the document but the "clearBoard" is defined on the window.
	- A traditional old browser compliant solution : save your reference to 'this' in a variable that can be inherited by the closure as:
	 var self = this;
	 document.addEventListener("click", function(){
	 self.clearBoard();
	 })
