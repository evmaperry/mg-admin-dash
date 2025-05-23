import { uploadFileS3 } from '@/actions';
import { User } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { Post } from 'mgtypes/types/Content';
import { addPostToDb } from '@/actions';
import { createClient } from '@/utils/supabase/client';
import { App } from 'mgtypes/types/App';

export const createPost = async (
  file: File,
  post: Post,
  postType: 'pin' | 'plan' | 'route',
  user: User,
  appId: number
): Promise<number> => {
  const fileId = nanoid();
  const key = `${user.id}/${appId}/${fileId}`;
  // Add the image to s3

  let s3Res;
  try {
    const data = new FormData();
    data.append('file', file);

    s3Res = await uploadFileS3({
      key,
      content: data,
    });
    console.log('***s3 res***', s3Res);
  } catch (e) {
    console.error('POPUP ACTIONS ERROR: failed to add image to s3', e);
  }

  // Add the pin to supabase with s3
  // key saved as imageURL
  let supabaseRes = null;
  try {
    supabaseRes = await addPostToDb(
      postType,
      { ...post, photoURL: key },
      appId
    );
    console.log('supabase res', supabaseRes);
  } catch (e) {
    console.error('POPUP ACTIONS ERROR: failed to add post to db', e);
  }

  // supabase Res returns as array from .select('id')
  // there will only ever be one item in the data property
  const contentId: number = supabaseRes?.data?.[0].id;
  return contentId;
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
  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = `.json?proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}`;
  try {
    address = address.replaceAll(' ', '%20');
    const apiUrl = apiUrlBeginning + address + apiUrlEnd;
    const coordinateResponse: any = await axios
      .get(apiUrl)
      .catch((error: Error) => console.error('Axios API call error:', error));
    const coordinates = coordinateResponse.data.features[0].center;
    return coordinates;
  } catch (err) {
    console.error(
      "SERVER ERROR: failed to 'POST' new coordinates from address",
      err
    );
  }
};

export const getMapMarkersFromDb = async (appId: number) => {
  try {
    const supabaseClient = await createClient();
    const pins = await supabaseClient
      .from('pins')
      .select()
      .eq('appId', appId)
      .then((res) => res.data as any[]);

    return { pins, routes: [], plans: [], structures: [], areas: [] };
  } catch (e: any) {
    console.error('CREATE ACTIONS ERROR: failed to get markers from DB');
    return e;
  }
};

/**
 * Gets all apps owned by the user
 */
export const getUserAppsFromDb = async (userId: string) => {
  try {
    const supabaseClient = await createClient();
    const userApps = await supabaseClient
      .from('apps')
      .select()
      .eq('userId', userId)
      .then((res) => res.data);
    console.log('userApps', userApps);
    return userApps;
  } catch (e) {
    console.error('CREATE ACTIONS ERROR: failed to get user apps from db', e);
    return e;
  }
};

/**
 * Gets ALL data for an app that a user is working on
 * */
export const getAppInfoFromDb = async (appId: number) => {
  try {
    const supabaseClient = await createClient();
    const app = await supabaseClient
      .from('apps')
      .select(
        `
        eventName,
        appName,
        startDateTime,
        endDateTime,
        eventLongitude,
        eventLatitude,
        mapLabels,
        mapStyleUrl,
        appColors,
        pins (
          id,
          primaryText,
          secondaryText,
          latitude,
          longitude,
          pinCategory,
          pinType,
          address,
          photoURL
        )
        `
      )
      .eq('id', appId)
      .then((res) => res.data);
    return app?.[0];
  } catch (e) {
    console.error('CREATE ACTIONS ERROR: failed to get app info from db', e);
  }
};

/**
 * Saves updated app, for saving appDetails and colors
 */
export const updateAppInDb = async (
  appId: number,
  partialApp: Partial<App>
) => {
  try {
    const supabaseClient = await createClient();
    const { data, error } = await supabaseClient
      .from('apps')
      .update(partialApp)
      .eq('id', appId)
      .select();
    console.log('data', data);
    return data;
  } catch (e) {
    console.error('CREATE ACTIONS ERROR: failed to update app in db', e);
    return e;
  }
};
