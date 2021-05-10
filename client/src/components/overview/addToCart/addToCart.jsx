//React
import React from 'react';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { addToOutfit } from '../../relatedItemsComparison/outfitSlice.js';
import { throwErr, updateSizeDropDownDisplay, updateQuantDropDownDisplay, updateSkuInfo } from './cartSlice.js';

//Axios
const axios = require('axios');

//Material UI
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

//Components
import SizeSelect from './sizeSelect.jsx';
import QuantSelect from './quantSelect.jsx';

//Tracking
import { countAddToCartClick, countAddToOutfitClick } from '../../appSlice.js';

const AddToCart = (props) => {
  const dispatch = useDispatch();
  const sku = useSelector((state) => state.cart.sku);
  const err = useSelector((state) => state.cart.err);
  const sizes = useSelector((state) => state.cart.sizes);
  const productInfo = useSelector((state) => state.app.productInfo);
  const productId = useSelector((state) => state.app.productId);
  const ratings = useSelector((state) => state.app.rating);
  const style = useSelector((state) => state.overview.currentStyle);
  const outfitIds = useSelector((state) => state.outfit.outfitIds);

  let editedProductInfo = { ...productInfo };

  if (style) {
    editedProductInfo.ratings = ratings;
    editedProductInfo.photo = style.photos[0].url;
  }

  const addToCart = (sku) => {
    axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/cart`, {
      sku_id: sku
    });
  };

  const handleOutfitClick = () => {
    dispatch(addToOutfit(editedProductInfo));
  };

  return (
    <Grid data-testid="add-to-cart" container spacing={2}>
      <Grid item xs={12}
        style={err === null || err === false ? { display: 'none' } : {}}>
        <span>Please select a size.</span>
      </Grid>
      <Grid item xs={6}>
        <SizeSelect />
      </Grid>
      <Grid item xs={6}>
        <QuantSelect />
      </Grid>
      <Grid item xs={6}>
        <Button
          aria-label="add to cart"
          variant="outlined"
          size="medium"
          style={sizes.length === 0 ? { display: 'none' } : {}}
          onClick={() => {
            if (err === null) {
              dispatch(throwErr(true));
            } else {
              addToCart(sku);
              dispatch(updateSizeDropDownDisplay({ value: 'default', label: 'SELECT SIZE' }));
              dispatch(updateQuantDropDownDisplay({ value: null, label: '-' }));
              dispatch(updateSkuInfo({}));
              dispatch(countAddToCartClick());
            }
          }}
        >Add to cart</Button>
      </Grid>
      <Grid item xs={6}>
        <Button aria-label="add to outfit"
          variant="outlined"
          size="medium"
          disabled={outfitIds.includes(productId)}
          style={sizes.length === 0 ? { display: 'none' } : {}}
          onClick={() => {
            handleOutfitClick();
            dispatch(countAddToOutfitClick());
          }}
        >Add to outfit</Button>
      </Grid>
    </Grid>
  );
};

export default AddToCart;
