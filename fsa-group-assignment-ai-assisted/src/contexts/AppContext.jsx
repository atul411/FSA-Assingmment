import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockEquipment, mockRequests } from '../lib/mockData';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('fsa_currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [users, setUsers] = useState(mockUsers);
  const [equipment, setEquipment] = useState(mockEquipment);
  const [requests, setRequests] = useState(mockRequests);

  // Allow any email to login. If user doesn't exist, create it and log in.
  const login = (email, password, role) => {
    // Create a lightweight user record for unknown emails
    const nameFromEmail = email.split('@')[0] || 'User';
    const user = {
      id: `u${users.length + 1}`,
      name: nameFromEmail,
      email,
      role: role,
      schoolId: `S${users.length + 1}`,
    };
    setUsers(prev => [...prev, user]);

    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('fsa_currentUser');
    } catch (e) {
      // ignore
    }
  };

  const signup = (userData) => {
    const newUser = {
      ...userData,
      id: `u${users.length + 1}`,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const addEquipment = (equipmentData) => {
    const newEquipment = {
      ...equipmentData,
      id: `e${equipment.length + 1}`,
    };
    setEquipment([...equipment, newEquipment]);
  };

  const updateEquipment = (id, equipmentData) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, ...equipmentData } : e));
  };

  const deleteEquipment = (id) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const createRequest = (requestData) => {
    const newRequest = {
      ...requestData,
      id: `r${requests.length + 1}`,
      requestDate: new Date(),
    };
    setRequests([...requests, newRequest]);

    // Update equipment availability
    const eq = equipment.find(e => e.id === requestData.equipmentId);
    if (eq) {
      updateEquipment(eq.id, { available: eq.available - 1 });
    }
  };

  const updateRequestStatus = (id, status, notes) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status, notes, approvedBy: currentUser?.id } : r
    ));
  };

  const markAsReturned = (id, condition, notes, fine) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: 'Returned', returnDate: new Date(), notes, fine } : r
    ));

    // Update equipment availability
    const request = requests.find(r => r.id === id);
    if (request) {
      const eq = equipment.find(e => e.id === request.equipmentId);
      if (eq) {
        updateEquipment(eq.id, { available: eq.available + 1 });
      }
    }
  };

  // Persist currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('fsa_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fsa_currentUser');
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        equipment,
        requests,
        login,
        logout,
        signup,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        createRequest,
        updateRequestStatus,
        markAsReturned,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
