module.exports = {
  content: [
    "./views/**/*.ejs", // Update based on your template engine and file structure
    "./public/js/**/*.js",
    "./routes/**/*.js", // Optional: Include if you use inline classes in route files
  ],
  theme: {
    extend: {
      boxShadow:{
        "blue_shadow_500": "0 4px 10px rgba(59, 130, 246, 0.5)",
      },
      
    },
  },
  plugins: [],
};
