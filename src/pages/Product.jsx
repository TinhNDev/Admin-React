import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, publishProduct, unpublishProduct } from '../apis/restaurant/product';
import { useStateContext } from '../context/ContextProvider';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';

const PageTitle = styled(Typography)`
  margin-bottom: 20px;
  font-weight: bold;
`;

const ScrollableGrid = styled(Grid)`
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 10px;
`;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentMode } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSingleClick = async (product) => {
    try {
      if (product.is_public) {
        // Chuyển trạng thái sang "Không được duyệt"
        const response = await unpublishProduct(product.id);
        if (response) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id ? { ...p, is_public: false, is_draft: true } : p
            )
          );
          alert('Sản phẩm đã chuyển sang "Không được duyệt"!');
        }
      } else {
        // Chuyển trạng thái sang "Được duyệt"
        const response = await publishProduct(product.id);
        if (response) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id ? { ...p, is_public: true, is_draft: false } : p
            )
          );
          alert('Sản phẩm đã được duyệt!');
        }
      }
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDoubleClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClick = (product) => {
    let clickTimeout;
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      handleDoubleClick(product.id); // Double click để chỉnh sửa chi tiết
    } else {
      clickTimeout = setTimeout(() => {
        handleSingleClick(product); // Single click để đổi trạng thái
        clearTimeout(clickTimeout);
      }, 300);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const textColor = currentMode === 'Dark' ? '#FFFFFF' : '#000000';

  return (
    <Container>
      <PageTitle variant="h4" style={{ color: textColor }}>
        Danh sách sản phẩm
      </PageTitle>
      <ScrollableGrid container spacing={2}>
        {products.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={product.id}
            onClick={() => handleClick(product)}
            style={{
              cursor: 'pointer',
              backgroundColor: product.is_public ? '#d4edda' : '#f8d7da',
            }}
          >
            <Box
              sx={{
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: currentMode === 'Dark' ? '#333' : '#f5f5f5',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <Typography variant="h6" style={{ color: textColor }}>
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: product.is_public ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                }}
              >
                {product.is_public ? 'Đã duyệt' : 'Chưa duyệt'}
              </Typography>
              <Typography variant="body2" style={{ color: textColor }}>
                Giá: {product.price.toLocaleString()} VND
              </Typography>
            </Box>
          </Grid>
        ))}
      </ScrollableGrid>
    </Container>
  );
};

export default Product;
