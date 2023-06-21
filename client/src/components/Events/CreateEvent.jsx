import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEvent.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    color: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    titleError: "",
    startDateError: "",
    endDateError: "",
  });

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
      titleError: "",
      startDateError: "",
      endDateError: "",
    };

    if (!formData.title.trim()) {
      hasError = true;
      errors.titleError = "Title is required";
    }

    if (!formData.startDate.trim()) {
      hasError = true;
      errors.startDateError = "Start date is required";
    }

    if (!formData.endDate.trim()) {
      hasError = true;
      errors.endDateError = "End date is required";
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      hasError = true;
      errors.endDateError = "End date cannot be earlier than the start date";
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // If form is valid, proceed with event creation
    try {
      const token = localStorage.getItem("token");
      const config = {
        method: "post",
        url: "http://localhost:8080/api/events/",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
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

      // Redirect to calendar view after successful event creation
      toast.success("Event created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={styles.create_event}>
      <h2>Create Event</h2>
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
            <span className={styles.error_message}>
              {formErrors.titleError}
            </span>
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
            <span className={styles.error_message}>
              {formErrors.startDateError}
            </span>
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
            <span className={styles.error_message}>
              {formErrors.endDateError}
            </span>
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
          <button className={styles.create_event_button} type="submit">
            Create Event
          </button>
          <button
            className={styles.cancel_button}
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateEvent;
