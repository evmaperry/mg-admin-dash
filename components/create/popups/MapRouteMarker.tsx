import {
  Marker,
  MarkerDragEvent,
  MarkerEvent,
  Layer,
  LineLayerSpecification,
} from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React, { useState } from 'react';
import Image from 'next/image';
import { Position } from 'geojson';

const MapRouteMarker: React.FC<{ post: Contentable }> = ({ post }) => {
  const [coordinates, setCoordinates] = useState<Position[]>([]);

  const RouteStart: React.FC<{ coordinates: Position }> = ({ coordinates }) => {
    return (
      <Marker latitude={coordinates[0]} longitude={coordinates[1]}>
        Start
      </Marker>
    );
  };

  const RouteFinish: React.FC<{ coordinates: Position }> = ({
    coordinates,
  }) => {
    return (
      <Marker latitude={coordinates[0]} longitude={coordinates[1]}>
        End
      </Marker>
    );
  };

  const RouteTurn: React.FC<{ coordinates: Position }> = ({ coordinates }) => {
    return (
      <Marker latitude={coordinates[0]} longitude={coordinates[1]}>
        Point
      </Marker>
    );
  };

  return (
    <>
      {/* Starting point */}
      {coordinates[0] && <RouteStart coordinates={coordinates[0]} />}

      {/* Turns */}
      {coordinates.length > 2 && coordinates.slice(1,-1).map((coordinate:Position, index: number)=>{
        <RouteTurn coordinates={coordinate} key={`route-turn-${index}`}/>
      })}

      {/* Ending point */}
      {coordinates.length > 1 && (
        <RouteFinish coordinates={coordinates[coordinates.length - 1]} />
      )}
    </>
  );
};

export default MapRouteMarker;
