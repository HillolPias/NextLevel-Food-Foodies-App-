/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true, // helps catch bugs early
//     // experimental: {
//     //   serverActions: true, // enable if you're using server actions (App Router)
//     // },
//     images: {
//         remotePatterns: [new URL('xiteuyuzdsdfljzwdywg.supabase.co')],
//       },

      module.exports = {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'xiteuyuzdsdfljzwdywg.supabase.co',
              port: '',
              pathname: '/storage/v1/object/public/meal-images/**',
              search: '',
            },
          ],
        },
      }  

  
//   module.exports = nextConfig;
