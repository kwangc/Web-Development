import React, { useState } from "react";

function App() {
  const [contact, setContact] = useState({
    fName: "",
    lName: "",
    email: ""
  });

  function handleChange(event) {
    const {value, name} = event.target;

    setContact(prevState => {
      return {
        ...prevValue,
        [name]: value
      }
      // if (name === "fName") {
      //   return {fName: value, lName: prevState.lName, email: prevState.email}
      // } else if (name === "lName") {
      //   return {fName: prevState.fName, lName: value, email: prevState.email}
      // } else if (name === "email") {
      //   return {fName: prevState.fName, lName: prevState.lName, email: value}
      // }
    });
  }

  return (
    <div className="container">
      <h1>
        Hello {contact.fName} {contact.lName}
      </h1>
      <p>{contact.email}</p>
      <form>
        <input name="fName" value={contact.fName} onChange={handleChange} placeholder="First Name" />
        <input name="lName" value={contact.lName} onChange={handleChange} placeholder="Last Name" />
        <input name="email" value={contact.email} onChange={handleChange} placeholder="Email" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
