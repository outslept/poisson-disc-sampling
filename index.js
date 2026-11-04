function createSampler(width, height, r, k = 30) {
    const cellSize = r / Math.SQRT2;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    const state = {
        width,
        height,
        r,
        k,
        cellSize,
        cols,
        rows,
        grid: new Array(cols * rows).fill(null),
        active: [],
        points: []
    };

    addPoint(state, {
        x: Math.random() * width,
        y: Math.random() * height
    });

    return state;
}

function addPoint(state, p) {
    state.points.push(p);
    state.active.push(p);

    const col = (p.x / state.cellSize) | 0;
    const row = (p.y / state.cellSize) | 0;
    state.grid[col + row * state.cols] = p;
}

function nearestSqDist(state, p) {
    const { grid, cols, rows, cellSize } = state;
    const col = (p.x / cellSize) | 0;
    const row = (p.y / cellSize) | 0;

    const minCol = Math.max(0, col - 2);
    const maxCol = Math.min(cols - 1, col + 2);
    const minRow = Math.max(0, row - 2);
    const maxRow = Math.min(rows - 1, row + 2);

    let min = Infinity;
    for (let ry = minRow; ry <= maxRow; ry++) {
        const rowOffset = ry * cols;
        for (let cx = minCol; cx <= maxCol; cx++) {
            const q = grid[cx + rowOffset];
            if (!q || q === p) continue;

            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d = dx * dx + dy * dy;
            if (d < min) min = d;
        }
    }

    return min;
}

function isValid(state, p) {
    if (p.x < 0 || p.x >= state.width || p.y < 0 || p.y >= state.height) {
        return false;
    }

    return nearestSqDist(state, p) >= state.r * state.r;
}

function stepSampler(state) {
    const { active, r, k } = state;
    if (active.length === 0) return false;

    const idx = (Math.random() * active.length) | 0;
    const parent = active[idx];
    const candidate = { x: 0, y: 0 };

    for (let i = 0; i < k; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = r * (1 + Math.random());
        candidate.x = parent.x + Math.cos(angle) * radius;
        candidate.y = parent.y + Math.sin(angle) * radius;

        if (isValid(state, candidate)) {
            addPoint(state, candidate);
            return true;
        }
    }

    const last = active.pop();
    if (idx < active.length) active[idx] = last;
    return true;
}

function computeMinDistance(state) {
    const { points } = state;
    let min = Infinity;

    for (let i = 0; i < points.length; i++) {
        const d = nearestSqDist(state, points[i]);
        if (d < min) min = d;
    }

    return Math.sqrt(min);
}

function theoreticalMaxPoints(state) {
    return Math.floor((2 * state.width * state.height) / (Math.sqrt(3) * state.r * state.r));
}
