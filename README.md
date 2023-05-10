# Fireworks

This is a P5.js sketch that simulates a dynamic particle system with a trail effect. The particles and the trail are both affected by the user's mouse movement and button input, and are displayed using a shader effect.

Let's break down the code:

1.	Constants and Variables: The script first declares a series of constants (MAX_PARTICLE_COUNT, MAX_TRAIL_COUNT)
2.	that limit the amount of particles and trail points in the sketch, and some variables that hold the color scheme, the shader,
3.	the shader texture, and the arrays that will store the trail points and particles.

2.	Preload Function: It preloads the vertex and fragment shaders that will be used to display the particles and the trail with
3.	a particular visual effect.

3.	Setup Function: This function initializes the P5.js sketch, creating a canvas that fits the window size, removes the
4.	right-click context menu from the canvas, and sets up the shader texture.

4.	Draw Function: This function runs continuously and updates the state of the sketch. It adds a new point to the trail array
5.	at the current mouse position, removes points from the trail if it's too long or the mouse button is pressed,
6.	creates new particles if the mouse is moving and there's room for more particles,
7.	updates and removes particles as necessary, and then uses the shader to display the particles and the trail,
8.	or just uses regular P5.js drawing functions if the shader is not being used.

5.	Mouse Pressed Function: This function changes the shaded boolean when the right mouse button is clicked, toggling the use
6.	of the shader.

6.	SerializeSketch Function: This function prepares the data for the shader, mapping the trail and particle data to a
7.	range suitable for the shader, and converting the particle colors to RGB values.

7.	Particle Class: This is a class that describes a particle in the system, with properties for its position, velocity, mass,
8.	air drag, and color, and a method for moving the particle.

8.	Vertex and Fragment Shaders: These are the GLSL code for the vertex and fragment shaders, which are used to create a
9.	visual effect for the particles and the trail.

9.	Window Resized Function: This function resizes the canvas and the shader texture when the window size changes,
10.	ensuring the sketch always fits the window.

The particles are created based on mouse movements, and they gradually fade away. The shader provides a unique visual effect
for the particle system and trail. When the right mouse button is clicked, the sketch toggles between using the shader
and using regular P5.js drawing functions to display the particles and the trail. The sketch also supports window resizing,
adjusting its canvas and shader texture accordingly.

In summary, this P5.js script provides an interactive visual effect based on user mouse movements, featuring a particle system
and a trailing effect, all rendered with a shader.

![image](https://github.com/rbbtz/Fireworks/assets/69686526/94110a0e-f58a-4e09-bd96-b7c583d1fe3e)
