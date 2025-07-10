import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface RateLimitState {
  requests: number;
  lastReset: number;
  isBlocked: boolean;
}

interface RateLimitContextType {
  checkRateLimit: (action: string) => boolean;
  getRemainingRequests: () => number;
  isBlocked: boolean;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

// Configurações de rate limit por ação
const RATE_LIMITS = {
  default: { maxRequests: 100, windowMs: 60000 }, // 100 req/min
  auth: { maxRequests: 5, windowMs: 60000 }, // 5 tentativas de login/min
  create: { maxRequests: 20, windowMs: 60000 }, // 20 criações/min
  update: { maxRequests: 30, windowMs: 60000 }, // 30 atualizações/min
  delete: { maxRequests: 10, windowMs: 60000 }, // 10 exclusões/min
};

export const RateLimitProvider = ({ children }: { children: ReactNode }) => {
  const [rateLimitStates, setRateLimitStates] = useState<Record<string, RateLimitState>>({});

  // Limpar contadores expirados a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRateLimitStates(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(action => {
          const config = RATE_LIMITS[action as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
          if (now - updated[action].lastReset > config.windowMs) {
            updated[action] = {
              requests: 0,
              lastReset: now,
              isBlocked: false
            };
          }
        });
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkRateLimit = (action: string): boolean => {
    const now = Date.now();
    const config = RATE_LIMITS[action as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
    
    setRateLimitStates(prev => {
      const current = prev[action] || { requests: 0, lastReset: now, isBlocked: false };
      
      // Reset se a janela de tempo expirou
      if (now - current.lastReset > config.windowMs) {
        return {
          ...prev,
          [action]: {
            requests: 1,
            lastReset: now,
            isBlocked: false
          }
        };
      }
      
      // Incrementar contador
      const newRequests = current.requests + 1;
      const isBlocked = newRequests > config.maxRequests;
      
      if (isBlocked && !current.isBlocked) {
        toast.error(`Muitas tentativas. Aguarde ${Math.ceil(config.windowMs / 60000)} minuto(s).`);
      }
      
      return {
        ...prev,
        [action]: {
          requests: newRequests,
          lastReset: current.lastReset,
          isBlocked
        }
      };
    });
    
    const state = rateLimitStates[action];
    return !state?.isBlocked;
  };

  const getRemainingRequests = (): number => {
    const defaultState = rateLimitStates.default;
    if (!defaultState) return RATE_LIMITS.default.maxRequests;
    
    return Math.max(0, RATE_LIMITS.default.maxRequests - defaultState.requests);
  };

  const isBlocked = Object.values(rateLimitStates).some(state => state.isBlocked);

  return (
    <RateLimitContext.Provider value={{
      checkRateLimit,
      getRemainingRequests,
      isBlocked
    }}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within RateLimitProvider');
  }
  return context;
};