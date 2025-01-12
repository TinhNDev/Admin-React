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
import { getAllDrivers, updateDriverStatus } from '../apis/driver/driver';

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

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentMode } = useStateContext();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await getAllDrivers();
        // Chỉ lấy tài xế có trạng thái "PROCESSING" hoặc "ONLINE"
        const filteredDrivers = response.filter(
          (driver) => driver.status === 'PROCESSING' || driver.status === 'ONLINE'
        );
        setDrivers(filteredDrivers);
      } catch (err) {
        setError('Không thể tải danh sách tài xế.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PROCESSING' ? 'ONLINE' : 'PROCESSING';

    try {
      const updatedDriver = await updateDriverStatus(id, newStatus);
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === id ? { ...driver, status: updatedDriver.status } : driver
        )
      );
    } catch (error) {
      console.error('Không thể thay đổi trạng thái tài xế:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const textColor = currentMode === 'Dark' ? '#FFFFFF' : '#000000';

  return (
    <Container>
      <PageTitle variant="h4" style={{ color: textColor }}>
        Danh sách tài xế
      </PageTitle>
      <ScrollableGrid container spacing={2}>
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={driver.id}
              style={{
                cursor: 'pointer',
                backgroundColor:
                  driver.status === 'ONLINE'
                    ? '#d4edda'
                    : '#f0e68c',
              }}
            >
              <StyledBox
                sx={{
                  backgroundColor: currentMode === 'Dark' ? '#333' : '#f5f5f5',
                }}
              >
                <img
                  src={driver.Profile.image}
                  alt={driver.Profile.name}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
                <Typography variant="h6" style={{ color: textColor, marginTop: '10px' }}>
                  {driver.name}
                </Typography>
                <Typography variant="body2" style={{ color: textColor }}>
                  SĐT: {driver.Profile.phone_number}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    color: driver.status === 'PROCESSING' ? '#28a745' : '#007bff',
                    fontWeight: 'bold',
                  }}
                >
                  {driver.status === 'PROCESSING' ? 'Chờ xử lý' : 'Đã xử lý'}
                </Typography>
                <Typography variant="body2" style={{ color: textColor }}>
                  Địa chỉ: {driver.Profile.address}
                </Typography>
                <Button
                  onClick={() => handleStatusChange(driver.id, driver.status)}
                  variant="contained"
                  color={driver.status === 'PROCESSING' ? 'success' : 'warning'}
                  style={{ marginTop: '10px' }}
                >
                  {driver.status === 'PROCESSING' ? 'Duyệt' : 'Chờ xử lý'}
                </Button>
              </StyledBox>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" style={{ color: textColor }}>
            Không có tài xế nào để hiển thị.
          </Typography>
        )}
      </ScrollableGrid>
    </Container>
  );
};

export default DriverList;
