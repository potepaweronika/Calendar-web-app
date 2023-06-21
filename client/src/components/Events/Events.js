import Event from "./Event";
function Events(props) {
  const events = props.events;
  return (
    <ul>
      {" "}
      {events.map((event) => (
        <Event key={event._id} value={event._id} event={event} />
      ))}{" "}
    </ul>
  );
}
export default Events;
