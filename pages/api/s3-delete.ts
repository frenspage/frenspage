import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

type Data = {
    success?: string | boolean;
    error?: string;
    data?: any;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if (req.method === "POST") {
        const { imageUrl, userId } = JSON.parse(req.body);

        console.log("imageUrl: ", imageUrl);
        console.log("userId: ", userId);

        if (imageUrl && userId) {
            try {
                const s3Client = new S3Client({
                    region: process.env.S3_UPLOAD_REGION,
                });

                let nameArray = imageUrl.split(process.env.S3_URL);
                if (nameArray.length > 0) {
                    let name = nameArray[nameArray.length - 1];

                    console.log("name: ", name);

                    const bucketParams = {
                        Bucket: process.env.S3_UPLOAD_BUCKET,
                        Key: name,
                    };

                    const data = await s3Client.send(
                        new DeleteObjectCommand(bucketParams),
                    );

                    console.log("Success. Object deleted.", data);

                    res.status(200).json({ success: true, data: data });
                } else {
                    res.status(400).json({
                        success: false,
                        error: "deleting was not possible",
                    });
                }
            } catch (err) {
                res.status(400).json({
                    success: false,
                    error: "deleting was not possible",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                error: "required body is not defined or null",
            });
        }
    } else {
        res.status(402).json({ success: false, error: "Wrong request method" });
    }
};
