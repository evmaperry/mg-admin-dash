'use server';

import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import {
  getSignedUrl,
  S3RequestPresigner,
} from '@aws-sdk/s3-request-presigner';
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || '',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   },
// })
const s3Client = new S3Client({
      region: process.env.AWS_REGION || '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

export const uploadFileS3 = async ({
  route,
  fileName,
  content,
}: {
  route: String;
  fileName: String;
  content: FormData;
}) => {
  try {
    let file = content.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!file) throw 'No se encontro el archivo para subir.';



    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: `${route}/${fileName}`,

      ContentType: 'image/*',
      Body: buffer,
    });

    const response = await s3Client.send(command);

    console.log('uploadFile response', response);
    return {
      ok: response.$metadata.httpStatusCode === 200,
    };
  } catch (error) {
    console.trace(error);
    return {
      ok: false,
    };
  }
};

export const createPresignedUrlWithClient = async ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
