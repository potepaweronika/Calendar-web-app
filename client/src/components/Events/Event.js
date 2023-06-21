const Event = (props) => {
  const event = props.event;
  return (
    <li>
      {" "}
      <h3>{event.title}</h3>
      <h4>{event.description}</h4>{" "}
    </li>
  );
};
export default Event;
