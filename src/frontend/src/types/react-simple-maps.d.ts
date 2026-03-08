declare module "react-simple-maps" {
  import type { ReactNode, SVGProps } from "react";

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    parallels?: [number, number];
    rotate?: [number, number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (data: {
      coordinates: [number, number];
      zoom: number;
    }) => void;
    onMove?: (data: {
      x: number;
      y: number;
      zoom: number;
      dragging: boolean;
    }) => void;
    onMoveEnd?: (data: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;

  export interface GeoFeature {
    rsmKey: string;
    id: string;
    type: string;
    properties: Record<string, unknown>;
    geometry: Record<string, unknown>;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: GeoFeature[] }) => ReactNode;
    parseGeographies?: (features: object[]) => object[];
  }

  export function Geographies(props: GeographiesProps): JSX.Element;

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoFeature;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onMouseEnter?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onClick?: (evt: React.MouseEvent<SVGPathElement>) => void;
    className?: string;
  }

  export function Geography(props: GeographyProps): JSX.Element;

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    className?: string;
    onClick?: (evt: React.MouseEvent<SVGGElement>) => void;
    onMouseEnter?: (evt: React.MouseEvent<SVGGElement>) => void;
    onMouseLeave?: (evt: React.MouseEvent<SVGGElement>) => void;
  }

  export function Marker(props: MarkerProps): JSX.Element;

  export function Graticule(props: {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    step?: [number, number];
    className?: string;
  }): JSX.Element;

  export function Sphere(props: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    id?: string;
    className?: string;
  }): JSX.Element;
}
