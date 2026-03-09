declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    minZoom?: number;
    maxZoom?: number;
    disableZooming?: boolean;
    disablePanning?: boolean;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Geography[] }) => React.ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    id: string | number;
    [key: string]: unknown;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onClick?: (evt: React.MouseEvent) => void;
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onMouseMove?: (evt: React.MouseEvent) => void;
    [key: string]: unknown;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Sphere: React.FC<Record<string, unknown>>;
  export const Graticule: React.FC<Record<string, unknown>>;
  export const Line: React.FC<Record<string, unknown>>;
  export const Annotation: React.FC<Record<string, unknown>>;
  export const MapContext: React.Context<unknown>;
  export const MapProvider: React.FC<{ children?: React.ReactNode }>;
  export const ZoomPanContext: React.Context<unknown>;
  export const ZoomPanProvider: React.FC<{ children?: React.ReactNode }>;
  export function useGeographies(props: { geography: string | object }): { geographies: Geography[] };
  export function useMapContext(): unknown;
  export function useZoomPan(): unknown;
  export function useZoomPanContext(): unknown;
}
