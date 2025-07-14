import { useEffect } from 'react';

export const useDocumentTitle = (title, deps = []) => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} | GetMeAChai`;
    } else {
      document.title = 'GetMeAChai - Support Your Favorite Creators';
    }
    
    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title, ...deps]);
};

export default useDocumentTitle;
