/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/undefined",
                destination: "/",
                permanent: true,
            },
        ];
    },
};
