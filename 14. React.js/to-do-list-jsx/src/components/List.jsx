import React, {useState} from "react";

function ListItem(props) {

  // const [isDone, setIsDone] = useState(false);
  //
  // function handleClick() {
  //   setIsDone(prevState => !prevState);
  // }

  return (
    <div onClick={() => props.onChecked(props.id)}>
      <li>
        {props.text}
      </li>
    </div>
  );
}

export default ListItem;
