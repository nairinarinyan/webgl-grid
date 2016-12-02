function generateGrid(d) {
    const u = d/2;
    let vertices = [];

    // d + 1 vertical lines
    for (let i = 0; i < d + 1; i++) {
        const lineStart = [-u + i, 0, u];
        const lineEnd = [-u + i, 0, -u];
        const line = lineStart.concat(lineEnd);
        vertices = vertices.concat(line);
    }

    // d + 1 horizontal lines
    for (let i = 0; i < d + 1; i++) {
        const lineStart = [-u, 0, -u + i];
        const lineEnd = [u, 0, -u + i];
        const line = lineStart.concat(lineEnd);
        vertices = vertices.concat(line);
    }

    return vertices;
}

let gridPositions = generateGrid(8);
