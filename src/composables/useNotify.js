 import { useQuasar } from 'quasar'; 
 
 export function useNotify() { 
   const $q = useQuasar(); 
 
   const showNotify = (message, color = 'positive', icon = 'check') => { 
     $q.notify({ 
       message, 
       color, 
       icon, 
       position: 'top', 
     }); 
   }; 
 
   const showErrorNotify = (message = 'Error') => { 
     $q.notify({ 
       message, 
       color: 'negative', 
       icon: 'report_problem', 
       position: 'top', 
     }); 
   }; 
 
   return { 
     showNotify, 
     showErrorNotify, 
   }; 
 }