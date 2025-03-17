import { generateMeta } from '$lib/generateMeta';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Wait for the child page's data
  const pageData = await event.parent();
  
  // Now pageData contains all the data returned from the page's load function
  const { title, description } = generateMeta({ 
    params: event.params, 
    data: pageData // This contains solution, source, offset from the page load
  });
  
  return {
    metadata: {
      title,
      description,
    }
  };
};