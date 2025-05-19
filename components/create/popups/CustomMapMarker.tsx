import { Marker } from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React from 'react';
import Image from 'next/image';


const CustomMapMarker: React.FC<{ post: Contentable }> = ({ post }) => {

  let imageSRC;
  if (post.pinCategory) {
    imageSRC = `/assets/images/pin-${post.pinCategory}-${post.pinType}.png`
  } else if (post.planCategory) {
    imageSRC = `/assets/images/plan-${post.planCategory}-${post.planType}`
  } else {
    imageSRC = ''
  }

  return (
    <Marker
      latitude={post.latitude as number}
      longitude={post.longitude as number}
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
