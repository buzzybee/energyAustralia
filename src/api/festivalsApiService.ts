import * as rax from 'retry-axios';
import axios from 'axios';

// attach to the global axios instance, with 3 retries, exponential backoff
rax.attach();

export const getData = async () => {
  // ideally this url would be in a config file that is setup per environment and injected here
  const response = await axios.get(
    'http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals'
  );
  return response.data;
};
