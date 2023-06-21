import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import Events from "../Events/Events";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "get",
            url: "http://localhost:8080/api/events/",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          };
          const { data: res } = await axios(config);
          setEvents(res.data);
        } catch (error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    };

    fetchEvents();
  }, []);

  // Transform events into the required format
  const transformedEvents = events.map((event) => ({
    _id: event._id,
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    color: event.color,
  }));

  const handleDateClick = (arg) => {
    navigate("/createEvent");
  };

  const handleEventClick = (arg) => {
    const eventId = arg.event.extendedProps._id;
    navigate(`/editEvent/${eventId}`);
  };

  const handleEventResize = (eventInfo) => {
    const event = eventInfo;

    // Update the event's start and end dates based on the resizing
    const updatedEvent = {
      ...event,
      start: event.start,
      end: event.end,
    };

    // Save the updated event data to your backend
    saveEvent(updatedEvent);
  };

  const handleEventDrop = (eventInfo) => {
    const event = eventInfo;

    // Update the event's start and end dates based on the dragging
    const updatedEvent = {
      ...event,
      start: event.start,
      end: event.end,
    };

    // Save the updated event data to your backend
    saveEvent(updatedEvent);
  };

  const saveEvent = async (event) => {
    const token = localStorage.getItem("token");
    // Remove circular references
    const eventId = event.event.extendedProps._id;
    const eventData = {
      title: event.event.title,
      description: event.event.extendedProps.description,
      start: event.event._instance.range.start,
      end: event.event._instance.range.end,
      color: event.event.backgroundColor,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/events/${eventId}`,
        eventData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      console.log("Event saved:", response.data);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className={styles.demo_app}>
      <div className={styles.demo_app_sidebar}>
        {events.length > 0 ? (
          <>
            <h2>Events list:</h2>
            <Events events={events} />
          </>
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <div className={styles.demo_app_main}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={transformedEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
        />
      </div>
    </div>
  );
};

export default Calendar;
