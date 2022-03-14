/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import Prismic from '@prismicio/client';
// import DefaultClient from '@prismicio/client/types/client';

// export function getPrismicClient(req?: unknown): DefaultClient {
//   const prismic = Prismic.client(process.env.PRISMIC_API_ENDPOINT, {
//     req,
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//   });

//   return prismic;
// }

import * as prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown) {
  const endpoint = process.env.PRISMIC_API_ENDPOINT;
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  return client;
}

export const linkResolver = doc => {
  if (doc.type === 'post') {
    return `/post/${doc.uid}`;
  }

  return '/';
};
