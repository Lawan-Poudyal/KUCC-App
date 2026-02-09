import { useEffect } from 'react';
   import { useAuth } from '@clerk/clerk-expo';

   export default function UserSync() {
     const { isSignedIn, getToken } = useAuth();

     useEffect(() => {
       const syncUser = async () => {
         if (!isSignedIn) return;

         try {
           const token = await getToken();
           
           const response = await fetch(
             `${process.env.EXPO_PUBLIC_API_URL}/api/user/sync`,
             {
               method: 'POST',
               headers: {
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json',
               },
             }
           );

           if (response.ok) {
             console.log('✅ User auto-synced (safety net)');
           }
         } catch (error) {
           console.error('Sync error:', error);
         }
       };

       syncUser();
     }, [isSignedIn, getToken]);

     return null;
   }