import { ReactNode, useEffect } from 'react';
import { RateLimitProvider } from './RateLimitProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Configurar interceptador para requisições do Supabase
    const originalRequest = supabase.rest.fetch;
    
    supabase.rest.fetch = async (input, init) => {
      try {
        // Adicionar headers de segurança
        const headers = {
          ...init?.headers,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        };

        const response = await originalRequest(input, {
          ...init,
          headers
        });

        // Log de segurança para requisições suspeitas
        if (!response.ok && response.status === 429) {
          console.warn('Rate limit atingido:', {
            url: input,
            status: response.status,
            timestamp: new Date().toISOString()
          });
          toast.error('Muitas requisições. Aguarde um momento.');
        }

        return response;
      } catch (error) {
        console.error('Erro de segurança na requisição:', error);
        throw error;
      }
    };

    // Detectar tentativas de XSS
    const detectXSS = () => {
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /eval\(/i
      ];

      const checkInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target && target.value) {
          const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
            pattern.test(target.value)
          );
          
          if (hasSuspiciousContent) {
            console.warn('Tentativa de XSS detectada:', {
              value: target.value,
              element: target.tagName,
              timestamp: new Date().toISOString()
            });
            target.value = target.value.replace(/<[^>]*>/g, '');
            toast.error('Conteúdo suspeito removido por segurança.');
          }
        }
      };

      document.addEventListener('input', checkInput);
      return () => document.removeEventListener('input', checkInput);
    };

    const cleanupXSSDetection = detectXSS();

    // Detectar tentativas de SQL injection em campos de texto
    const detectSQLInjection = () => {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /(--|\/\*|\*\/)/,
        /(\bOR\b|\bAND\b).*[=<>]/i,
        /['"]\s*(OR|AND)\s*['"]/i
      ];

      const checkSQLInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target && target.value && target.type === 'text') {
          const hasSQLPattern = sqlPatterns.some(pattern => 
            pattern.test(target.value)
          );
          
          if (hasSQLPattern) {
            console.warn('Tentativa de SQL injection detectada:', {
              value: target.value,
              element: target.name || target.id,
              timestamp: new Date().toISOString()
            });
            toast.error('Entrada inválida detectada.');
          }
        }
      };

      document.addEventListener('blur', checkSQLInput, true);
      return () => document.removeEventListener('blur', checkSQLInput, true);
    };

    const cleanupSQLDetection = detectSQLInjection();

    // Cleanup
    return () => {
      cleanupXSSDetection();
      cleanupSQLDetection();
    };
  }, []);

  return (
    <RateLimitProvider>
      {children}
    </RateLimitProvider>
  );
};
