// types/index.ts

import { NextApiRequest } from 'next';

export interface NextApiRequestWithSession extends NextApiRequest {
  session: {
    user: {
      email: string;
     
    } | null;
   
  };
}
