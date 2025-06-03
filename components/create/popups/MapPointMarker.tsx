import { Marker, MarkerDragEvent, MarkerEvent } from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const MapPointMarker: React.FC<{
  post: Partial<Contentable>;
  [key: string]: any;
}> = ({ post, ...props }) => {
  let imageSRC;
  if (post.pinCategory) {
    imageSRC = `/assets/images/pin-${post.pinCategory}-${post.pinType}.png`;
  } else if (post.planCategory) {
    imageSRC = `/assets/images/plan-${post.planCategory}-${post.planType}`;
  }
  // else if (post.routeCategory) {
  //   imageSRC = `/assets/images/route-${post.routeCategory}-${props.routeStage}`;
  // }
  else {
    imageSRC = undefined;
    console.log('no image source defined')
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
      onClick={(e: MarkerEvent<MouseEvent>) => {}}
    >
      {imageSRC ? <Image
        src={imageSRC}
        height={36}
        width={36}
        alt={'Pin image'}
        className={
          'border border-neutral-500 rounded-full p-[2px] bg-background'
        }
      /> : <X />}
    </Marker>
  );
};

export default MapPointMarker;
