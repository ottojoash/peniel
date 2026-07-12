import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const SiteContext = createContext({ settings: {}, loading: true });
export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { api('/api/content').then(setSettings).catch(() => {}).finally(() => setLoading(false)); }, []);
  return <SiteContext.Provider value={{ settings, setSettings, loading }}>{children}</SiteContext.Provider>;
};
export const useSite = () => useContext(SiteContext);
