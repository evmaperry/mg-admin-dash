import { useCreateAppStore } from '@/providers/create-app-provider';
import { Position } from 'geojson';
import React, { useState, useEffect } from 'react';
import { Layer, Marker, MarkerDragEvent, Source } from 'react-map-gl/mapbox';

interface Structure {
  id: number;
  coordinates: Position[];
  color: string;
}

interface Area {
  id: number;
  coordinates: Position[];
  color: string;
}

const MapGeometryMarker: React.FC<{
  isNew: boolean;
  markerType: 'structure' | 'area';
  multiMarkerBundle: { setNewMultiMarker: any; newMultiMarker: any };
  geometry: Partial<Structure> | Partial<Area>;
}> = ({ isNew, multiMarkerBundle, markerType, geometry }) => {
  const { newMultiMarker, setNewMultiMarker } = multiMarkerBundle;

  const [geometryCoordinates, setGeometryCoordinates] = useState<Position[]>(
    []
  );

  const { moveCoordinate, selectedMarkerType } = useCreateAppStore(
    (state) => state
  );

  const handleDBRouteMarkerDrag = (e: MarkerDragEvent, index: number) => {
    console.log('moving event', e, 'index', index);

    const coords = [e.lngLat.lng, e.lngLat.lat];

    // if it's saved to db
    if (!isNew && geometry) {
      // update coordinate it in store
      moveCoordinate(markerType, geometry.id as number, index, coords);
    }
  };

  const handleNewRouteMarkerDrag = (e: MarkerDragEvent, index: number) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];

    const newCoordinates = newMultiMarker.coordinates.toSpliced(
      index,
      1,
      coords
    );

    setNewMultiMarker({ ...newMultiMarker, coordinates: newCoordinates });
  };

  // Load the coords from the stored route into state
  useEffect(() => {
    geometry && setGeometryCoordinates(geometry.coordinates as Position[]);
  }, [geometry]);

  const GeometryCorner: React.FC<{ coordinates: Position; index: number }> = ({
    coordinates,
    index,
  }) => {
    return (
      <Marker
        longitude={coordinates[0]}
        latitude={coordinates[1]}
        // markerType is a prop from Markers component, 
        // selectedMarker is the marker type clicked on from toggle buttons
        draggable={markerType === selectedMarkerType}
        onDragEnd={(e: MarkerDragEvent) => {
          if (isNew) {
            handleNewRouteMarkerDrag(e, index + 1);
          } else if (isNew === false) {
            handleDBRouteMarkerDrag(e, index + 1);
          }
        }}
      />
    );
  };

  const PathLine: React.FC<{}> = () => {
    return (
      <>
        {geometryCoordinates.map(
          (curCoords: Position, index: number, array: Position[]) => {
            let coords;

            // if we are at or before second to last coordinate pair in the array
            if (index < array.length - 1) {
              coords = [array[index], array[index + 1]];
            } else if (index === array.length - 1) {
              coords = [array[index], array[0]];
            }
            return (
              <Source
                key={`key-${markerType}-${geometry.id}-line-${index + 1}-source`}
                id={`${markerType}-${geometry.id}-line-${index + 1}-source`}
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
                    'line-color': geometry.color,
                    'line-width': ['area', 'structure'].includes(
                      selectedMarkerType as string
                    )
                      ? 6
                      : 4,
                    'line-opacity': ['area', 'structure'].includes(
                      selectedMarkerType as string
                    )
                      ? 0.7
                      : 0.5,
                  }}
                  id={`${markerType}-${geometry.id}-line-${index + 1}-layer`}
                />
              </Source>
            );
          }
        )}
      </>
    );
  };

  // TODO: add geometry plane to color in the area.

  return (
    <>
      {geometryCoordinates.map((coords, index) => {
        return <GeometryCorner coordinates={coords} index={index} />;
      })}

      {geometryCoordinates.length > 1 && <PathLine />}
    </>
  );
};

export default MapGeometryMarker;
