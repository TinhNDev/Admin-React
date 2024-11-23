import React, { useState } from "react";
import { Button, Typography, Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { signIn } from "../apis/users/access";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await signIn(email, password);
      if (response) {
        Cookie.set("accessToken", response.tokens.accessToken, { expires: 7 });
        navigate("/home");
      }
    } catch (error) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <Box className="bg-white p-10 rounded-xl shadow-2xl w-96 transform transition-all hover:scale-105">
        <Typography variant="h3" className="text-center mb-8 text-gray-800 font-bold">
          Quản Trị Hệ Thống
        </Typography>

        {error && (
          <Typography 
            variant="body2" 
            className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded"
          >
            {error}
          </Typography>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-6"
          InputProps={{
            className: "rounded-lg"
          }}
        />

        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-8"
          InputProps={{
            className: "rounded-lg"
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSignIn}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          Đăng Nhập
        </Button>
      </Box>
    </div>
  );
};

export default Auth;