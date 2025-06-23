import {
  Marker,
  MarkerDragEvent,
  MarkerEvent,
  Layer,
  LineLayerSpecification,
  Source,
} from 'react-map-gl/mapbox';
import { Contentable, Post } from 'mgtypes/types/Content';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FeatureCollection, Position } from 'geojson';
import { CircleDot, Dot, X } from 'lucide-react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { cn } from '@/lib/utils';

const MapRouteMarker: React.FC<{ post: Partial<Contentable> }> = ({ post }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<Position[]>([]);

  const { moveCoordinate, selectedMarkerType } = useCreateAppStore(
    (state) => state
  );

  const handleRouteMarkerDrag = (e: MarkerDragEvent, index: number) => {
    console.log('moving event', e, 'index', index);

    const coords = [e.lngLat.lng, e.lngLat.lat];

    // if it's saved to db
    if (post.id) {
      // update coordinate it in store
      moveCoordinate('route', post.id, index, coords);
    }
  };

  // Load the coords from the stored route into state
  useEffect(() => {
    setRouteCoordinates(post.coordinates as Position[]);
  }, [post]);

  const RouteStart: React.FC<{ coordinates: Position }> = ({ coordinates }) => {
    const startingImageSRC = `/assets/images/route-${post.routeCategory}-start.png`;
    return (
      <Marker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        draggable={'route' === selectedMarkerType}
        onDragEnd={(e: MarkerDragEvent) => handleRouteMarkerDrag(e, 0)}
      >
        {startingImageSRC && (
          <Image
            src={startingImageSRC}
            height={'route' === selectedMarkerType ? 48 : 36}
            width={'route' === selectedMarkerType ? 48 : 36}
            alt={'Pin image'}
            className={cn(
              'border border-neutral-500 rounded-full p-[2px] bg-background',
              'route' === selectedMarkerType ? 'border-2' : ''
            )}
          />
        )}
      </Marker>
    );
  };

  const RouteFinish: React.FC<{ coordinates: Position }> = ({
    coordinates,
  }) => {
    const finishImageSRC = `/assets/images/route-${post.routeCategory}-finish.png`;
    return (
      <Marker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        draggable={'route' === selectedMarkerType}
        onDragEnd={(e: MarkerDragEvent) => {
          handleRouteMarkerDrag(e, routeCoordinates.length - 1);
        }}
      >
        <Image
          src={finishImageSRC}
          height={'route' === selectedMarkerType ? 48 : 36}
          width={'route' === selectedMarkerType ? 48 : 36}
          alt={'Pin image'}
          className={cn(
            'border border-neutral-500 rounded-full p-[2px] bg-background',
            'route' === selectedMarkerType ? 'border-2' : ''
          )}
        />
      </Marker>
    );
  };

  const RouteTurn: React.FC<{ coordinates: Position; index: number }> = ({
    coordinates,
    index,
  }) => {
    return (
      <Marker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        draggable={'route' === selectedMarkerType}
        onDragEnd={(e) => {
          handleRouteMarkerDrag(e, index + 1); // b/c we are slicing off the start
        }}
      >
        <div
          style={{
            height: 'route' === selectedMarkerType ? 24 : 16,
            width: 'route' === selectedMarkerType ? 24 : 16,
            backgroundColor: post.color,
            borderRadius: '100%',
          }}
        />
      </Marker>
    );
  };

  const PathLine: React.FC<{}> = () => {
    return (
      <>
        {routeCoordinates.map((curCoords, index, array) => {
          // if we are at or before second to last coordinate pair in the array
          if (index < array.length - 1) {
            const coords = [array[index], array[index + 1]];

            return (
              <Source
                key={`key-route-${post.id}-line-${index + 1}-source`}
                id={`route-${post.id}-line-${index + 1}-source`}
                type='geojson'
                data={{
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'LineString',
                        coordinates: coords as Position[],
                      },
                      properties: {},
                    },
                  ],
                }}
              >
                <Layer
                  type={'line'}
                  paint={{
                    'line-color': post.color,
                    'line-width': 'route' === selectedMarkerType ? 6 : 4,
                    'line-opacity': 'route' === selectedMarkerType ? 0.7 : 0.5,
                  }}
                  id={`route-${post.id}-line-${index + 1}-layer`}
                />
              </Source>
            );
          }
        })}
      </>
    );
  };

  return (
    <>
      {/* Starting point */}
      {routeCoordinates[0] && <RouteStart coordinates={routeCoordinates[0]} />}

      {/* Turns */}
      {routeCoordinates.length > 2 &&
        routeCoordinates
          .slice(1, routeCoordinates.length - 1)
          .map((coordinate: Position, index: number) => {
            return (
              <RouteTurn
                coordinates={coordinate}
                key={`route-turn-${index}`}
                index={index}
              />
            );
          })}

      {/* Ending point */}
      {routeCoordinates.length > 1 && (
        <RouteFinish
          coordinates={routeCoordinates[routeCoordinates.length - 1]}
        />
      )}

      {/* Path Line */}
      {routeCoordinates.length > 1 && <PathLine />}
    </>
  );
};

export default MapRouteMarker;
