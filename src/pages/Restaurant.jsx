import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import styled from '@emotion/styled';
import { useStateContext } from '../context/ContextProvider';
import { getAllRestaurants, updateRestaurantStatus } from '../apis/restaurant/restaurant';

const PageTitle = styled(Typography)`
  margin-bottom: 20px;
  font-weight: bold;
`;

const ScrollableGrid = styled(Grid)`
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 10px;
`;

const StyledBox = styled(Box)`
  border-radius: 10px;
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentMode } = useStateContext();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getAllRestaurants();
        setRestaurants(response); // Set mảng nhà hàng từ API
      } catch (err) {
        setError('Không thể tải danh sách nhà hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleStatusChange = async (id) => {
    try {
      const updatedRestaurant = await updateRestaurantStatus(id); // Gửi yêu cầu tới API
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === id ? { ...restaurant, status: updatedRestaurant.status } : restaurant
        )
      );
    } catch (error) {
      console.error('Không thể thay đổi trạng thái nhà hàng:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const textColor = currentMode === 'Dark' ? '#FFFFFF' : '#000000';

  return (
    <Container>
      <PageTitle variant="h4" style={{ color: textColor }}>
        Danh sách nhà hàng
      </PageTitle>
      <ScrollableGrid container spacing={2}>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={restaurant.id}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  restaurant.status === 'active' ? '#d4edda' : '#f8d7da',
              }}
            >
              <StyledBox
                sx={{
                  backgroundColor:
                    currentMode === 'Dark' ? '#333' : '#f5f5f5',
                }}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
                <Typography variant="h6" style={{ color: textColor, marginTop: '10px' }}>
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" style={{ color: textColor }}>
                  Địa chỉ: {restaurant.address}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: restaurant.status === 'active' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold',
                  }}
                >
                  {restaurant.status === 'active' ? 'Đã duyệt' : 'Đang chờ duyệt'}
                </Typography>
                <Typography variant="body2" style={{ color: textColor }}>
                  Giờ mở cửa: {restaurant.opening_hours}
                </Typography>
                <Typography variant="body2" style={{ color: textColor }}>
                  SĐT: {restaurant.phone_number}
                </Typography>
                <Button
                  onClick={() => handleStatusChange(restaurant.id)}
                  variant="contained"
                  color={restaurant.status === 'active' ? 'error' : 'success'}
                  style={{ marginTop: '10px' }}
                >
                  {restaurant.status === 'active'
                    ? 'Chuyển sang chờ duyệt'
                    : 'Duyệt'}
                </Button>
              </StyledBox>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" style={{ color: textColor }}>
            Không có nhà hàng nào để hiển thị.
          </Typography>
        )}
      </ScrollableGrid>
    </Container>
  );
};

export default RestaurantList;
