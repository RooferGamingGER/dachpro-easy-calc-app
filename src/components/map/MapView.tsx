import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Polygon } from "react-leaflet";
import { FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Project, Coordinates, GeoPolygon } from "@/types";
import { calculatePolygonArea } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createControlComponent } from "@react-leaflet/core";

// Create a custom EditControl component since react-leaflet-draw has issues
// This is a wrapper around the L.Control.Draw from leaflet-draw
const createEditControl = (props: any) => {
  const { position, onCreated, draw, edit } = props;
  
  const DrawControl = L.Control.extend({
    options: {
      position: position || 'topright',
      draw: draw,
      edit: edit
    },
    
    onAdd: function(map: L.Map) {
      const container = L.DomUtil.create('div');
      
      // Initialize the Leaflet.draw plugin
      const drawControl = new L.Control.Draw(this.options);
      map.addControl(drawControl);
      
      // Handle draw events
      map.on(L.Draw.Event.CREATED, (e) => {
        if (onCreated) onCreated(e);
      });
      
      return container;
    }
  });
  
  return new DrawControl();
};

// Create a React component from our custom control
const EditControl = createControlComponent(createEditControl);

// Fix the Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to automatically center map on coordinates
const SetViewOnLoad = ({ coordinates }: { coordinates: Coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([coordinates.lat, coordinates.lng], 18);
  }, [coordinates, map]);
  
  return null;
};

interface MapViewProps {
  project: Project;
  onPolygonSave: (polygon: GeoPolygon) => void;
}

export const MapView: React.FC<MapViewProps> = ({ project, onPolygonSave }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    project.coordinates || null
  );
  const [polygon, setPolygon] = useState<L.LatLng[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  
  useEffect(() => {
    // Set polygon from project data if it exists
    if (project.roofPolygon?.points && project.roofPolygon.points.length > 0) {
      const points = project.roofPolygon.points.map(
        point => new L.LatLng(point.lat, point.lng)
      );
      setPolygon(points);
    }
  }, [project.roofPolygon]);

  // Type declaration for the event from EditControl
  interface EditControlEvent {
    layer: L.Layer;
    layerType: string;
    layers: L.LayerGroup;
  }

  const handleCreated = (e: EditControlEvent) => {
    const { layer } = e;
    
    if (layer instanceof L.Polygon) {
      // Extract coordinates from the drawn polygon
      const latLngs = layer.getLatLngs()[0] as L.LatLng[];
      
      // Calculate area
      const points = latLngs.map(latlng => ({
        lat: latlng.lat,
        lng: latlng.lng
      }));
      
      const area = calculatePolygonArea(points);
      
      // Save polygon data
      onPolygonSave({
        points,
        area
      });
      
      setPolygon(latLngs);
      
      // Clear other drawn layers
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
        // Add back the polygon
        L.polygon(latLngs).addTo(featureGroupRef.current);
      }
    }
  };

  if (!coordinates) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-md">
        <p className="text-center">
          Keine Koordinaten verfügbar. Die Adresse konnte nicht georeferenziert werden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] rounded-md overflow-hidden border">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          <SetViewOnLoad coordinates={coordinates} />
          
          <Marker position={[coordinates.lat, coordinates.lng]} />
          
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: '#e1e100',
                    message: '<strong>Polygon Fehler:</strong> Selbstüberschneidungen nicht erlaubt!'
                  },
                  shapeOptions: {
                    color: '#3388ff',
                    fillOpacity: 0.2
                  }
                }
              }}
            />
            {polygon.length > 0 && (
              <Polygon positions={polygon} />
            )}
          </FeatureGroup>
        </MapContainer>
      </div>
      
      {project.roofPolygon?.area && (
        <div className="p-4 bg-dachpro-blue-light/10 rounded-md">
          <p className="font-semibold">
            Dachfläche: {project.roofPolygon.area.toFixed(2)} m²
          </p>
          <p className="text-sm text-muted-foreground">
            Zeichnen Sie ein neues Polygon, um die Fläche neu zu berechnen.
          </p>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p>Verwenden Sie die Zeichenwerkzeuge auf der rechten Seite der Karte, um die Dachfläche einzuzeichnen.</p>
      </div>
    </div>
  );
};
