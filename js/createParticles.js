function createParticles(vertices) {
  // create the particle variables
  var particle = new THREE.Geometry;

  particles.push(particle);
  particleIndex++;

  var color = 0xffffff*Math.random();
  oldColors[particleIndex] = color;

  // create the particle variables
  var pMaterial = new THREE.PointsMaterial({
    color: color,
    size: 2,
    map: THREE.ImageUtils.loadTexture(
      "textures/particleTexture2.png"
    ),
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaTest: 0.8
  });

  // now create the individual particles
  var distance = Math.ceil(Math.random() * 20 + 40);
  var num = Math.floor(Math.random() * num_shapes);
  var offset = pickStartShape(num, vertices, distance);

  // create the particle system
  var particleSystem = new THREE.Points(
      particle,
      pMaterial);

  particleSystem.sortParticles = true;

  particleSystem.position.set(offset[0], offset[1], offset[2]);

  // add it to the scene
  scene.add(particleSystem);

  particleSystems.push(particleSystem);

  console.log(particleSystem);
}


function startWithCircle(vertices, distance) {
  for (var p = 0; p < particleCount; p++) {

    var particle = new THREE.Vector3();

    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    particle.x = distance * Math.sin(theta) * Math.cos(phi);
    particle.y = distance * Math.sin(theta) * Math.sin(phi) + 20;
    particle.z = distance * Math.cos(theta);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(0, 0, 0);

    // add it to the geometry
    particles[particleIndex].vertices.push(particle);
  }

  return [vertices[0], vertices[1], vertices[2]]; // x, y, z offset
}

function startWithCylinder(vertices, distance) {
  for (var p = 0; p < particleCount; p++) {

    var particle = new THREE.Vector3();

    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    particle.x = distance * Math.sin(theta) * Math.cos(phi);
    particle.y = Math.random() * 30;
    particle.z = distance * Math.cos(theta);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(0, 0, 0);

    // add it to the geometry
    particles[particleIndex].vertices.push(particle);
  }

  return [vertices[0], vertices[1], vertices[2]]; // x, y, z offset
}

function startWithSquare(vertices, distance) {
  for (var p = 0; p < particleCount; p++) {

    var pX = Math.random() * distance - distance/2,
        pY = Math.random() * distance,
        pZ = Math.random() * distance - distance/2,
        particle = new THREE.Vector3(pX, pY, pZ);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(0, 0, 0);

    // add it to the geometry
    particles[particleIndex].vertices.push(particle);
  }

  return [vertices[0], vertices[1], vertices[2]]; // x, y, z offset
}

function startWithTriangle(vertices, distance) {
  for (var p = 0; p < particleCount; p++) {

    var pX = (Math.random() * distance*2) - distance,
        pZ = (Math.random() * distance*2) - distance,
        pY = Math.random() * ((distance - Math.abs(pX)) + (distance - Math.abs(pZ)));

    var particle = new THREE.Vector3(pX, pY, pZ);

    // create a velocity vector
    particle.velocity = new THREE.Vector3(0, 0, 0);

    // add it to the geometry
    particles[particleIndex].vertices.push(particle);
  }

  return [vertices[0], vertices[1], vertices[2]]; // x, y, z offset
}

function goToSquare(distance) {
  var p = 0;

  var initArr = false;
  if (newVelocity.length === 0) {
    initArr = true;
  }

  while (p < particleCount) {

    var pX = Math.random() * distance - distance/2,
        pY = Math.random() * distance,
        pZ = Math.random() * distance - distance/2;

    var particle =
      particles[particleIndex].vertices[p];

    if (initArr) {
      newVelocity.push([(pX-particle.x)/steps, (pY-particle.y)/steps, (pZ-particle.z)/steps]);
    }
    particle.velocity.setX(newVelocity[p][0]);
    particle.velocity.setY(newVelocity[p][1]);
    particle.velocity.setZ(newVelocity[p][2]);

    // and the position
    particle.add(
      particle.velocity);

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;
    p++;
  }

  var pos = startLocations[particleIndex];
  particleSystems[particleIndex].position.set(pos[0], pos[1], pos[2]);

  particleSystems[particleIndex].
  geometry.
  __dirtyVertices = true;
}


function goToCircle(distance) {
  var p = 0;

  var initArr = false;
  if (newVelocity.length === 0) {
    initArr = true;
  }

  while (p < particleCount) {
    var particle =
      particles[particleIndex].vertices[p];

    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    var pX = distance * Math.sin(theta) * Math.cos(phi);
    var pY = distance * Math.sin(theta) * Math.sin(phi) + 20;
    var pZ = distance * Math.cos(theta);

    if (initArr) {
      newVelocity.push([(pX-particle.x)/steps, (pY-particle.y)/steps, (pZ-particle.z)/steps]);
    }
    particle.velocity.setX(newVelocity[p][0]);
    particle.velocity.setY(newVelocity[p][1]);
    particle.velocity.setZ(newVelocity[p][2]);

    // and the position
    particle.add(
      particle.velocity);

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;
    p++;
  }

  var pos = startLocations[particleIndex];
  particleSystems[particleIndex].position.set(pos[0], pos[1], pos[2]);

  particleSystems[particleIndex].
  geometry.
  __dirtyVertices = true;
}

function goToCylinder(distance) {
  var p = 0;

  var initArr = false;
  if (newVelocity.length === 0) {
    initArr = true;
  }

  while (p < particleCount) {
    var particle =
      particles[particleIndex].vertices[p];

    var theta = THREE.Math.randFloatSpread(360);
    var phi = THREE.Math.randFloatSpread(360);

    var pX = distance * Math.sin(theta) * Math.cos(phi);
    var pY = Math.random() * 30;
    var pZ = distance * Math.cos(theta);

    if (initArr) {
      newVelocity.push([(pX-particle.x)/steps, (pY-particle.y)/steps, (pZ-particle.z)/steps]);
    }
    particle.velocity.setX(newVelocity[p][0]);
    particle.velocity.setY(newVelocity[p][1]);
    particle.velocity.setZ(newVelocity[p][2]);

    // and the position
    particle.add(
      particle.velocity);

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;
    p++;
  }

  var pos = startLocations[particleIndex];
  particleSystems[particleIndex].position.set(pos[0], pos[1], pos[2]);

  particleSystems[particleIndex].
  geometry.
  __dirtyVertices = true;
}

function goToTriangle(distance) {
  var p = 0;

  var initArr = false;
  if (newVelocity.length === 0) {
    initArr = true;
  }

  while (p < particleCount) {
    var particle =
      particles[particleIndex].vertices[p];

    var pX = (Math.random() * distance*2) - distance,
        pZ = (Math.random() * distance*2) - distance,
        pY = Math.random() * ((distance - Math.abs(pX)) + (distance - Math.abs(pZ)));

    if (initArr) {
      newVelocity.push([(pX-particle.x)/steps, (pY-particle.y)/steps, (pZ-particle.z)/steps]);
    }
    particle.velocity.setX(newVelocity[p][0]);
    particle.velocity.setY(newVelocity[p][1]);
    particle.velocity.setZ(newVelocity[p][2]);

    // and the position
    particle.add(
      particle.velocity);

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;
    p++;
  }
  var pos = startLocations[particleIndex];
  particleSystems[particleIndex].position.set(pos[0], pos[1], pos[2]);

  particleSystems[particleIndex].
  geometry.
  __dirtyVertices = true;
}

function stopAnimation() {
  for (var p = 0; p < particleCount; p++) {

    var particle =
      particles[particleIndex].vertices[p];

    particle.velocity.setX(0);
    particle.velocity.setY(0);
    particle.velocity.setZ(0);

    // and the position
    particle.add(
      particle.velocity);

    particleSystems[particleIndex].geometry.verticesNeedUpdate = true;
  }

  newVelocity = [];

  particleSystems[particleIndex].
  geometry.
  __dirtyVertices = true;
}

function pickStartShape(num, vertices, distance) {
  if (num == 0) {
    return startWithSquare(vertices, distance);
  } else if (num == 1) {
    return startWithCircle(vertices, distance/2);
  } else if (num == 2) {
    return startWithTriangle(vertices, distance*0.75);
  } else if (num == 3) {
    return startWithCylinder(vertices, distance/2)
  }
}
