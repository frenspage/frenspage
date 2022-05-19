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
    images: {
        domains: [
            "frenspage-assets-dev.s3.eu-central-1.amazonaws.com",
            "frenspage-assets-prod.s3.eu-central-1.amazonaws.com",
        ],
    },
};
