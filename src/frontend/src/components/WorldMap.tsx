import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Flag emoji from ISO 2-letter country code
function countryFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

interface CountryLabel {
  id: string;
  name: string;
  lat: number; // degrees
  lon: number; // degrees
}

const COUNTRY_LABELS: CountryLabel[] = [
  { id: "US", name: "United States", lat: 38, lon: -97 },
  { id: "CA", name: "Canada", lat: 56, lon: -106 },
  { id: "MX", name: "Mexico", lat: 23, lon: -102 },
  { id: "BR", name: "Brazil", lat: -14, lon: -51 },
  { id: "AR", name: "Argentina", lat: -38, lon: -63 },
  { id: "CO", name: "Colombia", lat: 4, lon: -74 },
  { id: "CL", name: "Chile", lat: -35, lon: -71 },
  { id: "VE", name: "Venezuela", lat: 8, lon: -66 },
  { id: "GB", name: "United Kingdom", lat: 55, lon: -3 },
  { id: "FR", name: "France", lat: 46, lon: 2 },
  { id: "DE", name: "Germany", lat: 51, lon: 10 },
  { id: "ES", name: "Spain", lat: 40, lon: -4 },
  { id: "IT", name: "Italy", lat: 42, lon: 12 },
  { id: "PT", name: "Portugal", lat: 39, lon: -8 },
  { id: "SE", name: "Sweden", lat: 62, lon: 15 },
  { id: "NO", name: "Norway", lat: 60, lon: 8 },
  { id: "FI", name: "Finland", lat: 64, lon: 26 },
  { id: "PL", name: "Poland", lat: 52, lon: 20 },
  { id: "UA", name: "Ukraine", lat: 49, lon: 32 },
  { id: "RU", name: "Russia", lat: 60, lon: 100 },
  { id: "TR", name: "Turkey", lat: 39, lon: 35 },
  { id: "SA", name: "Saudi Arabia", lat: 24, lon: 45 },
  { id: "AE", name: "UAE", lat: 24, lon: 54 },
  { id: "IR", name: "Iran", lat: 32, lon: 53 },
  { id: "PK", name: "Pakistan", lat: 30, lon: 69 },
  { id: "IN", name: "India", lat: 20, lon: 78 },
  { id: "CN", name: "China", lat: 35, lon: 104 },
  { id: "JP", name: "Japan", lat: 36, lon: 138 },
  { id: "KR", name: "South Korea", lat: 36, lon: 128 },
  { id: "ID", name: "Indonesia", lat: -5, lon: 120 },
  { id: "AU", name: "Australia", lat: -27, lon: 133 },
  { id: "NZ", name: "New Zealand", lat: -42, lon: 174 },
  { id: "ZA", name: "South Africa", lat: -29, lon: 25 },
  { id: "NG", name: "Nigeria", lat: 10, lon: 8 },
  { id: "EG", name: "Egypt", lat: 27, lon: 30 },
  { id: "ET", name: "Ethiopia", lat: 8, lon: 38 },
  { id: "KE", name: "Kenya", lat: -1, lon: 37 },
  { id: "GH", name: "Ghana", lat: 8, lon: -2 },
  { id: "MA", name: "Morocco", lat: 32, lon: -6 },
  { id: "TH", name: "Thailand", lat: 15, lon: 101 },
  { id: "VN", name: "Vietnam", lat: 14, lon: 108 },
  { id: "PH", name: "Philippines", lat: 13, lon: 122 },
  { id: "MY", name: "Malaysia", lat: 2, lon: 112 },
  { id: "SG", name: "Singapore", lat: 1, lon: 104 },
  { id: "BD", name: "Bangladesh", lat: 24, lon: 90 },
  { id: "IQ", name: "Iraq", lat: 33, lon: 44 },
  { id: "AF", name: "Afghanistan", lat: 33, lon: 65 },
  { id: "KZ", name: "Kazakhstan", lat: 48, lon: 68 },
  { id: "UZ", name: "Uzbekistan", lat: 41, lon: 64 },
  { id: "CU", name: "Cuba", lat: 22, lon: -80 },
  { id: "MG", name: "Madagascar", lat: -19, lon: 47 },
];

function latLonToXYZ(
  lat: number,
  lon: number,
  radius: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

interface Popup {
  id: string;
  name: string;
  x: number;
  y: number;
}

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<Popup | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const animRef = useRef<number>(0);
  const rotationRef = useRef({ y: 0, x: 0.2 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const RADIUS = 180;
    let width = container.clientWidth;
    let height = Math.min(width * 0.65, 460);

    canvas.width = width;
    canvas.height = height;

    // Load earth texture via fetch + draw on offscreen canvas
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const tctx = textureCanvas.getContext("2d");

    // Draw procedural earth-like texture
    const drawEarth = () => {
      if (!tctx) return;
      // Ocean base
      tctx.fillStyle = "#0a1628";
      tctx.fillRect(0, 0, 2048, 1024);

      // Simple land masses drawn as polygons on equirectangular projection
      tctx.fillStyle = "#1a3a2a";

      // North America
      tctx.beginPath();
      tctx.moveTo(220, 180);
      tctx.lineTo(420, 160);
      tctx.lineTo(480, 200);
      tctx.lineTo(490, 280);
      tctx.lineTo(440, 340);
      tctx.lineTo(380, 370);
      tctx.lineTo(320, 360);
      tctx.lineTo(260, 330);
      tctx.lineTo(220, 280);
      tctx.closePath();
      tctx.fill();

      // Mexico/Central America
      tctx.beginPath();
      tctx.moveTo(320, 360);
      tctx.lineTo(380, 355);
      tctx.lineTo(390, 400);
      tctx.lineTo(360, 430);
      tctx.lineTo(330, 420);
      tctx.lineTo(310, 390);
      tctx.closePath();
      tctx.fill();

      // South America
      tctx.beginPath();
      tctx.moveTo(360, 440);
      tctx.lineTo(460, 420);
      tctx.lineTo(490, 470);
      tctx.lineTo(500, 560);
      tctx.lineTo(480, 640);
      tctx.lineTo(440, 700);
      tctx.lineTo(400, 710);
      tctx.lineTo(370, 680);
      tctx.lineTo(350, 600);
      tctx.lineTo(340, 520);
      tctx.lineTo(345, 460);
      tctx.closePath();
      tctx.fill();

      // Europe
      tctx.beginPath();
      tctx.moveTo(870, 160);
      tctx.lineTo(960, 140);
      tctx.lineTo(1020, 165);
      tctx.lineTo(1040, 210);
      tctx.lineTo(1000, 250);
      tctx.lineTo(950, 260);
      tctx.lineTo(900, 245);
      tctx.lineTo(870, 220);
      tctx.closePath();
      tctx.fill();

      // British Isles
      tctx.beginPath();
      tctx.moveTo(840, 160);
      tctx.lineTo(860, 150);
      tctx.lineTo(870, 170);
      tctx.lineTo(855, 185);
      tctx.lineTo(840, 178);
      tctx.closePath();
      tctx.fill();

      // Scandinavia
      tctx.beginPath();
      tctx.moveTo(920, 100);
      tctx.lineTo(980, 85);
      tctx.lineTo(1000, 110);
      tctx.lineTo(990, 155);
      tctx.lineTo(960, 165);
      tctx.lineTo(930, 150);
      tctx.closePath();
      tctx.fill();

      // Africa
      tctx.beginPath();
      tctx.moveTo(880, 270);
      tctx.lineTo(1000, 255);
      tctx.lineTo(1060, 290);
      tctx.lineTo(1090, 380);
      tctx.lineTo(1080, 470);
      tctx.lineTo(1050, 550);
      tctx.lineTo(1000, 610);
      tctx.lineTo(960, 640);
      tctx.lineTo(920, 620);
      tctx.lineTo(890, 560);
      tctx.lineTo(870, 470);
      tctx.lineTo(860, 380);
      tctx.closePath();
      tctx.fill();

      // Madagascar
      tctx.beginPath();
      tctx.moveTo(1095, 470);
      tctx.lineTo(1110, 460);
      tctx.lineTo(1120, 490);
      tctx.lineTo(1115, 530);
      tctx.lineTo(1098, 535);
      tctx.lineTo(1090, 505);
      tctx.closePath();
      tctx.fill();

      // Middle East
      tctx.beginPath();
      tctx.moveTo(1040, 250);
      tctx.lineTo(1130, 240);
      tctx.lineTo(1170, 270);
      tctx.lineTo(1180, 320);
      tctx.lineTo(1150, 350);
      tctx.lineTo(1090, 355);
      tctx.lineTo(1045, 330);
      tctx.lineTo(1038, 285);
      tctx.closePath();
      tctx.fill();

      // Russia / Central Asia
      tctx.beginPath();
      tctx.moveTo(1000, 100);
      tctx.lineTo(1500, 75);
      tctx.lineTo(1560, 110);
      tctx.lineTo(1580, 165);
      tctx.lineTo(1520, 210);
      tctx.lineTo(1400, 230);
      tctx.lineTo(1250, 240);
      tctx.lineTo(1150, 235);
      tctx.lineTo(1060, 200);
      tctx.lineTo(1020, 155);
      tctx.closePath();
      tctx.fill();

      // India
      tctx.beginPath();
      tctx.moveTo(1200, 260);
      tctx.lineTo(1270, 255);
      tctx.lineTo(1295, 295);
      tctx.lineTo(1290, 360);
      tctx.lineTo(1255, 400);
      tctx.lineTo(1225, 410);
      tctx.lineTo(1200, 380);
      tctx.lineTo(1192, 320);
      tctx.closePath();
      tctx.fill();

      // China / East Asia
      tctx.beginPath();
      tctx.moveTo(1280, 180);
      tctx.lineTo(1480, 165);
      tctx.lineTo(1510, 210);
      tctx.lineTo(1500, 270);
      tctx.lineTo(1440, 310);
      tctx.lineTo(1360, 320);
      tctx.lineTo(1290, 305);
      tctx.lineTo(1270, 260);
      tctx.lineTo(1278, 210);
      tctx.closePath();
      tctx.fill();

      // Japan
      tctx.beginPath();
      tctx.moveTo(1530, 210);
      tctx.lineTo(1560, 195);
      tctx.lineTo(1575, 220);
      tctx.lineTo(1565, 250);
      tctx.lineTo(1540, 260);
      tctx.lineTo(1525, 240);
      tctx.closePath();
      tctx.fill();

      // Southeast Asia
      tctx.beginPath();
      tctx.moveTo(1340, 330);
      tctx.lineTo(1450, 320);
      tctx.lineTo(1480, 360);
      tctx.lineTo(1470, 410);
      tctx.lineTo(1430, 430);
      tctx.lineTo(1390, 420);
      tctx.lineTo(1350, 390);
      tctx.lineTo(1335, 360);
      tctx.closePath();
      tctx.fill();

      // Indonesia
      tctx.beginPath();
      tctx.moveTo(1400, 450);
      tctx.lineTo(1550, 435);
      tctx.lineTo(1600, 460);
      tctx.lineTo(1590, 490);
      tctx.lineTo(1480, 500);
      tctx.lineTo(1400, 490);
      tctx.closePath();
      tctx.fill();

      // Australia
      tctx.beginPath();
      tctx.moveTo(1460, 520);
      tctx.lineTo(1640, 505);
      tctx.lineTo(1700, 545);
      tctx.lineTo(1695, 640);
      tctx.lineTo(1640, 690);
      tctx.lineTo(1560, 700);
      tctx.lineTo(1490, 670);
      tctx.lineTo(1455, 610);
      tctx.lineTo(1450, 560);
      tctx.closePath();
      tctx.fill();

      // New Zealand
      tctx.beginPath();
      tctx.moveTo(1740, 660);
      tctx.lineTo(1770, 645);
      tctx.lineTo(1785, 670);
      tctx.lineTo(1775, 700);
      tctx.lineTo(1748, 705);
      tctx.lineTo(1738, 685);
      tctx.closePath();
      tctx.fill();

      // Greenland
      tctx.beginPath();
      tctx.moveTo(660, 80);
      tctx.lineTo(790, 65);
      tctx.lineTo(820, 110);
      tctx.lineTo(800, 160);
      tctx.lineTo(750, 175);
      tctx.lineTo(690, 165);
      tctx.lineTo(655, 130);
      tctx.closePath();
      tctx.fill();

      // Add highlight/coastal shading
      const gradient = tctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
      gradient.addColorStop(0, "rgba(30,80,50,0.1)");
      gradient.addColorStop(1, "rgba(0,20,40,0.3)");
      tctx.fillStyle = gradient;
      tctx.fillRect(0, 0, 2048, 1024);
    };

    drawEarth();

    const globeScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 440;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Globe sphere
    const geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0x1a4060),
      shininess: 15,
      emissive: new THREE.Color(0x050f18),
      emissiveIntensity: 0.3,
    });
    const globe = new THREE.Mesh(geometry, material);
    globeScene.add(globe);

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(RADIUS * 1.05, 16, 16);
    const atmMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0a3060),
      transparent: true,
      opacity: 0.12,
      side: THREE.FrontSide,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    globeScene.add(atmosphere);

    // Graticule (lat/lon grid lines)
    const graticuleGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1e4a6a,
      transparent: true,
      opacity: 0.3,
    });
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 3) {
        const [x, y, z] = latLonToXYZ(lat, lon - 180, RADIUS + 0.5);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      graticuleGroup.add(new THREE.Line(geo, lineMat));
    }
    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        const [x, y, z] = latLonToXYZ(lat, lon - 180, RADIUS + 0.5);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      graticuleGroup.add(new THREE.Line(geo, lineMat));
    }
    globeScene.add(graticuleGroup);

    // Country dot markers
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(2, 6, 6);
    for (const c of COUNTRY_LABELS) {
      const [x, y, z] = latLonToXYZ(c.lat, c.lon, RADIUS + 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
      const dot = new THREE.Mesh(dotGeo, mat);
      dot.position.set(x, y, z);
      dot.userData = { country: c };
      dotGroup.add(dot);
    }
    globeScene.add(dotGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x334466, 0.8);
    globeScene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(400, 200, 300);
    globeScene.add(sunLight);
    const rimLight = new THREE.DirectionalLight(0x0055aa, 0.4);
    rimLight.position.set(-300, -100, -200);
    globeScene.add(rimLight);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getCanvasPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
        px: clientX - rect.left,
        py: clientY - rect.top,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      autoRotateRef.current = false;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.003;
      rotationRef.current.x = Math.max(
        -1.2,
        Math.min(1.2, rotationRef.current.x),
      );
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      // Re-enable auto-rotate after 3s
      setTimeout(() => {
        autoRotateRef.current = true;
      }, 3000);

      // Check for click on dot
      const pos = getCanvasPos(e);
      mouse.set(pos.x, pos.y);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(dotGroup.children);
      if (hits.length > 0) {
        const c = hits[0].object.userData.country as CountryLabel;
        setPopup({ id: c.id, name: c.name, x: pos.px, y: pos.py });
        hoveredIdRef.current = c.id;
      } else {
        setPopup(null);
        hoveredIdRef.current = null;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Label canvas setup
    const labelCanvas = labelCanvasRef.current;
    let labelCtx: CanvasRenderingContext2D | null = null;
    if (labelCanvas) {
      labelCanvas.width = width;
      labelCanvas.height = height;
      labelCtx = labelCanvas.getContext("2d");
    }

    // Animate
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      if (autoRotateRef.current) {
        rotationRef.current.y += 0.003;
      }
      globe.rotation.y = rotationRef.current.y;
      globe.rotation.x = rotationRef.current.x;
      graticuleGroup.rotation.y = rotationRef.current.y;
      graticuleGroup.rotation.x = rotationRef.current.x;
      dotGroup.rotation.y = rotationRef.current.y;
      dotGroup.rotation.x = rotationRef.current.x;

      // Highlight hovered dot
      for (const child of dotGroup.children) {
        const mesh = child as THREE.Mesh<
          THREE.SphereGeometry,
          THREE.MeshBasicMaterial
        >;
        const c = mesh.userData.country as CountryLabel;
        if (hoveredIdRef.current === c.id) {
          mesh.material.color.set(0xff4444);
          mesh.scale.setScalar(1.8);
        } else {
          mesh.material.color.set(0x00d4ff);
          mesh.scale.setScalar(1);
        }
      }

      renderer.render(globeScene, camera);

      // Draw country name labels on overlay canvas
      if (labelCtx && labelCanvas) {
        labelCtx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
        const tempV = new THREE.Vector3();

        for (const country of COUNTRY_LABELS) {
          const [x3, y3, z3] = latLonToXYZ(
            country.lat,
            country.lon,
            RADIUS + 3,
          );
          tempV.set(x3, y3, z3);

          // Apply globe rotation
          const rotQuat = new THREE.Quaternion();
          rotQuat.setFromEuler(
            new THREE.Euler(rotationRef.current.x, rotationRef.current.y, 0),
          );
          tempV.applyQuaternion(rotQuat);

          // Only show labels on the visible face (positive z towards camera)
          if (tempV.z < 20) continue;

          // Project to screen
          const projected = tempV.clone().project(camera);
          const px = ((projected.x + 1) / 2) * labelCanvas.width;
          const py = ((-projected.y + 1) / 2) * labelCanvas.height;

          const isHovered = hoveredIdRef.current === country.id;
          const alpha = Math.min(1, (tempV.z - 20) / 80);

          // Draw label
          labelCtx.save();
          labelCtx.globalAlpha = alpha * (isHovered ? 1 : 0.7);
          labelCtx.font = isHovered
            ? "bold 11px sans-serif"
            : "10px sans-serif";
          const metrics = labelCtx.measureText(country.name);
          const tw = metrics.width + 8;
          const th = 16;
          const tx = px - tw / 2;
          const ty = py + 10;

          // Background pill
          labelCtx.fillStyle = isHovered
            ? "rgba(0, 212, 255, 0.25)"
            : "rgba(10, 20, 40, 0.65)";
          labelCtx.strokeStyle = isHovered
            ? "rgba(0, 212, 255, 0.8)"
            : "rgba(0, 180, 220, 0.35)";
          labelCtx.lineWidth = isHovered ? 1.5 : 0.8;
          labelCtx.beginPath();
          labelCtx.roundRect(tx, ty, tw, th, 4);
          labelCtx.fill();
          labelCtx.stroke();

          // Text
          labelCtx.fillStyle = isHovered ? "#00d4ff" : "#a0d8ef";
          labelCtx.textAlign = "center";
          labelCtx.fillText(country.name, px, ty + 11);
          labelCtx.restore();
        }
      }
    };
    animate();

    // Resize
    const handleResize = () => {
      width = container.clientWidth;
      height = Math.min(width * 0.65, 460);
      canvas.width = width;
      canvas.height = height;
      if (labelCanvas) {
        labelCanvas.width = width;
        labelCanvas.height = height;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mt-16 relative"
    >
      {/* Section Label */}
      <div className="text-center mb-8">
        <span className="inline-block text-sm font-mono font-semibold text-cyan uppercase tracking-widest mb-3">
          Global Reach
        </span>
        <h3 className="font-display font-black text-3xl sm:text-4xl mb-2">
          ClawPro Works{" "}
          <span className="text-cyan text-glow-cyan">Worldwide</span>
        </h3>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Click any dot to confirm ClawPro is available in that country. Drag to
          rotate.
        </p>
      </div>

      {/* Globe Container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-border bg-[oklch(0.06_0.015_240)] overflow-hidden"
        style={{ minHeight: 320 }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.35_0.12_210_/_10%),transparent_70%)] pointer-events-none" />

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full block cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          />
          {/* Label overlay canvas */}
          <canvas
            ref={labelCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Popup */}
        <AnimatePresence>
          {popup && (
            <motion.div
              key={`popup-${popup.id}`}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-20 pointer-events-none"
              style={{
                left: Math.min(
                  popup.x,
                  (containerRef.current?.clientWidth ?? 400) - 160,
                ),
                top: Math.max(popup.y - 100, 8),
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="rounded-xl px-4 py-3 text-center min-w-[140px]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.02 240), oklch(0.11 0.018 240))",
                  border: "1px solid oklch(0.55 0.18 190 / 60%)",
                  boxShadow:
                    "0 8px 28px oklch(0 0 0 / 70%), 0 0 20px oklch(0.55 0.18 190 / 25%)",
                }}
              >
                <div className="text-3xl mb-1">{countryFlag(popup.id)}</div>
                <p className="text-sm font-bold text-[oklch(0.92_0.05_210)] leading-tight">
                  {popup.name}
                </p>
                <p className="text-[11px] text-cyan mt-1 font-semibold">
                  ✓ ClawPro available!
                </p>
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3.5 h-3.5 rotate-45"
                style={{
                  background: "oklch(0.11 0.018 240)",
                  borderRight: "1px solid oklch(0.55 0.18 190 / 60%)",
                  borderBottom: "1px solid oklch(0.55 0.18 190 / 60%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            🌍{" "}
            <span className="text-cyan font-semibold">
              {COUNTRY_LABELS.length}+
            </span>{" "}
            countries supported
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            Drag to rotate · Click dot to explore
          </p>
        </div>
      </div>
    </motion.div>
  );
}
