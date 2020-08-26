import React, {useState} from "react";
import ListItem from "./List";
import InputArea from "./InputArea";

function App() {

  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems(prevState => [...prevState, inputText]);
  }

  function deleteItem(id) {
    setItems(prevState => {
      return prevState.filter((item, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea onAdd={addItem}/>
      <div>
        <ul>
          {items.map((listItem, index) =>
            <ListItem key={index} id={index} text={listItem} onChecked={deleteItem}/>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
