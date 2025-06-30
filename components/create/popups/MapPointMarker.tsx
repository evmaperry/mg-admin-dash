import { Marker, MarkerDragEvent, MarkerEvent } from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { cn } from '@/lib/utils';

const MapPointMarker: React.FC<{
  post: Partial<Contentable>;
  [key: string]: any;
}> = ({ post, ...props }) => {
  const { selectedMarkerType } = useCreateAppStore((state) => state);

  let imageSRC;
  if (post.pinCategory) {
    imageSRC = `/assets/images/markers/pin-${post.pinCategory}-${post.pinType}.png`;
  } else if (post.planCategory) {
    imageSRC = `/assets/images/markers/plan-${post.planCategory}-${post.planType}.png`;
  } else {
    imageSRC = undefined;
    console.log('no image source defined');
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
      draggable={props.contentType === selectedMarkerType}
      onDragEnd={(e: MarkerDragEvent) => {
        setCoordinates({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
      }}
      onClick={(e: MarkerEvent<MouseEvent>) => {}}
    >
      {imageSRC ? (
        <Image
          src={imageSRC}
          height={props.contentType === selectedMarkerType ? 48 : 36}
          width={props.contentType === selectedMarkerType ? 48 : 36}
          alt={'Pin image'}
          className={cn(
            'border border-neutral-500 rounded-full p-[2px] bg-background',
            props.contentType === selectedMarkerType ? 'border-2' : ''
          )}
        />
      ) : (
        <X />
      )}
    </Marker>
  );
};

export default MapPointMarker;
