// Define maximum particles and trail count
const MAX_PARTICLE_COUNT = 70;
const MAX_TRAIL_COUNT = 30;

// Color scheme and shading options
var colorScheme = ["#F781D8", "#BA55D3", "#DDA0DD", "#DA70D6", "#FF00FF"];
var shaded = true; // Initial shading state
var theShader; // Shader variable
var shaderTexture; // Texture to apply shader

// Initialize trail and particles arrays
var trail = [];
var particles = [];

// Preload the shader
function preload() {
  // Create a new shader using the provided vertex and fragment shader code
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);
}

// Setup the canvas and shader texture
function setup() {
  pixelDensity(1); // Set the pixel density
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL); // Create canvas with WebGL renderer
  canvas.canvas.oncontextmenu = () => false; // Removes right-click menu
  noCursor(); // Hide the cursor
  shaderTexture = createGraphics(width, height, WEBGL); // Create a graphics object for the shader texture
  shaderTexture.noStroke(); // Don't apply a stroke to the shader texture
}

// Main draw loop
function draw() {
  background(0); // Set the background to black
  noStroke(); // Don't apply a stroke to the main canvas

  // Update trail with current mouse position
  trail.push([mouseX, mouseY]);

  let removeCount = 1; // Initialize the number of points to remove from the trail
  if (mouseIsPressed && mouseButton == CENTER) {
    removeCount++; // Increase the remove count if the center mouse button is pressed
  }

  // Remove trail points
  for (let i = 0; i < removeCount; i++) {
    if (trail.length == 0) {
      break; // If the trail is empty, stop the loop
    }

    // If the mouse is pressed or the trail length is greater than the maximum trail count
    if (mouseIsPressed || trail.length > MAX_TRAIL_COUNT) {
      trail.splice(0, 1); // Remove the oldest point from the trail
    }
  }

  // Add particles
  if (trail.length > 1 && particles.length < MAX_PARTICLE_COUNT) {
    let mouse = new p5.Vector(mouseX, mouseY); // Create a vector from the current mouse position
    mouse.sub(pmouseX, pmouseY);
    if (mouse.mag() > 10) { // If the mouse moved more than 10 pixels
      mouse.normalize(); // Normalize the mouse vector
      particles.push(new Particle(pmouseX, pmouseY, mouse.x, mouse.y)); // Add a new particle at the previous mouse position with the mouse direction
    }
  }

  // Move the origin to the center of the canvas
  translate(-width / 2, -height / 2);

  // Update and remove particles
  for (let i = particles.length - 1; i > -1; i--) {
    particles[i].move(); // Move the particle
    if (particles[i].vel.mag() < 0.1) { // If the particle speed is less than 0.1
      particles.splice(i, 1); // Remove the particle
    }
  }

  // Display trail and particles with shader
  if (shaded) {
    shaderTexture.shader(theShader); // Set the shader to use
    let data = serializeSketch(); // Serialize the sketch data

    // Set uniform values to be used in the shader
    theShader.setUniform("resolution", [width, height]); // Set resolution
    theShader.setUniform("trailCount", trail.length); // Set trail count
    theShader.setUniform("trail", data.trails); // Set trail data
    theShader.setUniform("particleCount", particles.length); // Set particle count
    theShader.setUniform("particles", data.particles); // Set particle data
    theShader.setUniform("colors", data.colors); // Set color data

    shaderTexture.rect(0, 0, width, height); // Draw a rectangle over the entire shader texture
    texture(shaderTexture); // Apply the shader texture

    rect(0, 0, width, height); // Draw a rectangle over the entire canvas
  } else {
    // Display particles without shader
    stroke(255, 105, 180); // Set the stroke color to pink
    for (let i = 0; i < particles.length; i++) {
      point(particles[i].pos.x, particles[i].pos.y); // Draw a point at each particle's position
    }

    // Display trail without shader
    stroke(147, 112, 219); // Set the stroke color to purple
    for (let i = 0; i < trail.length; i++) {
      point(trail[i][0], trail[i][1]); // Draw a point at each trail position
    }
  }
}

// Toggle shader on right mouse button
function mousePressed() {
    if (mouseButton == RIGHT) {
    shaded = !shaded; // Toggle shaded state
  }
}

// Serialize sketch data
function serializeSketch() {
  data = { "trails": [], "particles": [], "colors": [] }; // Initialize serialized data

  // Serialize trail data
  for (let i = 0; i < trail.length; i++) {
    data.trails.push(
      map(trail[i][0], 0, width, 0.0, 1.0),
      map(trail[i][1], 0, height, 1.0, 0.0));
  }

  // Serialize particle data
  for (let i = 0; i < particles.length; i++) {
    data.particles.push(
      map(particles[i].pos.x, 0, width, 0.0, 1.0),
      map(particles[i].pos.y, 0, height, 1.0, 0.0),
      particles[i].mass * particles[i].vel.mag() / 100)

    // Serialize particle colors
    let itsColor = colorScheme[particles[i].colorIndex];
    data.colors.push(red(itsColor), green(itsColor), blue(itsColor));
  }

  return data; // Return the serialized data
}

// Particle class
  function Particle(x, y, vx, vy) {
    this.pos = createVector(x, y); // Set the particle's position
    this.vel = createVector(vx, vy); // Set the particle's velocity
    this.vel.mult(random(10)); // Multiply the particle's velocity by a random number between 0 and 10
    this.vel.rotate(radians(random(-25, 25))); // Rotate the particle's velocity by a random angle between -25 and 25 degrees
    this.mass = random(1, 20); // Set the particle's mass to a random value between 1 and 20
    this.airDrag = random(0.92, 0.98); // Set the particle's air drag to a random value between 0.92 and 0.98
    this.colorIndex = int(random(colorScheme.length)); // Set the particle's color index to a random index of the color scheme

// Define the move function for the particle
    this.move = function() {
      this.vel.mult(this.airDrag); // Apply air drag to the velocity
      this.pos.add(this.vel); // Add the velocity to the position to move the particle;
  }
}

// Vertex shader code
let vertShader = `
  precision highp float;

  attribute vec3 aPosition;

  void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
  }
`;

// Fragment shader code
let fragShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform int trailCount;
  uniform vec2 trail[${MAX_TRAIL_COUNT}];
  uniform int particleCount;
  uniform vec3 particles[${MAX_PARTICLE_COUNT}];
  uniform vec3 colors[${MAX_PARTICLE_COUNT}];

  void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;

    float r = 0.0;
    float g = 0.0;
    float b = 0.0;

    for (int i = 0; i < ${MAX_TRAIL_COUNT}; i++) {
      if (i < trailCount) {
        vec2 trailPos = trail[i];
        float value = float(i) / distance(st, trailPos.xy) * 0.00015;
        r += value * 0.5;
        b += value;
      }
    }

    float mult = 0.00005;

    for (int i = 0; i < ${MAX_PARTICLE_COUNT}; i++) {
      if (i < particleCount) {
        vec3 particle = particles[i];
        vec2 pos = particle.xy;
        float mass = particle.z;
        vec3 color = colors[i];

                r += color.r / distance(st, pos) * mult * mass;
        g += color.g / distance(st, pos) * mult * mass;
        b += color.b / distance(st, pos) * mult * mass;
      }
    }

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

// Resize canvas and shader texture on window resize
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Resize the canvas to the new window dimensions
    shaderTexture = createGraphics(width, height, WEBGL); // Recreate the shader texture with the new dimensions
    shaderTexture.noStroke(); // Remove the stroke from the shader texture
}


