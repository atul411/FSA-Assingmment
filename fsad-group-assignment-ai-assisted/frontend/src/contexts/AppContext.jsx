import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🧠 Fetch all data after login
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqRes, reqRes] = await Promise.all([
        fetch('http://localhost:5001/api/items'),
        fetch('http://localhost:5001/api/dashboard/stats'),
      ]);

      if (!eqRes.ok || !reqRes.ok) throw new Error('Failed to fetch data');

      const equipmentData = await eqRes.json();
      const requestsData = await reqRes.json();

      setEquipment(equipmentData || []);
      setRequests(requestsData || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Login API
  const login = async (email, password, role) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      const user = await response.json();

      setCurrentUser(user);
      setUsers([user]); // You can extend this if backend provides user list
      localStorage.setItem('fsa_currentUser', JSON.stringify(user));

      await fetchData();
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    }
  };

  // 🚪 Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fsa_currentUser');
  };

  // 📝 Signup API
  const signup = async (userData) => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error('Signup failed');
      const newUser = await res.json();

      setCurrentUser(newUser);
      localStorage.setItem('fsa_currentUser', JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    }
  };

  // ⚙️ Equipment APIs
  const addEquipment = async (equipmentData) => {
    try {
      const res = await fetch('http://localhost:5001/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentData),
      });
      if (!res.ok) throw new Error('Failed to add equipment');
      const newEq = await res.json();
      setEquipment((prev) => [...prev, newEq]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEquipment = async (id, equipmentData) => {
    try {
      const res = await fetch(`http://localhost:5001/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipmentData),
      });
      if (!res.ok) throw new Error('Failed to update equipment');
      const updated = await res.json();
      setEquipment((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEquipment = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete equipment');
      setEquipment((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // 📦 Request Handling APIs
  const createRequest = async (requestData) => {
    try {
      const res = await fetch('http://localhost:5001/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error('Failed to create request');
      const newReq = await res.json();
      setRequests((prev) => [...prev, newReq]);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRequestStatus = async (id, status, notes) => {
    try {
      const res = await fetch(`http://localhost:5001/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error('Failed to update request');
      const updated = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsReturned = async (id, condition, notes, fine) => {
    try {
      const res = await fetch(`http://localhost:5001/api/requests/${id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition, notes, fine }),
      });
      if (!res.ok) throw new Error('Failed to mark as returned');
      const updated = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        equipment,
        requests,
        loading,
        error,
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
