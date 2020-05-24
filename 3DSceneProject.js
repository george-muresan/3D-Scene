
/*
 *****************************************************
 *
 *              Camera() Function
 *
 *****************************************************
*/





class Camera {
    
    delta = 0.15;

    constructor() {
        this.cameraMatrix = glMatrix.mat4.create();
        this.viewDirectionVector = glMatrix.vec3.fromValues(0.0, 0.0, -1.0);
        this.upVector = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
        this.sideVector = glMatrix.vec3.fromValues(1.0, 0.0, 0.0);
        this.targetVector = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
        this.positionVector = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
    }

    moveForward() {
        let deltaForward = glMatrix.vec3.create();
        glMatrix.vec3.scale(deltaForward, this.viewDirectionVector, 0.1);
        glMatrix.vec3.add(this.positionVector, this.positionVector, deltaForward);
        this.updateCameraMatrix();
    }
    moveBackward() {
        let deltaForward = glMatrix.vec3.create();
        glMatrix.vec3.scale(deltaForward, this.viewDirectionVector, 0.1);
        glMatrix.vec3.sub(this.positionVector, this.positionVector, deltaForward);
        this.updateCameraMatrix();
    }
    strafeRight() {
        let newAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.upVector);
        glMatrix.vec3.scale(newAxis, newAxis, this.delta) 
        glMatrix.vec3.add(this.positionVector, this.positionVector, newAxis);
        this.updateCameraMatrix();
    }   
    strafeLeft() {
        let newAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.upVector);
        glMatrix.vec3.scale(newAxis, newAxis, this.delta) 
        glMatrix.vec3.sub(this.positionVector, this.positionVector, newAxis);
        this.updateCameraMatrix();
    }
    moveUp() {
        let newAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.sideVector);
        glMatrix.vec3.scale(newAxis, newAxis, this.delta)
        glMatrix.vec3.sub(this.positionVector, this.positionVector, newAxis);
        this.updateCameraMatrix();
    }
    moveDown() {
        let newAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.sideVector);
        glMatrix.vec3.scale(newAxis, newAxis, this.delta)
        glMatrix.vec3.add(this.positionVector, this.positionVector, newAxis);
        this.updateCameraMatrix();
    }
    panRight() {
        let rotateAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(rotateAxis, this.viewDirectionVector, this.upVector);
        glMatrix.vec3.rotateY(rotateAxis, rotateAxis, [0.0, 1.0, 0.0], this.delta * Math.PI / 180.0);
        glMatrix.vec3.scale(rotateAxis, rotateAxis, this.delta)
        glMatrix.vec3.add(this.viewDirectionVector, this.viewDirectionVector, rotateAxis);
        
        this.updateCameraMatrix();
    }
    panLeft() {
        let rotateAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(rotateAxis, this.viewDirectionVector, this.upVector);
        glMatrix.vec3.rotateY(rotateAxis, rotateAxis, [0.0, 1.0, 0.0], this.delta * Math.PI / 180.0);
        glMatrix.vec3.scale(rotateAxis, rotateAxis, this.delta)
        glMatrix.vec3.sub(this.viewDirectionVector, this.viewDirectionVector, rotateAxis);
        
        this.updateCameraMatrix();
    }
    updateCameraMatrix() {
        let deltaMove = glMatrix.vec3.create();
        glMatrix.vec3.add(deltaMove, this.positionVector, this.viewDirectionVector);
        glMatrix.mat4.lookAt(this.cameraMatrix, this.positionVector, deltaMove, this.upVector);
    }
}


//creating the camera Object

let camera = new Camera();


//The user controls 

document.addEventListener("keydown", ProcessKeyPressedEvent, false);

function ProcessKeyPressedEvent(e) {
    //Processing the Camera Movement

    if (e.code === "KeyW") {
        console.log("---Forward");
        camera.moveForward();
    }
    if (e.code === "KeyS") {
        console.log("---Backward");
        camera.moveBackward();
    }
    if (e.code === "KeyA") {
        console.log("---StrafeLeft");
        camera.strafeLeft();
    }
    if (e.code === "KeyD") {
        console.log("---StrafeRight");
        camera.strafeRight();
    }
    if (e.code === "KeyI") {
        console.log("---MoveUp");
        camera.moveUp();
    }
    if (e.code === "KeyK") {
        console.log("---MoveDown");
        camera.moveDown();
    }
    if (e.code === "KeyJ") {
        console.log("---PanLeft");
        camera.panLeft();
    }
    if (e.code === "KeyL") {
        console.log("---PanRight");
        camera.panRight();
    }

    console.log(e);
}

/*
 *************************************************************************************************
 *
 *              Global Variables
 *
 *************************************************************************************************
*/




let vertexSource =
        '#version 300 es \n'  +
        'in vec3 vertPosition; \n' +
        'in vec3 vertNormal; \n' +
        'in vec2 vTextCoord; \n' +

        'uniform mat4 projMatrix; \n' +
        'uniform mat4 modelToWorldMatrix; \n' +
        'uniform mat4 viewMatrix; \n' +
        'uniform mat4 uNormalMatrix; \n' +

        'uniform vec3 uColor; \n' +

        'uniform vec3 uDiffuseLightColor; \n' +

        'uniform vec3 uDiffuseLightDirection; \n' +

        'uniform vec3 uAmbientLightColor; \n' +

        'out vec4 outColor; \n' +
     

        'void main(void){ \n' +
        'gl_Position = projMatrix * viewMatrix * modelToWorldMatrix * vec4(vertPosition, 1.0); \n' +
        'vec3 normal = normalize( vec3( (transpose(inverse(modelToWorldMatrix))) * vec4(vertNormal, 0.0) ) ); \n' +
        'vec3 LightDir = normalize(uDiffuseLightDirection); \n' +
        'float cosTheta = max( dot(LightDir, normal), 0.0); \n' +
        'vec3 diffuseReflection = uDiffuseLightColor * uColor * cosTheta; \n' +
        'vec3 ambientReflection = uAmbientLightColor * uColor; \n' +

        'outColor = vec4(ambientReflection + diffuseReflection, 1.0); \n' +
        '}';

let fragSource =
        '#version 300 es \n' +
        'precision highp float; \n' +
        'in vec4 outColor;  \n' +
        'out vec4 fragColor; \n' +
        '//in vec4 passToFragColor;  \n' +

        'void main(void) \n' +
        '{ \n' +
        'fragColor = outColor; \n' +
        '}';


const indices = [
    0, 1, 2, 0, 2, 3,
    //front

    4, 5, 6, 4, 6, 7,
    //back

    8, 9, 10, 8, 10, 11,
    //top

    12, 13, 14, 12, 14, 15,
    //bottom

    16, 17, 18, 16, 18, 19,
    //right

    20, 21, 22, 20, 22, 23
    // left
];



/*
 ************************************************************************************************
 *
 *              initWebGL() Function
 *
 ************************************************************************************************
*/
function initWebGL() {

    const canvas = document.getElementById('draw_surface');
    var gl = canvas.getContext('webgl2');


    let shaderProgram = gl.createProgram();

    gl.clearColor(0.0, 0.0, 1.0, 0.9);
    gl.enable(gl.DEPTH_TEST);


    //creating shader programs

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertShader, vertexSource);
    gl.compileShader(vertShader);
    let success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log(gl.getShaderInfoLog(vertShader));
    }
    gl.shaderSource(fragShader, fragSource);
    gl.compileShader(fragShader);
    let success2 = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if (!success2) {
        console.log(gl.getShaderInfoLog(fragShader));
    }
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(shaderProgram);
        throw 'Could not compile WebGL program \n\n' + info;
    }
    //created shader programs



    //declaring all the obects of the scene

    let myCube = cube(.25);
    let myRing = uvTorus(.7);
    let mySphere = uvSphere(.3);
    let myCyl = uvCylinder();
    let floor = cube(1);
    let myCone = uvCone();



    //passing the objects to get buffers created

    bufferCreator(gl, shaderProgram, myCube, mySphere, myCyl, myRing, myCone, floor);




   
}



/*
 ************************************************************************************************
 *
 *              bufferCreator() Function
 *
 ************************************************************************************************
*/
function bufferCreator(gl, shaderProgram, TheShape, secondShape, thirdShape, fourthShape, fifthShape, floor) {
//create buffer objects (vertex buffer, color buffer objects, and index buffer object)

/*****************First Shape Buffers*******************/
/*******************************************************/

    TheShape.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TheShape.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, TheShape.vertexPositions, gl.STATIC_DRAW);
    TheShape.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(TheShape.coord,
        //index in shader program or use the value returned from getAttriblocation

        3,
        //number of elements for this attribute

        gl.FLOAT,
        //type of value, i.e.float

        gl.FALSE,
        //is the data normalized

        0,
        // stried to next vertex position vertex element (we have two attributes for each vertex)

        0 // offset in the buffer array.

    );

    gl.enableVertexAttribArray(TheShape.coord);


    //create normal buffer
    TheShape.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TheShape.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, TheShape.vertexNormals, gl.STATIC_DRAW);

    TheShape.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(TheShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(TheShape.coordNormal);


    //create index buffer

    TheShape.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TheShape.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, TheShape.indices, gl.STATIC_DRAW);
//     //buffers finished
//     //shaders finished

/*****************Sphere! Shape Buffers*******************/
/*******************************************************/

    secondShape.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, secondShape.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, secondShape.vertexPositions, gl.STATIC_DRAW);
    secondShape.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(secondShape.coord, 3,gl.FLOAT ,gl.FALSE ,0 ,0);
    gl.enableVertexAttribArray(secondShape.coord);


    //create normal buffer
    secondShape.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, secondShape.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, secondShape.vertexNormals, gl.STATIC_DRAW);

    secondShape.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(secondShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(secondShape.coordNormal);


    //create index buffer

    secondShape.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, secondShape.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, secondShape.indices, gl.STATIC_DRAW);
//     //buffers finished
//     //shaders finished


/*****************Cylinder! Shape Buffers*******************/
/*******************************************************/

    thirdShape.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, thirdShape.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, thirdShape.vertexPositions, gl.STATIC_DRAW);
    thirdShape.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(thirdShape.coord, 3, gl.FLOAT, gl.FALSE ,0 ,0);
    gl.enableVertexAttribArray(thirdShape.coord);


    //create normal buffer
    thirdShape.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, thirdShape.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, thirdShape.vertexNormals, gl.STATIC_DRAW);

    thirdShape.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(thirdShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(thirdShape.coordNormal);


    //create index buffer

    thirdShape.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, thirdShape.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, thirdShape.indices, gl.STATIC_DRAW);



//     //buffers finished
//     //shaders finished

/*****************Torus! Shape Buffers*******************/
/*******************************************************/

    fourthShape.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fourthShape.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, fourthShape.vertexPositions, gl.STATIC_DRAW);
    fourthShape.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(fourthShape.coord, 3, gl.FLOAT, gl.FALSE ,0 ,0);
    gl.enableVertexAttribArray(fourthShape.coord);


    //create normal buffer
    fourthShape.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fourthShape.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, fourthShape.vertexNormals, gl.STATIC_DRAW);

    fourthShape.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(fourthShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fourthShape.coordNormal);

    //create index buffer

    fourthShape.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fourthShape.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, fourthShape.indices, gl.STATIC_DRAW);
//     //buffers finished
//     //shaders finished

/*****************Torus! Shape Buffers*******************/
/*******************************************************/

    fifthShape.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fifthShape.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, fifthShape.vertexPositions, gl.STATIC_DRAW);
    fifthShape.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(fifthShape.coord, 3, gl.FLOAT, gl.FALSE ,0 ,0);
    gl.enableVertexAttribArray(fifthShape.coord);


    //create normal buffer
    fifthShape.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fifthShape.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, fifthShape.vertexNormals, gl.STATIC_DRAW);

    fifthShape.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(fifthShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fifthShape.coordNormal);

    //create index buffer

    fifthShape.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fifthShape.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, fifthShape.indices, gl.STATIC_DRAW);
//     //buffers finished
//     //shaders finished
/*****************Floor Shape Buffers*******************/
/*******************************************************/


/*****************Floor Shape Buffers*******************/
/*******************************************************/
    floor.vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, floor.vertexPositions, gl.STATIC_DRAW);
    floor.coord = gl.getAttribLocation(shaderProgram, "vertPosition");

    gl.vertexAttribPointer(floor.coord,3,gl.FLOAT,gl.FALSE,0,0);
    gl.enableVertexAttribArray(floor.coord);


    //create normal buffer
    floor.normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, floor.vertexNormals, gl.STATIC_DRAW);

    floor.coordNormal = gl.getAttribLocation(shaderProgram, "vertNormal");
    gl.vertexAttribPointer(floor.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(floor.coordNormal);

    //create index buffer

    floor.index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floor.index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floor.indices, gl.STATIC_DRAW);
//     //buffers finished
//     //shaders finished



    //draw function

    var then = 0;
    var angle = 0;

    function drawLoop(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawModel(gl, shaderProgram, deltaTime, TheShape, secondShape, thirdShape, fourthShape, fifthShape, floor);
        requestAnimationFrame(drawLoop);
    }

    //calling the draw function for all the shapes

    drawLoop();
}




/*
 **********************************************************************************************************
 *  
 *              drawModel() Function
 *
 **********************************************************************************************************
*/
var movement = 0.0;
var upMovement = 0.0;
var rotation = 0.0;
var sphereRotation = 0.0;
var counter = 0.0;
var upWards = true;
function drawModel(gl, gpu, deltaTime, myShape, secondShape, thirdShape, fourthShape, fifthShape, floor) {

    gl.useProgram(gpu);

/*****************Cube!! Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, myShape.vertex_buffer);
    gl.vertexAttribPointer(myShape.coord, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(myShape.coord);
    
    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, myShape.normal_buffer);
    gl.vertexAttribPointer(myShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(myShape.coordNormal);

    //set Ambient Light
    let uAmbientColorLocation = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocation, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocation = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocation, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocation = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocation, [-1.0, -1.0, 1.0]);

    //uniform color
    let ucolorLocation = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocation, [1.0, 0.0, 0.0]);
    
    //projection matrix
    let projMatrix = glMatrix.mat4.create();
    let projMatrixLocation = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrix, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocation, false, projMatrix);

    //model Matrix
    let modelMatrix = glMatrix.mat4.create();
    let modelMatrixLocation = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrix, modelMatrix, [1.0, 0.75, -4.0]);
    glMatrix.mat4.rotate(modelMatrix, modelMatrix, rotation * 5, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    //view matrix (camera)
    let viewMatrixLocation = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation, false, camera.cameraMatrix);

    //uniform
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myShape.index_buffer);
    gl.drawElements(gl.TRIANGLES, myShape.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************First Shape End********************/
/****************************************************/


/*****************Sphere!! Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, secondShape.vertex_buffer);
    let coord2 = gl.getAttribLocation(gpu, "vertPosition");
    gl.vertexAttribPointer(secondShape.coord2, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(secondShape.coord2);
    
    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, secondShape.normal_buffer);
    gl.vertexAttribPointer(secondShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(secondShape.coordNormal);

    //set Ambient Light
    let uAmbientColorLocation2 = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocation2, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocation2 = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocation2, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocation2 = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocation2, [-1.0, -1.0, 1.0]);

    //uniform color
    let ucolorLocation2 = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocation2, [1.0, 0.0, 0.0]);
    

    //projection matrix
    let projMatrix2 = glMatrix.mat4.create();
    let projMatrixLocation2 = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrix2, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocation2, false, projMatrix2);

    //model Matrix
    let modelMatrix2 = glMatrix.mat4.create();
    let modelMatrixLocation2 = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrix2, modelMatrix2, [1.0, upMovement + 1.75, -4.0]);
    glMatrix.mat4.rotate(modelMatrix2, modelMatrix2, sphereRotation * .1, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrix2, modelMatrix2, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(modelMatrixLocation2, false, modelMatrix2);

    //view matrix (camera)
    let viewMatrixLocation2 = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation2, false, camera.cameraMatrix);

    //uniform
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, secondShape.index_buffer);
    gl.drawElements(gl.TRIANGLES, secondShape.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************Second Shape End********************/
/****************************************************/

/*****************Cylinder!! Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, thirdShape.vertex_buffer);
    let coord3 = gl.getAttribLocation(gpu, "vertPosition");
    gl.vertexAttribPointer(thirdShape.coord3, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(thirdShape.coord3);

    
    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, thirdShape.normal_buffer);
    gl.vertexAttribPointer(thirdShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(thirdShape.coordNormal);


    //set Ambient Light
    let uAmbientColorLocation3 = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocation3, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocation3 = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocation3, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocation3 = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocation3, [-1.0, -1.0, 1.0]);


    //uniform color
    let ucolorLocation3 = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocation3, [1.0, 1.0, 0.0]);
    

    //projection matrix
    let projMatrix3 = glMatrix.mat4.create();
    let projMatrixLocation3 = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrix3, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocation3, false, projMatrix3);

    //model Matrix
    let modelMatrix3 = glMatrix.mat4.create();
    let modelMatrixLocation3 = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrix3, modelMatrix3, [-2.0, movement, -2.0]);
    glMatrix.mat4.rotate(modelMatrix3, modelMatrix3, 0.0 * Math.PI / 180, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrix3, modelMatrix3, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(modelMatrixLocation3, false, modelMatrix3);

    //view matrix (camera)
    let viewMatrixLocation3 = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation3, false, camera.cameraMatrix);

    //uniform
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, thirdShape.index_buffer);
    gl.drawElements(gl.TRIANGLES, thirdShape.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************Third Shape End********************/
/****************************************************/

/*****************Torus!! Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, fourthShape.vertex_buffer);
    let coord4 = gl.getAttribLocation(gpu, "vertPosition");
    gl.vertexAttribPointer(fourthShape.coord4, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fourthShape.coord4);

    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, fourthShape.normal_buffer);
    gl.vertexAttribPointer(fourthShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fourthShape.coordNormal);

    //set Ambient Light
    let uAmbientColorLocation4 = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocation4, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocation4 = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocation4, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocation4 = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocation4, [-1.0, -1.0, 1.0]);

    //uniform color
    let ucolorLocation4 = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocation4, [0.0, 1.0, 0.0]);

    //projection matrix
    let projMatrix4 = glMatrix.mat4.create();
    let projMatrixLocation4 = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrix4, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocation4, false, projMatrix4);

    //model Matrix

    let modelMatrix4 = glMatrix.mat4.create();
    let modelMatrixLocation4 = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrix4, modelMatrix4, [1.0, 0.75, -4.0]);
    glMatrix.mat4.rotate(modelMatrix4, modelMatrix4, rotation, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrix4, modelMatrix4, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(modelMatrixLocation4, false, modelMatrix4);

    //view matrix (camera)
    let viewMatrixLocation4 = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation4, false, camera.cameraMatrix);

    //uniform

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fourthShape.index_buffer);
    gl.drawElements(gl.LINES, fourthShape.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************Fourth Shape End********************/
/****************************************************/


/*****************Cone!!! Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, fifthShape.vertex_buffer);
    let coord5 = gl.getAttribLocation(gpu, "vertPosition");
    gl.vertexAttribPointer(fifthShape.coord5, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fifthShape.coord5);

    
    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, fifthShape.normal_buffer);
    gl.vertexAttribPointer(fifthShape.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(fifthShape.coordNormal);


    //set Ambient Light
    let uAmbientColorLocation5 = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocation5, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocation5 = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocation5, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocation5 = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocation5, [-1.0, -1.0, 1.0]);


    //uniform color
    let ucolorLocation5 = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocation5, [1.0, 0.5, 1.0]);
    

    //projection matrix

    let projMatrix5 = glMatrix.mat4.create();
    let projMatrixLocation5 = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrix5, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocation5, false, projMatrix4);

    //model Matrix
    let modelMatrix5 = glMatrix.mat4.create();
    let modelMatrixLocation5 = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrix5, modelMatrix5, [4.0, 0.75, -0.04]);
    glMatrix.mat4.translate(modelMatrix5, modelMatrix4, [1.0, 0.75, -0.04]);
    glMatrix.mat4.rotate(modelMatrix5, modelMatrix5, 180.0 * Math.PI / 180, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrix5, modelMatrix5, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(modelMatrixLocation5, false, modelMatrix5);

    //view matrix (camera)
    let viewMatrixLocation5 = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation5, false, camera.cameraMatrix);

    //uniform
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fifthShape.index_buffer);
    gl.drawElements(gl.TRIANGLES, fifthShape.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************Fifth Shape End********************/
/****************************************************/


/*****************Floor Shape Start******************/
/****************************************************/
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.vertex_buffer);
    let coordFloor = gl.getAttribLocation(gpu, "vertPosition");
    gl.vertexAttribPointer(floor.coordFloor, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(floor.coordFloor);

    
    //setup normal attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, floor.normal_buffer);
    gl.vertexAttribPointer(floor.coordNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(floor.coordNormal);


    //set Ambient Light
    let uAmbientColorLocationFloor = gl.getUniformLocation(gpu, 'uAmbientLightColor');
    gl.uniform3fv(uAmbientColorLocationFloor, [0.2, 0.2, 0.2]);

    //set Diffuse Light Color
    let uDiffuseColorLocationFloor = gl.getUniformLocation(gpu, 'uDiffuseLightColor');
    gl.uniform3fv(uDiffuseColorLocationFloor, [1.0, 1.0, 1.0]);

    //set diffuse light color
    let uDiffuseDirectionLocationFloor = gl.getUniformLocation(gpu, 'uDiffuseLightDirection');
    gl.uniform3fv(uDiffuseDirectionLocationFloor, [-1.0, -1.0, 1.0]);


    //uniform color
    let ucolorLocationFloor = gl.getUniformLocation(gpu, 'uColor');
    gl.uniform3fv(ucolorLocationFloor, [0.47, 0.79, 0.79]);
    //47,79,79
    

    //projection matrix

    let projMatrixFloor = glMatrix.mat4.create();
    let projMatrixLocationFloor = gl.getUniformLocation(gpu, 'projMatrix');

    glMatrix.mat4.perspective(projMatrixFloor, Math.PI / 180 * 60, 800 / 600, 0.1, 100.0);
    gl.uniformMatrix4fv(projMatrixLocationFloor, false, projMatrixFloor);

    //model Matrix

    let modelMatrixFloor = glMatrix.mat4.create();
    let modelMatrixLocationFloor = gl.getUniformLocation(gpu, 'modelToWorldMatrix');

    glMatrix.mat4.translate(modelMatrixFloor, modelMatrixFloor, [0.0, -2.0, -5.0]);
    glMatrix.mat4.rotate(modelMatrixFloor, modelMatrixFloor, 0.0 * Math.PI / 180, [0.0, 1.0, 0.0]);
    glMatrix.mat4.scale(modelMatrixFloor, modelMatrixFloor, [10.0, 0.1, 10.0]);

    gl.uniformMatrix4fv(modelMatrixLocationFloor, false, modelMatrixFloor);

    //view matrix (camera)

    let viewMatrixLocationFloor = gl.getUniformLocation(gpu, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocationFloor, false, camera.cameraMatrix);

    //uniform

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floor.index_buffer);
    gl.drawElements(gl.TRIANGLES, floor.indices.length, gl.UNSIGNED_SHORT, 0);

/*****************First Shape End********************/
/****************************************************/



    

    //incrimenting the rotations and movements

    counter++;

    if (counter % 40 == 0) {
        upWards = !upWards;
    }
    if (upWards) {
        movement += 0.02;
        upMovement += 0.009;
    }
    else if (!upWards) {
        movement -= 0.02;
        upMovement -= 0.009;
    }
    
    rotation += 0.04;
    sphereRotation += .5;
    
   
    //console.log(deltaTime)
}















