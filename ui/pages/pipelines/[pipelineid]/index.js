import { useRouter } from 'next/router';

import React, { useEffect } from 'react';

export default function Pipeline() {
  const router = useRouter();
  const { pipelineid } = router.query;

  // TODO - how to make sure the router is ready (?)
  useEffect(() => {
    if (router.isReady) {
      // Code using query
      console.log(`pipelineid index.js: ${router.path}`);
      console.log(`pipelineid index.js: ${router.pathname}`);
      console.log(`pipelineid index.js: ${router.query.slug}`);
    }
  }, [router.isReady]);

  return <h1>Pipeline: {pipelineid}</h1>;
}
