import React, { Component } from "react";
import FlipMove from "react-flip-move";
// class MyComponent extends Component {

//     render() {
//       return (
//         <div>Hello World</div>
//       )
//     }
//   }

const List = props => (
  <FlipMove
    staggerDurationBy="30"
    duration={500}
    enterAnimation='accordianVertical'
    leaveAnimation='accordianVertical'
    typeName="ul"
  >
    {props.items.map((item, index) => (
      <li className="list" key={index}>
        {item}
      </li>
    ))}
  </FlipMove>
);

export default List;
