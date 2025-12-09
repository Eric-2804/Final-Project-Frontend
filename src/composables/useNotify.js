 import { useQuasar } from 'quasar'; 
 
export function useNotify() {
  const $q = useQuasar();

  const showNotify = (options) => {
    $q.notify({
      color: 'positive',
      icon: 'check',
      position: 'top',
      ...options,
    });
  };

  const showErrorNotify = (options) => {
    $q.notify({
      color: 'negative',
      icon: 'report_problem',
      position: 'top',
      ...options,
    });
  };

  return {
     showNotify, 
     showErrorNotify, 
   }; 
 }