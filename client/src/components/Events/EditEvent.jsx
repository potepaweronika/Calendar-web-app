import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditEvent.module.css';

const EditEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    color: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({
    titleError: '',
    startDateError: '',
    endDateError: '',
  });

  useEffect(() => {
    // Fetch event data from the server and populate the form fields
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          method: 'get',
          url: `http://localhost:8080/api/events/${eventId}`,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        };
        const response = await axios(config);
        const eventData = response.data;

        setFormData({
          title: eventData.title,
          startDate: eventData.start,
          endDate: eventData.end,
          color: eventData.color,
          description: eventData.description,
        });
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    let hasError = false;
    const errors = {
      titleError: '',
      startDateError: '',
      endDateError: '',
    };

    if (!formData.title.trim()) {
      hasError = true;
      errors.titleError = 'Title is required';
    }

    if (!formData.startDate.trim()) {
      hasError = true;
      errors.startDateError = 'Start date is required';
    }

    if (!formData.endDate.trim()) {
      hasError = true;
      errors.endDateError = 'End date is required';
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // If form is valid, proceed with event update
    try {
      const token = localStorage.getItem('token');
      const config = {
        method: 'put',
        url: `http://localhost:8080/api/events/${eventId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        data: {
          title: formData.title,
          start: formData.startDate,
          end: formData.endDate,
          color: formData.color,
          description: formData.description,
        },
      };
      await axios(config);

      // Redirect to calendar view after successful event update
      navigate('/');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        method: 'delete',
        url: `http://localhost:8080/api/events/${eventId}`,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      };
      await axios(config);

      // Redirect to calendar view after successful event deletion
      navigate('/');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className={styles.edit_event}>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {formErrors.titleError && (
            <span className={styles.error_message}>{formErrors.titleError}</span>
          )}
        </div>
        <div className={styles.form_group}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {formErrors.startDateError && (
            <span className={styles.error_message}>{formErrors.startDateError}</span>
          )}
        </div>
        <div className={styles.form_group}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {formErrors.endDateError && (
            <span className={styles.error_message}>{formErrors.endDateError}</span>
          )}
        </div>
        <div className={styles.form_group}>
          <label htmlFor="color">Color:</label>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className={styles.button_group}>
          <button className={styles.edit_event_button} type="submit">
            Update Event
          </button>
          <button className={styles.delete_button} type="button" onClick={handleDelete}>
            Delete Event
          </button>
          <button className={styles.cancel_button} type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
