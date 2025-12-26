/**
 * useTenantContext Hook & Provider
 * Provides tenant context throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LearningAPIService, TenantContext } from '../services/LearningAPIService';

interface TenantContextValue {
  tenantContext: TenantContext | null;
  isLoading: boolean;
  error: string | null;
  tenantName: string;
}

const TENANT_NAME_MAP: Record<string, string> = {
  'techcorp': 'TechCorp Inc.',
  'acme': 'Acme Corporation',
  'globex': 'Globex Industries',
  'gograbjob-b2b': 'GoGrabJob Platform',
};

const TenantContextObj = createContext<TenantContextValue | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenantContext, setTenantContext] = useState<TenantContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Initialize tenant context from session
      const context = LearningAPIService.initializeTenantContext();
      setTenantContext(context);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant context');
      console.error('Tenant context error:', err);
      
      // Don't redirect immediately, let the app handle it
      // window.location.href = 'http://localhost:3005/login';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tenantName = tenantContext 
    ? (TENANT_NAME_MAP[tenantContext.tenantId] || tenantContext.tenantId)
    : '';

  const value: TenantContextValue = {
    tenantContext,
    isLoading,
    error,
    tenantName,
  };

  return (
    <TenantContextObj.Provider value={value}>
      {children}
    </TenantContextObj.Provider>
  );
};

export const useTenantContext = (): TenantContextValue => {
  const context = useContext(TenantContextObj);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};

