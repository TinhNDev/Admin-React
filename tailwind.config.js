// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Thay đổi từ false thành 'class'
  theme: {
    extend: {
      colors: {
        // Bạn có thể thêm các màu tùy chỉnh ở đây nếu cần
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
