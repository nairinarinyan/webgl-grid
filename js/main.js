var canvas = document.querySelector('canvas');

var ratio = window.devicePixelRatio;
ratio = ratio < 1 ? 1 : ratio;

canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

var gl = canvas.getContext('webgl');

var program;
var viewLocation, viewMatrix, projectionLocation, projectionMatrix, worldLocation, worldMatrix;
var rotationMatrix = m4.identity();
var positionBuffer;

var gridPositions = generateGrid(22);

function init() {
    program = initShaders();
    gl.viewport(0, 0, canvas.width, canvas.height);
    setUpBuffers();
    setUpUniforms();
    setUpAttributes();
}

function initShaders() {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, document.querySelector('#vertex-shader').innerText);
    gl.shaderSource(fragmentShader, document.querySelector('#fragment-shader').innerText);
    // gl.shaderSource(vertexShader, vertexShaderSource);
    // gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var vtxCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    var fragCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);

    !vtxCompileStatus && console.error(gl.getShaderInfoLog(vertexShader));
    !fragCompileStatus && console.error(gl.getShaderInfoLog(fragmentShader));

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    !linkStatus && console.error(gl.getProgramInfoLog(program));

    gl.useProgram(program);
    return program;
}

function setUpUniforms() {
    var eye = [0,3,-20];
    var target = [0,0,0];
    var up = [0,1,0];
    var aspect = canvas.width / canvas.height;

    var camera = m4.lookAt(eye, target, up);
    viewMatrix = m4.inverse(camera);
    projectionMatrix = m4.perspective(45, aspect, 0, 100);

    viewLocation = gl.getUniformLocation(program, 'u_view');
    projectionLocation = gl.getUniformLocation(program, 'u_projection');
    worldLocation = gl.getUniformLocation(program, 'u_world');
}

function setUpBuffers() {
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridPositions), gl.STATIC_DRAW);
}

function setUniforms(time) {
    rotationMatrix = m4.rotateY(rotationMatrix, .003);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(worldLocation, false, rotationMatrix);
}

function setUpAttributes() {
    var positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
}

function render(time) {
    requestAnimationFrame(render);

    setUniforms(time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(233/255,241/255,247/255,1);
    gl.drawArrays(gl.LINES, 0, gridPositions.length/3);
}

init();
render();