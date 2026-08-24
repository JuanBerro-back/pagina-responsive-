/* ============================================================
  CAMINO DE COMBATE 3D — THREE.JS
  Adaptación de Crossy Road para "Kill la Kill"
   ============================================================ */

(function initCrossyGame() {
  function start() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js aún no está cargado, reintentando...");
      setTimeout(start, 100);
      return;
    }

    const container = document.getElementById("crossyGameWrap");
    const canvas = document.getElementById("crossyCanvas");
    const scoreDOM = document.getElementById("crossyScore");
    const resultDOM = document.getElementById("crossyResult");
    const finalScoreDOM = document.getElementById("crossyFinalScore");
    const retryBtn = document.getElementById("crossyRetry");

    if (!container || !canvas) return;

    const minTileIndex = -7;
    const maxTileIndex = 7;
    const tilesPerRow = maxTileIndex - minTileIndex + 1;
    const tileSize = 42;

    let scene, camera, renderer, dirLight;
    const map = new THREE.Group();
    const metadata = [];
    const movesQueue = [];
    const position = { currentRow: 0, currentTile: 0 };
    let isGameOver = false;

    // Texturas de vehículos con estética retro de combate
    function createTexture(width, height, rects) {
      const cvs = document.createElement("canvas");
      cvs.width = width;
      cvs.height = height;
      const ctx = cvs.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      rects.forEach(r => ctx.fillRect(r.x, r.y, r.w, r.h));
      return new THREE.CanvasTexture(cvs);
    }

    const carFrontTexture = createTexture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
    const carBackTexture = createTexture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
    const carRightSideTexture = createTexture(110, 40, [{ x: 10, y: 0, w: 50, h: 30 }, { x: 70, y: 0, w: 30, h: 30 }]);
    const carLeftSideTexture = createTexture(110, 40, [{ x: 10, y: 10, w: 50, h: 30 }, { x: 70, y: 10, w: 30, h: 30 }]);
    const truckFrontTexture = createTexture(30, 30, [{ x: 5, y: 0, w: 10, h: 30 }]);
    const truckRightSideTexture = createTexture(25, 30, [{ x: 15, y: 5, w: 10, h: 10 }]);
    const truckLeftSideTexture = createTexture(25, 30, [{ x: 15, y: 15, w: 10, h: 10 }]);

    function Wheel(x) {
      const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x1a1a1a, flatShading: true })
      );
      wheel.position.x = x;
      wheel.position.z = 6;
      return wheel;
    }

    function Car(initialTileIndex, direction, color) {
      const car = new THREE.Group();
      car.position.x = initialTileIndex * tileSize;
      if (!direction) car.rotation.z = Math.PI;

      const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color, flatShading: true })
      );
      main.position.z = 12;
      main.castShadow = true;
      main.receiveShadow = true;
      car.add(main);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carBackTexture }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carFrontTexture }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carRightSideTexture }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carLeftSideTexture }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true })
      ]);
      cabin.position.x = -6;
      cabin.position.z = 25.5;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      car.add(cabin);

      car.add(Wheel(18));
      car.add(Wheel(-18));
      return car;
    }

    function Truck(initialTileIndex, direction, color) {
      const truck = new THREE.Group();
      truck.position.x = initialTileIndex * tileSize;
      if (!direction) truck.rotation.z = Math.PI;

      const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(70, 35, 35),
        new THREE.MeshLambertMaterial({ color: 0x2e354f, flatShading: true })
      );
      cargo.position.x = -15;
      cargo.position.z = 25;
      cargo.castShadow = true;
      cargo.receiveShadow = true;
      truck.add(cargo);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), [
        new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckFrontTexture }),
        new THREE.MeshLambertMaterial({ color, flatShading: true }),
        new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckLeftSideTexture }),
        new THREE.MeshLambertMaterial({ color, flatShading: true, map: truckRightSideTexture }),
        new THREE.MeshPhongMaterial({ color, flatShading: true }),
        new THREE.MeshPhongMaterial({ color, flatShading: true })
      ]);
      cabin.position.x = 35;
      cabin.position.z = 20;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      truck.add(cabin);

      truck.add(Wheel(37));
      truck.add(Wheel(5));
      truck.add(Wheel(-35));
      return truck;
    }

    function Tree(tileIndex, height) {
      const tree = new THREE.Group();
      tree.position.x = tileIndex * tileSize;

      const trunk = new THREE.Mesh(
        new THREE.BoxGeometry(14, 14, 20),
        new THREE.MeshLambertMaterial({ color: 0x4a2e21, flatShading: true })
      );
      trunk.position.z = 10;
      tree.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(28, 28, height),
        new THREE.MeshLambertMaterial({ color: 0x2e7f54, flatShading: true })
      );
      crown.position.z = height / 2 + 20;
      crown.castShadow = true;
      crown.receiveShadow = true;
      tree.add(crown);
      return tree;
    }

    function Grass(rowIndex) {
      const grass = new THREE.Group();
      grass.position.y = rowIndex * tileSize;

      const createSection = (color) =>
        new THREE.Mesh(
          new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3),
          new THREE.MeshLambertMaterial({ color })
        );

      const middle = createSection(0x234d36);
      middle.receiveShadow = true;
      grass.add(middle);

      const left = createSection(0x183726);
      left.position.x = -tilesPerRow * tileSize;
      grass.add(left);

      const right = createSection(0x183726);
      right.position.x = tilesPerRow * tileSize;
      grass.add(right);

      return grass;
    }

    function Road(rowIndex) {
      const road = new THREE.Group();
      road.position.y = rowIndex * tileSize;

      const createSection = (color) =>
        new THREE.Mesh(
          new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
          new THREE.MeshLambertMaterial({ color })
        );

      const middle = createSection(0x282b34);
      middle.receiveShadow = true;
      road.add(middle);

      const left = createSection(0x1f2128);
      left.position.x = -tilesPerRow * tileSize;
      road.add(left);

      const right = createSection(0x1f2128);
      right.position.x = tilesPerRow * tileSize;
      road.add(right);

      return road;
    }

    function createPlayer() {
      const pGroup = new THREE.Group();

      // Voxel del personaje
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(16, 16, 22),
        new THREE.MeshLambertMaterial({ color: 0xfaf5eb, flatShading: true })
      );
      body.position.z = 11;
      body.castShadow = true;
      body.receiveShadow = true;
      pGroup.add(body);

      const containerP = new THREE.Group();
      containerP.add(pGroup);
      return containerP;
    }

    const player = createPlayer();
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, 15),
      new THREE.MeshLambertMaterial({ color: 0x7c28d8, emissive: 0x24103f, emissiveIntensity: 0.6, flatShading: true })
    );
    stand.position.set(14, 0, 18);
    stand.visible = false;
    player.add(stand);

    window.addEventListener("battle-theme-change", (event) => {
      const jojoMode = event.detail?.theme === "jojo";
      stand.visible = jojoMode;
      stand.material.color.setHex(jojoMode ? 0x7c28d8 : 0xf21d3b);
    });

    function randomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateForestMetadata() {
      const occupied = new Set();
      const trees = Array.from({ length: 4 }, () => {
        let tileIndex;
        do {
          tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        } while (occupied.has(tileIndex));
        occupied.add(tileIndex);
        return { tileIndex, height: randomElement([22, 44, 60]) };
      });
      return { type: "forest", trees };
    }

    function generateCarLaneMetadata() {
      const direction = randomElement([true, false]);
      const speed = randomElement([130, 165, 195]);
      const occupied = new Set();
      const vehicles = Array.from({ length: 3 }, () => {
        let initialTileIndex;
        do {
          initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        } while (occupied.has(initialTileIndex));
        occupied.add(initialTileIndex - 1);
        occupied.add(initialTileIndex);
        occupied.add(initialTileIndex + 1);

        const color = randomElement([0xff3d5f, 0xf2bb13, 0x00d2b4]);
        return { initialTileIndex, color };
      });
      return { type: "car", direction, speed, vehicles };
    }

    function generateTruckLaneMetadata() {
      const direction = randomElement([true, false]);
      const speed = randomElement([120, 150, 180]);
      const occupied = new Set();
      const vehicles = Array.from({ length: 2 }, () => {
        let initialTileIndex;
        do {
          initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        } while (occupied.has(initialTileIndex));
        occupied.add(initialTileIndex - 2);
        occupied.add(initialTileIndex - 1);
        occupied.add(initialTileIndex);
        occupied.add(initialTileIndex + 1);
        occupied.add(initialTileIndex + 2);

        const color = randomElement([0xff3d5f, 0xf2bb13, 0x8a45a3]);
        return { initialTileIndex, color };
      });
      return { type: "truck", direction, speed, vehicles };
    }

    function generateRow() {
      const type = randomElement(["car", "truck", "forest"]);
      if (type === "car") return generateCarLaneMetadata();
      if (type === "truck") return generateTruckLaneMetadata();
      return generateForestMetadata();
    }

    function addRows(amount = 20) {
      const newMetadata = Array.from({ length: amount }, () => generateRow());
      const startIndex = metadata.length;
      metadata.push(...newMetadata);

      newMetadata.forEach((rowData, index) => {
        const rowIndex = startIndex + index + 1;

        if (rowData.type === "forest") {
          const row = Grass(rowIndex);
          rowData.trees.forEach(({ tileIndex, height }) => {
            row.add(Tree(tileIndex, height));
          });
          map.add(row);
        } else if (rowData.type === "car") {
          const row = Road(rowIndex);
          rowData.vehicles.forEach(vehicle => {
            const car = Car(vehicle.initialTileIndex, rowData.direction, vehicle.color);
            vehicle.ref = car;
            row.add(car);
          });
          map.add(row);
        } else if (rowData.type === "truck") {
          const row = Road(rowIndex);
          rowData.vehicles.forEach(vehicle => {
            const truck = Truck(vehicle.initialTileIndex, rowData.direction, vehicle.color);
            vehicle.ref = truck;
            row.add(truck);
          });
          map.add(row);
        }
      });
    }

    function initializeMap() {
      metadata.length = 0;
      map.remove(...map.children);
      for (let r = 0; r > -10; r--) {
        map.add(Grass(r));
      }
      addRows(25);
    }

    function initializePlayer() {
      player.position.x = 0;
      player.position.y = 0;
      player.children[0].position.z = 0;
      player.children[0].rotation.z = 0;
      position.currentRow = 0;
      position.currentTile = 0;
      movesQueue.length = 0;
      isGameOver = false;
    }

    function calculateFinalPosition(currentPos, moves) {
      return moves.reduce((pos, dir) => {
        if (dir === "forward") return { rowIndex: pos.rowIndex + 1, tileIndex: pos.tileIndex };
        if (dir === "backward") return { rowIndex: pos.rowIndex - 1, tileIndex: pos.tileIndex };
        if (dir === "left") return { rowIndex: pos.rowIndex, tileIndex: pos.tileIndex - 1 };
        if (dir === "right") return { rowIndex: pos.rowIndex, tileIndex: pos.tileIndex + 1 };
        return pos;
      }, currentPos);
    }

    function endsUpInValidPosition(currentPos, moves) {
      const finalPos = calculateFinalPosition(currentPos, moves);
      if (finalPos.rowIndex === -1 || finalPos.tileIndex === minTileIndex - 1 || finalPos.tileIndex === maxTileIndex + 1) {
        return false;
      }
      const finalRow = metadata[finalPos.rowIndex - 1];
      if (finalRow && finalRow.type === "forest" && finalRow.trees.some(t => t.tileIndex === finalPos.tileIndex)) {
        return false;
      }
      return true;
    }

    function queueMove(dir) {
      if (isGameOver) return;
      if (!endsUpInValidPosition({ rowIndex: position.currentRow, tileIndex: position.currentTile }, [...movesQueue, dir])) {
        return;
      }
      movesQueue.push(dir);
    }

    function stepCompleted() {
      const dir = movesQueue.shift();
      if (dir === "forward") position.currentRow += 1;
      if (dir === "backward") position.currentRow -= 1;
      if (dir === "left") position.currentTile -= 1;
      if (dir === "right") position.currentTile += 1;

      if (position.currentRow > metadata.length - 10) addRows(15);
      if (scoreDOM) scoreDOM.innerText = position.currentRow.toString();
    }

    const moveClock = new THREE.Clock(false);
    function animatePlayer() {
      if (!movesQueue.length) return;
      if (!moveClock.running) moveClock.start();

      const stepTime = 0.18;
      const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

      const startX = position.currentTile * tileSize;
      const startY = position.currentRow * tileSize;
      let endX = startX;
      let endY = startY;

      if (movesQueue[0] === "left") endX -= tileSize;
      if (movesQueue[0] === "right") endX += tileSize;
      if (movesQueue[0] === "forward") endY += tileSize;
      if (movesQueue[0] === "backward") endY -= tileSize;

      player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
      player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
      player.children[0].position.z = Math.sin(progress * Math.PI) * 9;

      let endRotation = 0;
      if (movesQueue[0] === "forward") endRotation = 0;
      if (movesQueue[0] === "left") endRotation = Math.PI / 2;
      if (movesQueue[0] === "right") endRotation = -Math.PI / 2;
      if (movesQueue[0] === "backward") endRotation = Math.PI;

      player.children[0].rotation.z = THREE.MathUtils.lerp(player.children[0].rotation.z, endRotation, progress);

      if (progress >= 1) {
        stepCompleted();
        moveClock.stop();
      }
    }

    const vehicleClock = new THREE.Clock();
    function animateVehicles() {
      const delta = vehicleClock.getDelta();
      metadata.forEach(rowData => {
        if (rowData.type === "car" || rowData.type === "truck") {
          const beginningOfRow = (minTileIndex - 2) * tileSize;
          const endOfRow = (maxTileIndex + 2) * tileSize;
          rowData.vehicles.forEach(({ ref }) => {
            if (!ref) return;
            if (rowData.direction) {
              ref.position.x = ref.position.x > endOfRow ? beginningOfRow : ref.position.x + rowData.speed * delta;
            } else {
              ref.position.x = ref.position.x < beginningOfRow ? endOfRow : ref.position.x - rowData.speed * delta;
            }
          });
        }
      });
    }

    function hitTest() {
      if (isGameOver) return;
      const row = metadata[position.currentRow - 1];
      if (!row || (row.type !== "car" && row.type !== "truck")) return;

      const playerBox = new THREE.Box3().setFromObject(player);
      row.vehicles.forEach(({ ref }) => {
        if (!ref) return;
        const vehicleBox = new THREE.Box3().setFromObject(ref);
        if (playerBox.intersectsBox(vehicleBox)) {
          isGameOver = true;
          if (resultDOM) resultDOM.hidden = false;
          if (finalScoreDOM) finalScoreDOM.innerText = position.currentRow.toString();
        }
      });
    }

    // Three.js Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.add(player);
    scene.add(map);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(-100, -100, 200);
    dirLight.up.set(0, 0, 1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.target = player;
    player.add(dirLight);

    function getContainerDimensions() {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 520;
      return { width, height };
    }

    function updateCameraAspect() {
      const { width, height } = getContainerDimensions();
      const size = 320;
      const ratio = width / height;
      const w = ratio < 1 ? size : size * ratio;
      const h = ratio < 1 ? size / ratio : size;

      if (!camera) {
        camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 100, 900);
        camera.up.set(0, 0, 1);
        camera.position.set(300, -300, 300);
        camera.lookAt(0, 0, 0);
        player.add(camera);
      } else {
        camera.left = w / -2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = h / -2;
        camera.updateProjectionMatrix();
      }
    }

    updateCameraAspect();

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    const isCompactScreen = window.matchMedia("(max-width: 640px)").matches;
    renderer.setPixelRatio(isCompactScreen ? 1 : Math.min(window.devicePixelRatio, 2));
    const { width: initW, height: initH } = getContainerDimensions();
    renderer.setSize(initW, initH);
    renderer.shadowMap.enabled = !isCompactScreen;

    function onResize() {
      if (!container || !renderer) return;
      const { width, height } = getContainerDimensions();
      updateCameraAspect();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", onResize);

    function initializeGame() {
      initializePlayer();
      initializeMap();
      if (scoreDOM) scoreDOM.innerText = "0";
      if (resultDOM) resultDOM.hidden = true;
    }

    initializeGame();
    retryBtn?.addEventListener("click", initializeGame);

    // Botones de control
    document.getElementById("crossyForward")?.addEventListener("click", () => queueMove("forward"));
    document.getElementById("crossyBackward")?.addEventListener("click", () => queueMove("backward"));
    document.getElementById("crossyLeft")?.addEventListener("click", () => queueMove("left"));
    document.getElementById("crossyRight")?.addEventListener("click", () => queueMove("right"));

    // Teclado
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        queueMove("forward");
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        queueMove("backward");
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        queueMove("left");
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        queueMove("right");
      }
    });

    // Render loop
    renderer.setAnimationLoop(() => {
      animateVehicles();
      animatePlayer();
      hitTest();
      renderer.render(scene, camera);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
