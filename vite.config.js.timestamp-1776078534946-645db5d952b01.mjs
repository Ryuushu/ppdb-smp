// vite.config.js
import tailwindcss from "file:///C:/laragon/www/ppdb-smp/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///C:/laragon/www/ppdb-smp/node_modules/@vitejs/plugin-react/dist/index.js";
import laravel from "file:///C:/laragon/www/ppdb-smp/node_modules/laravel-vite-plugin/dist/index.js";
import { resolve } from "node:path";
import { defineConfig } from "file:///C:/laragon/www/ppdb-smp/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\laragon\\www\\ppdb-smp";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "resources/js")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("lucide-react")) return "vendor-icons";
            return "vendor";
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxwcGRiLXNtcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcbGFyYWdvblxcXFx3d3dcXFxccHBkYi1zbXBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2xhcmFnb24vd3d3L3BwZGItc21wL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBsYXJhdmVsIGZyb20gXCJsYXJhdmVsLXZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdGxhcmF2ZWwoe1xyXG5cdFx0XHRpbnB1dDogW1wicmVzb3VyY2VzL2Nzcy9hcHAuY3NzXCIsIFwicmVzb3VyY2VzL2pzL2FwcC50c3hcIl0sXHJcblx0XHRcdHJlZnJlc2g6IHRydWUsXHJcblx0XHR9KSxcclxuXHRcdHJlYWN0KCksXHJcblx0XHR0YWlsd2luZGNzcygpLFxyXG5cdF0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0YWxpYXM6IHtcclxuXHRcdFx0XCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInJlc291cmNlcy9qc1wiKSxcclxuXHRcdH0sXHJcblx0fSxcclxuXHRidWlsZDoge1xyXG5cdFx0cm9sbHVwT3B0aW9uczoge1xyXG5cdFx0XHRvdXRwdXQ6IHtcclxuXHRcdFx0XHRtYW51YWxDaHVua3MoaWQpIHtcclxuXHRcdFx0XHRcdGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoaWQuaW5jbHVkZXMoXCJyZWNoYXJ0c1wiKSkgcmV0dXJuIFwidmVuZG9yLWNoYXJ0c1wiO1xyXG5cdFx0XHRcdFx0XHRpZiAoaWQuaW5jbHVkZXMoXCJsdWNpZGUtcmVhY3RcIikpIHJldHVybiBcInZlbmRvci1pY29uc1wiO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJ2ZW5kb3JcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUCxPQUFPLGlCQUFpQjtBQUN2UixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUo3QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDUCxPQUFPLENBQUMseUJBQXlCLHNCQUFzQjtBQUFBLE1BQ3ZELFNBQVM7QUFBQSxJQUNWLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNiO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLElBQ3ZDO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sZUFBZTtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ1AsYUFBYSxJQUFJO0FBQ2hCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUNoQyxnQkFBSSxHQUFHLFNBQVMsVUFBVSxFQUFHLFFBQU87QUFDcEMsZ0JBQUksR0FBRyxTQUFTLGNBQWMsRUFBRyxRQUFPO0FBQ3hDLG1CQUFPO0FBQUEsVUFDUjtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
