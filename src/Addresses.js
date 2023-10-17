import React, { useRef, useEffect } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

const Addresses = ({ addresses, createAddress })=> {
  const el = useRef();
  useEffect(()=> {
    const setup = async()=> {
      const loader = new Loader({
        apiKey: window.GOOGLE_API_KEY,
      });
     await loader.load();
     const { Autocomplete } = await google.maps.importLibrary("places");
      const options = {
        fields: [
          'formatted_address',
          'geometry'
        ]
      };
      const autocomplete = new Autocomplete(el.current, options);
      autocomplete.addListener('place_changed', async()=> {
        const place = autocomplete.getPlace();
        const address = { data: place };
        await createAddress(address); 
        el.current.value = '';
      });
    }
    setup();
  }, []);
  return (
    <div>
      <h2>Addresses</h2>
      <input ref={ el } />
      <ul>
        {
          addresses.map( address => {
            return (
              <li key={ address.id }>
                { address.data.formatted_address }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Addresses;
