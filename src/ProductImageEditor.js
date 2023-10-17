import React, { useRef, useEffect } from 'react';

const ProductImageEditor = ({ product, updateProduct })=> {
  const el = useRef();
  useEffect(()=> {
    el.current.addEventListener('change', (ev)=> {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', async()=> {
        product = {...product, image: reader.result };
        await updateProduct(product);
      });
    });
  }, []);
  return (
    <div>
      <input type='file' ref={ el }/>
    </div>
  );
};

export default ProductImageEditor;
