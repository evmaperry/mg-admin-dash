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
import { createClient } from '@/utils/supabase/server';
import { Post } from 'mgtypes/types/Content';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});



export const uploadFileS3 = async ({
  key,
  content,
}: {
  key: string;
  content: FormData;
}) => {
  try {
    let file = content.get('file') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!file) throw 'No se encontro el archivo para subir.';

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || '',
      Key: key,

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

export const addPostToDb = async (
  postType: 'pin' | 'plan' | 'route',
  post: Post
) => {

  const supabaseClient = await createClient();

  const tableName = postType as string + 's'
  console.log('table name', tableName)
  const { data, error } = await supabaseClient
    .from(tableName)
    .insert(post)
    .select();

  return {data, error};
};
