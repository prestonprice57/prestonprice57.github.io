function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  element = renderer.domElement;

  container = document.getElementById('container');
  container.appendChild(element);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.01, 3000);
  camera.position.set(0, 10, 0);
  scene.add(camera);

  effect = new THREE.StereoEffect(renderer);

  var material	= new THREE.MeshBasicMaterial({ color: 0x333333 });
  var planeGeometry	= new THREE.PlaneGeometry( 2000, 2000 );
  var plane	= new THREE.Mesh( planeGeometry, material );

  plane.rotation.x= - 90 * Math.PI / 180;
  scene.add( plane );

  createParticles(startLocations[0]);
  createParticles(startLocations[1]);
  createParticles(startLocations[2]);
  createParticles(startLocations[3]);
  createParticles(startLocations[4]);
  createParticles(startLocations[5]);
  createParticles(startLocations[6]);
  createParticles(startLocations[7]);

  controls = new THREE.OrbitControls(camera, element);
  controls.target.set(
    camera.position.x,
    camera.position.y,
    camera.position.z + 90 * Math.PI / 180
  );
  controls.enablePan = false;
  controls.enableZoom = false;


  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.autoForward = false;
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);
}

function update(dt) {
  camera.updateProjectionMatrix();

  // if (!isRearranging) {
  var dir = camera.getWorldDirection();
  dir.setY(dir.y+(rayDir*neg));
  rayDir = (rayDir + 0.05) % 0.5;
  neg = -neg;


  raycaster.set( camera.getWorldPosition(), dir );
  // raycaster.set( camera.position, vector.sub(camera.position).normalize() );
  scene.updateMatrixWorld();
  raycaster.params.Points.threshold = 0.5;
  var intersects = raycaster.intersectObjects( particleSystems );

  for ( var i = 0; i < intersects.length; i++ ) {

    // intersects[ i ].object.material.color.set( 0xffffff*Math.random() );
    // console.log(intersects[i].object);
    isRearranging = true;
    particleIndex = getParticleSystemIndex(intersects[i].object);
  }

  if (isRearranging) {
    // rearrangeParticles();
    if (current === 0) {
      // rotate = false;
      // newColors[particleIndex] = 0xffffff*Math.random();

      size = Math.ceil(Math.random() * 20 + 40);
      shape = Math.floor(Math.random() * num_shapes);
      pickShape(shape, size);
      current++;
    } else if (current !== steps) {
      pickShape(shape, size);
      current++;
    } else {
      // newColors[particleIndex] = oldColors[particleIndex];
      isRearranging = false;
      stopAnimation();
      current = 0;
      // rotate = true;
    }
    // var currentColor = particleSystems[particleIndex].material.color;
    // var newColor = new THREE.Color(newColors[particleIndex]);
    // var oldColor = new THREE.Color(oldColors[particleIndex]);
    // var stepColor = getStepColor(newColor, oldColor);
    //
    // particleSystems[particleIndex].material.color.set( addColors(currentColor, stepColor) );//((newColors[particleIndex]-oldColors[particleIndex])/steps) );

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;

    // flag to the particle system
    // that we've changed its vertices.
    particleSystems[particleIndex].
    geometry.
    __dirtyVertices = true;

  }


  if (rotate === true) {
    for (var i=0; i<particleSystems.length;i++) {
      var particleSystem = particleSystems[i];
      var pos = particleSystem.position.y;
      particleSystem.translateY(-pos);
      particleSystem.rotation.y += 0.01;
      particleSystem.translateY(pos);
    }

  }


  // console.log(intersects[0]);
  // angle +=1;
  // camera.rotation.x = angle * Math.PI/180;
  // camera.updateProjectionMatrix();
  controls.update(dt);
}

function addColors(color1, color2) {
  var r = (color1.r + color2.r);
  var g = (color1.g + color2.g);
  var b = (color1.b + color2.b);

  console.log(r, g, b);

  return new THREE.Color(r, g, b);
}

function getStepColor(oldColor, newColor) {
  var r = (newColor.r-oldColor.r)/steps;
  var g = (newColor.g-oldColor.g)/steps;
  var b = (newColor.b-oldColor.b)/steps;

  return new THREE.Color(r, g, b);
}

function pickShape(shape, size) {
  switch (shape) {
    case 0:
      goToSquare(size);
      break;
    case 1:
      goToCircle(size/2);
      break;
    case 2:
      goToTriangle(size*0.75);
      break;
    case 3:
      goToCylinder(size/2);
      break;
    default:
      break;
  }

}

function getParticleSystemIndex(pSystem) {
  for (var i=0; i<particleSystems.length; i++) {
    if (particleSystems[i].uuid == pSystem.uuid) {
      return i;
    }
  }
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}
