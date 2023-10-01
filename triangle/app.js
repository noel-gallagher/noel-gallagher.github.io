var verSource = `
           attribute vec3 pos;
           varying vec4 vCol;
           uniform mat4 model;
           uniform mat4 projection;
           uniform mat4 view;
           void main() {
               gl_Position = projection * view * model * vec4(pos, 1.0);
               vCol = vec4(clamp(pos, 0.0, 1.0), 1.0);
           }
       `;

var fragSource = `
           precision mediump float;
           varying vec4 vCol;
           void main() {
               gl_FragColor = vCol;
           }
       `;

var camera = {
   position: vec3.fromValues(0.0, 0.0, 0.0),
   front: vec3.fromValues(0.0, 0.0, -1.0),
   right: vec3.create(),
   worldUp: vec3.fromValues(0.0, 1.0, 0.0),
   yaw: -90.0,
   pitch: 0.0,
   movementSpeed: 0.1,
   turnSpeed: 0.1,
   
   update: function () {
       this.front[0] =
           Math.cos(glMatrix.toRadian(this.yaw)) *
           Math.cos(glMatrix.toRadian(this.pitch));
       this.front[1] = Math.sin(glMatrix.toRadian(this.pitch));
       this.front[2] =
           Math.sin(glMatrix.toRadian(this.yaw)) *
           Math.cos(glMatrix.toRadian(this.pitch));
       vec3.normalize(this.front, this.front);
       vec3.cross(this.right, this.front, this.worldUp);
       vec3.normalize(this.right, this.right);
       vec3.cross(this.worldUp, this.right, this.front);
       vec3.normalize(this.worldUp, this.worldUp);
       this.box.update();
   },
   
   getViewMatrix: function () {
       var lookAt = vec3.create();
       vec3.add(lookAt, this.position, this.front);
       return mat4.lookAt(mat4.create(), this.position, lookAt, this.worldUp);
    },

   processKeyboard: function (direction, deltaTime) {
       var velocity = this.movementSpeed * deltaTime;

       if (direction === "forward")
           this.position = vec3.add(
           vec3.create(),
           this.position,
           vec3.scale(vec3.create(), this.front, velocity)
       );
       if (direction === "backward")
           this.position = vec3.subtract(
           vec3.create(),
           this.position,
           vec3.scale(vec3.create(), this.front, velocity)
       );
       if (direction === "left")
           this.position = vec3.subtract(
           vec3.create(),
           this.position,
           vec3.scale(vec3.create(), this.right, velocity)
       );
       if (direction === "right")
           this.position = vec3.add(
           vec3.create(),
           this.position,
           vec3.scale(vec3.create(), this.right, velocity)
       );
   },

   processMouseMovement: function (deltaX, deltaY) {
       this.yaw += this.turnSpeed * deltaX;
       this.pitch += this.turnSpeed * deltaY;
       if (this.pitch > 89.0) this.pitch = 89.0;
       if (this.pitch < -89.0) this.pitch = -89.0;
       this.update();
   },

   box: {
       min: vec3.create(),
       max: vec3.create(),
       update: () => {
           this.min = vec3.fromValues(camera.position[0] - 0.1, camera.position[1] - 0.1, camera.position[2] - 0.1);
           this.max = vec3.fromValues(camera.position[0] + 0.1, camera.position[1] + 0.1, camera.position[2] + 0.1);
       }
   }
};


var keys = {
   forward: false,
   backward: false,
   left: false,
   right: false
};

window.addEventListener("keydown", function (e) {
   switch (e.code) {
       case "KeyW":
           keys.forward = true;
           break;
       case "KeyS":
           keys.backward = true;
           break;
       case "KeyA":
           keys.left = true;
           break;
       case "KeyD":
           keys.right = true;
           break;
  }
});


window.addEventListener("keyup", function (e) {
   switch (e.code) {
       case "KeyW":
           keys.forward = false;
           break;
       case "KeyS":
           keys.backward = false;
           break;
       case "KeyA":
           keys.left = false;
           break;
       case "KeyD":
           keys.right = false;
           break;
  }
});

function updateCameraView(e) {
    var movementX = e.movementX || e.mozMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || 0;
    camera.processMouseMovement(movementX, -movementY);
}

document.addEventListener("DOMContentLoaded", function () {
   var canvas = document.getElementById("c");
   var gl = canvas.getContext("webgl");
   

   canvas.addEventListener('click', function () {
       canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
       canvas.requestPointerLock();
   });
 
   function lockChangeAlert() {
       if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
        // Pointer was just locked
        document.addEventListener("mousemove", updateCameraView, false);
       } else {
           document.removeEventListener("mousemove", updateCameraView, false);
       } 
   }

   document.addEventListener('pointerlockchange', lockChangeAlert, false);
   document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
   camera.update();

   if (!gl) {
       return;
   }

   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   gl.viewport(0, 0, canvas.width, canvas.height);

   var mouse = {
   lastX: canvas.width / 2,
   lastY: canvas.height / 2,
   offsetX: 0,
   offsetY: 0,
};

canvas.addEventListener('mousemove', function (e) {
   var x = e.clientX;
   var y = e.clientY;

   mouse.offsetX = x - mouse.lastX;
   mouse.offsetY = mouse.lastY - y; 

   mouse.lastX = x;
   mouse.lastY = y;

   camera.processMouseMovement(mouse.offsetX, mouse.offsetY);
});

   var vertexShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertexShader, verSource);
   gl.compileShader(vertexShader);

   var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragmentShader, fragSource);
   gl.compileShader(fragmentShader);

   var program = gl.createProgram();
   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);
   gl.useProgram(program);

   var vertices = new Float32Array([
       -1.0, -1.0, 0.0,
       0.0, -1.0, 1.0,
       1.0, -1.0, 0.0,
       0.0, 1.0, 0.0
  ]);

   var indices = new Uint16Array([0, 3, 1, 1, 3, 2, 2, 3, 0, 0, 1, 2]);
   var vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

   var indexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

   var posAttribLocation = gl.getAttribLocation(program, "pos");
   gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(posAttribLocation);

   var modelUniform = gl.getUniformLocation(program, "model");
   var projectionUniform = gl.getUniformLocation(program, "projection");
 
   var viewMatrix = camera.getViewMatrix();
   var viewUniform = gl.getUniformLocation(program, "view");
   gl.uniformMatrix4fv(viewUniform, false, viewMatrix);

   var angle = 0.0;

   function animate() {
       angle += 0.01;
       if (angle > 2 * Math.PI) angle = 0.0;

       var modelMatrix = mat4.create();
       mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -2.5]);
       mat4.scale(modelMatrix, modelMatrix, [0.4, 0.4, 0.4]);

       var projectionMatrix = mat4.create();
       mat4.perspective(
           projectionMatrix,
           Math.PI / 4,
           canvas.width / canvas.height,
           0.1,
           100.0
       );

   gl.uniformMatrix4fv(modelUniform, false, modelMatrix);
   gl.uniformMatrix4fv(projectionUniform, false, projectionMatrix);

   if (keys.forward) camera.processKeyboard("forward", 0.1);
   if (keys.backward) camera.processKeyboard("backward", 0.1);
   if (keys.left) camera.processKeyboard("left", 0.1);
   if (keys.right) camera.processKeyboard("right", 0.1);

   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   gl.enable(gl.DEPTH_TEST);

   gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

   viewMatrix = camera.getViewMatrix();
   gl.uniformMatrix4fv(viewUniform, false, viewMatrix);

   requestAnimationFrame(animate);
}
   animate();
});

