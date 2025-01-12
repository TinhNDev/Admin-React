import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProduct } from '../apis/restaurant/product';
import { useStateContext } from '../context/ContextProvider';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const ProductDetail = () => {
  const { id } = useParams();
  const { currentMode } = useStateContext();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    image: '',
    descriptions: '',
    price: 0,
    quantity: 0,
    is_available: true,
  });
  const [toppingData, setToppingData] = useState([{ name: '', price: 0 }]);
  const [categoriesId, setCategoriesId] = useState(1);

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdate = async () => {
    try {
      await updateProduct(id, categoriesId, toppingData, { productData });
      alert('Cập nhật sản phẩm thành công!');
      navigate('/');
    } catch (err) {
      alert('Cập nhật sản phẩm thất bại!');
    }
  };

  // Hàm cập nhật topping
  const handleToppingChange = (index, field, value) => {
    const updatedTopping = [...toppingData];
    updatedTopping[index][field] = value;
    setToppingData(updatedTopping);
  };

  // Thêm topping mới
  const addTopping = () => {
    setToppingData([...toppingData, { name: '', price: 0 }]);
  };

  const textColor = currentMode === 'Dark' ? '#FFFFFF' : '#333333';
  const cardBackgroundColor = currentMode === 'Dark' ? '#424242' : '#FFFFFF';
  const fieldBackgroundColor = currentMode === 'Dark' ? '#333333' : '#f7f7f7';
  const borderColor = currentMode === 'Dark' ? '#555555' : '#cccccc';

  return (
    <Container maxWidth="md" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h4" style={{ color: textColor, fontWeight: 'bold', marginBottom: '20px' }}>
        Chỉnh sửa sản phẩm
      </Typography>
      <Card
        style={{
          backgroundColor: cardBackgroundColor,
          borderRadius: '10px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent>
          <Box sx={{ marginBottom: '20px' }}>
            <TextField
              label="Tên sản phẩm"
              fullWidth
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              sx={{
                marginBottom: '15px',
                backgroundColor: fieldBackgroundColor,
                borderRadius: '5px',
                '& .MuiOutlinedInput-root': {
                  borderColor: borderColor,
                },
              }}
            />
            <TextField
              label="Link ảnh"
              fullWidth
              value={productData.image}
              onChange={(e) => setProductData({ ...productData, image: e.target.value })}
              sx={{
                marginBottom: '15px',
                backgroundColor: fieldBackgroundColor,
                borderRadius: '5px',
              }}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={4}
              value={productData.descriptions}
              onChange={(e) => setProductData({ ...productData, descriptions: e.target.value })}
              sx={{
                marginBottom: '15px',
                backgroundColor: fieldBackgroundColor,
                borderRadius: '5px',
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Giá"
                  fullWidth
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: parseInt(e.target.value) })}
                  sx={{
                    backgroundColor: fieldBackgroundColor,
                    borderRadius: '5px',
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Số lượng"
                  fullWidth
                  type="number"
                  value={productData.quantity}
                  onChange={(e) => setProductData({ ...productData, quantity: parseInt(e.target.value) })}
                  sx={{
                    backgroundColor: fieldBackgroundColor,
                    borderRadius: '5px',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider style={{ marginBottom: '20px' }} />
          <Typography variant="h6" style={{ color: textColor, marginBottom: '10px' }}>
            Toppings
          </Typography>
          {toppingData.map((topping, index) => (
            <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
              <Grid item xs={6}>
                <TextField
                  label={`Topping ${index + 1} - Tên`}
                  fullWidth
                  value={topping.name}
                  onChange={(e) => handleToppingChange(index, 'name', e.target.value)}
                  sx={{
                    backgroundColor: fieldBackgroundColor,
                    borderRadius: '5px',
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={`Topping ${index + 1} - Giá`}
                  fullWidth
                  type="number"
                  value={topping.price}
                  onChange={(e) => handleToppingChange(index, 'price', parseInt(e.target.value))}
                  sx={{
                    backgroundColor: fieldBackgroundColor,
                    borderRadius: '5px',
                  }}
                />
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={addTopping}
            style={{
              marginBottom: '20px',
              borderColor: '#3f51b5',
              color: '#3f51b5',
            }}
          >
            Thêm topping mới
          </Button>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            startIcon={<Save />}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: '20px',
              padding: '10px 20px',
              backgroundColor: '#3f51b5',
            }}
          >
            Cập nhật sản phẩm
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default ProductDetail;
