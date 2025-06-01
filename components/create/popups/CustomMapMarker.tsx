import { Marker, MarkerDragEvent, MarkerEvent } from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React, { useState } from 'react';
import Image from 'next/image';

const CustomMapMarker: React.FC<{ post: Contentable }> = ({ post }) => {
  let imageSRC;
  if (post.pinCategory) {
    imageSRC = `/assets/images/pin-${post.pinCategory}-${post.pinType}.png`;
  } else if (post.planCategory) {
    imageSRC = `/assets/images/plan-${post.planCategory}-${post.planType}`;
  } else {
    imageSRC = '';
  }

  const [coordinates, setCoordinates] = useState<{
    longitude: number | undefined;
    latitude: number | undefined;
  }>({ longitude: undefined, latitude: undefined });

  return (
    <Marker
      latitude={
        coordinates.latitude ? coordinates.latitude : (post.latitude as number)
      }
      longitude={
        coordinates.longitude
          ? coordinates.longitude
          : (post.longitude as number)
      }
      draggable={true}
      onDrag={(e: MarkerDragEvent) => {
        setCoordinates({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
      }}
      onClick={(e:MarkerEvent<MouseEvent>) => {
        
      }}
    >
      <Image
        src={imageSRC}
        height={36}
        width={36}
        alt={'Pin image'}
        className={
          'border border-neutral-500 rounded-full p-[2px] bg-background'
        }
      />
    </Marker>
  );
};

export default CustomMapMarker;
