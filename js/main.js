const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let program;
let viewLocation, viewMatrix, projectionLocation, projectionMatrix, worldLocation, worldMatrix;
let rotationMatrix = m4.identity();
let positionBuffer;

function init() {
    program = initShaders();
    gl.viewport(0, 0, canvas.width, canvas.height);
    setUpBuffers();
    setUpUniforms();
    setUpAttributes();
}

function initShaders() {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const vtxCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    const fragCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);

    !vtxCompileStatus && console.error(gl.getShaderInfoLog(vertexShader));
    !fragCompileStatus && console.error(gl.getShaderInfoLog(fragmentShader));

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    !linkStatus && console.error(gl.getProgramInfoLog(program));

    gl.useProgram(program);
    return program;
}

function setUpUniforms() {
    const eye = [0,3,-10];
    const target = [0,0,0];
    const up = [0,1,0];
    const aspect = canvas.width / canvas.height;

    const camera = m4.lookAt(eye, target, up);
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
    rotationMatrix = m4.rotateY(rotationMatrix, .01);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(worldLocation, false, rotationMatrix);
}

function setUpAttributes() {
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
}

function render(time) {
    requestAnimationFrame(render);

    setUniforms(time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(1,1,1,1);
    gl.drawArrays(gl.LINES, 0, gridPositions.length/3);
}

init();
render();