import { Route } from 'mgtypes/types/Content';
import React, { useRef, useState } from 'react';

const RoutePopup: React.FC<{}> = ({}) => {
  const [route, setRoute] = useState<Partial<Route>>({
    routeCategory: '',
    primaryText: '',
    secondaryText: '',
    photoURL: '',
    color: '',
    coordinates: [],
    startTime: '',
    endTime: '',
    link: '',
    phoneNumber: '',
  });

  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  return <div>Routes</div>;
};

export default RoutePopup;
