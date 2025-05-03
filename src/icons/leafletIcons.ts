// src/assets/icons/leafletIcons.ts
import L, { Icon } from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
const redIcon: Icon = new L.Icon({
  iconUrl: "/icons/marker-icon-blue.png",
  iconRetinaUrl: "/icons/marker-icon-2x-blue.png",
  shadowUrl: "/icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default redIcon;
