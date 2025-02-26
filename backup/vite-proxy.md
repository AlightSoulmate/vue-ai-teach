// 获取所有类别
"/api": {
target: "https://frp-man.com:49044",
changeOrigin: true,
rewrite: (path) => path.replace(/^\/api/, ""),
},
