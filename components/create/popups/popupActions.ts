import { uploadFileS3 } from '@/actions';
import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { Post } from 'mgtypes/types/Content';
import { addPostToDb } from '@/actions';
/**
 * Utility function to upload image, video, or
 * and other file to an app draft's s3 bucket and return
 * id of file as its stored in s3
 * @param event input submission event
 * @param user Supabase User
 * @returns nanoid string of image
 */
const handleS3FileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  user: User
) => {
  console.log('event', event);
  try {
    if (event.target.files) {
      const file = event.target.files[0];

      if (response.ok) {
        return fileId;
      } else {
        console.log('There be an error');
      }
    }
  } catch (error) {
    console.error('An error occurred');
  } finally {
  }
};

export const createPost = async (
  file: File,
  post: Post,
  postType: 'pin' | 'plan' | 'route',
  user: User,
  appId: number
) => {

  const fileId = nanoid();
  const key = `${user.id}/${appId}/${fileId}`
  // Add the image to s3
  try {
    const data = new FormData();
    data.append('file', file);

    const res = await uploadFileS3({
      key,
      content: data,
    });
    console.log('s3 res', res)
  } catch (e) {
    console.error('POPUP ACTIONS ERROR: failed to add image to s3', e)
  }

  // Add the pin to supabase with s3
  // key saved as imageURL
  try {
    const res = await addPostToDb(postType, post)
    console.log('supabase res', res)
  } catch (e) {
    console.error('POPUP ACTIONS ERROR: failed to add post to db', e)
  }


};

export const getAddressFromCoordinates = async (
  latitude: string | number,
  longitude: string | number
) => {
  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = `.json?proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}`;
  const coordinateString = `${longitude},${latitude}`;
  const apiUrl = apiUrlBeginning + coordinateString + apiUrlEnd;

  const addressResponse: any = await axios
    .get(apiUrl)
    .catch((error) => console.error(error));
  // console.log('addressFromCoords', addressResponse.data);
  const address =
    addressResponse.data.features[0]?.place_name ||
    'No address for this location';
  return address;
};

export const getCoordinatesFromAddress = async (address: any) => {
  console.log('top og get Coords helper function');
  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = `.json?proximity=ip&access_token=${process.env.MAPBOX_API_TOKEN}`;
  try {
    address = address.replaceAll(' ', '%20');
    console.log('address', address);
    const apiUrl = apiUrlBeginning + address + apiUrlEnd;
    const coordinateResponse: any = await axios
      .get(apiUrl)
      .catch((error: Error) => console.error('Axios API call error:', error));
    const coordinates = coordinateResponse.data.features[0].center;
    console.log('coordinates', coordinates);
    return coordinates;
  } catch (err) {
    console.error(
      "SERVER ERROR: failed to 'POST' new coordinates from address",
      err
    );
  }
};
