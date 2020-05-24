# 3D-Scene

3D Scene with Moving Objects

Description: This is a 3D scene that was rendered using WebGL coding. It includes a floor layout with 5 moving objects on top of it. The objects are all in 3D as well and they include: Cube, Torus, Sphere, Cylinder, and a Cone. Each object has its own movement in this scene, and except for one. The sphere and cube rotate at their own speeds, the cylinder translates up and down at its own speed, but they cone has its movement fixed to the torus. The cone orbits around the torus. These objects are all taken from an Object Library.

User Controls: This scene was designed to be moved around in. The camera that is looking into this scene is designed to be moved by the user. The controls are:
-Dolly forward and backwards (“W” and “S”)
-Strafe left and right		  (“A” and “D”)
-Move up and down 		  (“I” and “K”)
-Pan left and right		  (“J” and “L”)

Program Matrices: This program uses a set of three different matrices to render this 3D scene. A uniform model matrix to orient the objects in the world. A uniform view matrix, which acts as a camera, and it shows the user what to look at. Lastly, a uniform project matrix that gives a perspective to the 3D scene.

Lighting: This 3D scene also includes diffused lighting. This gives the scene more depth and lighting. Also the lighting comes from the same direction for all the objects so the illuminated side is similar to all the objects.

Key Functions: This program has 3 main functions that are able to render this scene:
-InitWebGL(): Compiles and links the shader programs. It also creates all the objects in the scene.
-bufferCreator(): Creates the buffers for each objects which are: vertex, normal, and index buffers.
-drawModels(): Draw and creates the shapes in the scene. It is responsible for the matrix operations and the movements that the objects follow.
