function generateGrid(d) {
    var u = d/2;
    var vertices = [];

    // d + 1 vertical and horizontal lines
    for (var i = 0; i < d + 1; i++) {
        vertices.push(
            -u + i, 0, u,
            -u + i, 0, -u,
            -u, 0, -u + i,
            u, 0, -u + i
        );
    }

    return vertices;
}
