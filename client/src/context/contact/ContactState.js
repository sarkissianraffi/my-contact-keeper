import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './ContactContext';
import ContactReducer from './ContactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from '../types';

// Set the initial States
const ContactState = (props) => {
  const initialState = {
    // Hard coded contact as far as we don't get it from our API
    contacts: [
      {
        id: 1,
        name: 'Raffi Sarkissian',
        email: 'raffi@raffi.com',
        phone: '111-111-111',
        type: 'Personal',
      },
      {
        id: 2,
        name: 'Brenda Gutierrez',
        email: 'brenda@brenda.com',
        phone: '222-222-222',
        type: 'Personal',
      },
      {
        id: 3,
        name: 'PA Oillic',
        email: 'pa@pa.com',
        phone: '333-333-333',
        type: 'Professional',
      },
    ],
    current: null,
    filtered: null,
  };

  // Pull out the state and dispatch to our reducer
  const [state, dispatch] = useReducer(ContactReducer, initialState);

  // Add Contact
  const addContact = (contact) => {
    //Get a random ID
    contact.id = uuidv4();
    //Dispatch the function to the reducer with the contact payload
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  // Delete Contact
  const deleteContact = (id) => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  // Set Current Contact
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Update Contact
  const updateContact = (contact) => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  // Filter Contacts
  const filterContacts = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
