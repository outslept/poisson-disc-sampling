function createSampler(width, height, r, k = 30) {
    const cellSize = r / Math.SQRT2;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    const grid = new Array(cols * rows).fill(null);

    const state = {
        width,
        height,
        r,
        k,
        cellSize,
        cols,
        rows,
        grid,
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

    const col = Math.floor(p.x / state.cellSize);
    const row = Math.floor(p.y / state.cellSize);
    state.grid[col + row * state.cols] = p;
}

function nearestSqDist(state, p) {
    const col = Math.floor(p.x / state.cellSize);
    const row = Math.floor(p.y / state.cellSize);

    const minCol = Math.max(0, col - 2);
    const maxCol = Math.min(state.cols - 1, col + 2);
    const minRow = Math.max(0, row - 2);
    const maxRow = Math.min(state.rows - 1, row + 2);

    let min = Infinity;
    for (let ry = minRow; ry <= maxRow; ry++) {
        for (let cx = minCol; cx <= maxCol; cx++) {
            const q = state.grid[cx + ry * state.cols];
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
    if (state.active.length === 0) return false;

    const idx = Math.floor(Math.random() * state.active.length);
    const parent = state.active[idx];

    for (let i = 0; i < state.k; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = state.r * (1 + Math.random());
        const candidate = {
            x: parent.x + Math.cos(angle) * radius,
            y: parent.y + Math.sin(angle) * radius
        };

        if (isValid(state, candidate)) {
            addPoint(state, candidate);
            return true;
        }
    }

    state.active.splice(idx, 1);
    return true;
}

function computeMinDistance(state) {
    let min = Infinity;

    for (const p of state.points) {
        const d = nearestSqDist(state, p);
        if (d < min) min = d;
    }

    return Math.sqrt(min);
}
