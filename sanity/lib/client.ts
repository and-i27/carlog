import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Public (browser-safe) client: no token, CDN allowed by default.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
