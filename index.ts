interface Point {
    x: number;
    y: number;
}

interface SamplerState {
    width: number;
    height: number;
    r: number;
    k: number;
    cellSize: number;
    cols: number;
    rows: number;
    grid: (Point | null)[];
    active: Point[];
    points: Point[];
}

function createSampler(width: number, height: number, r: number, k: number = 30): SamplerState {
    const cellSize = r / Math.SQRT2;

    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    const grid: (Point | null)[] = new Array(cols * rows).fill(null);

    const state: SamplerState = {
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

function addPoint(state: SamplerState, p: Point): void {
    state.points.push(p);
    state.active.push(p);

    const col = Math.floor(p.x / state.cellSize);
    const row = Math.floor(p.y / state.cellSize);
    state.grid[col + row * state.cols] = p;
}

function isValid(state: SamplerState, p: Point): boolean {
    if (p.x < 0 || p.x >= state.width || p.y < 0 || p.y >= state.height) {
        return false;
    }

    const col = Math.floor(p.x / state.cellSize);
    const row = Math.floor(p.y / state.cellSize);

    const minCol = Math.max(0, col - 2);
    const maxCol = Math.min(state.cols - 1, col + 2);
    const minRow = Math.max(0, row - 2);
    const maxRow = Math.min(state.rows - 1, row + 2);

    for (let ry = minRow; ry <= maxRow; ry++) {
        for (let cx = minCol; cx <= maxCol; cx++) {
            const neighbor = state.grid[cx + ry * state.cols];
            if (!neighbor) continue;

            const dx = p.x - neighbor.x;
            const dy = p.y - neighbor.y;
            if (dx * dx + dy * dy < state.r * state.r) {
                return false;
            }
        }
    }

    return true;
}

function stepSampler(state: SamplerState): boolean {
    if (state.active.length === 0) return false;

    const idx = Math.floor(Math.random() * state.active.length);
    const parent = state.active[idx];
    let found = false;

    for (let i = 0; i < state.k; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = state.r * (1 + Math.random());
        const candidate: Point = {
            x: parent.x + Math.cos(angle) * radius,
            y: parent.y + Math.sin(angle) * radius
        };

        if (isValid(state, candidate)) {
            addPoint(state, candidate);
            found = true;
            break;
        }
    }

    if (!found) {
        state.active.splice(idx, 1);
    }

    return true;
}

function computeMinDistance(state: SamplerState): number {
    let min = Infinity;

    for (const p of state.points) {
        const col = Math.floor(p.x / state.cellSize);
        const row = Math.floor(p.y / state.cellSize);

        const minCol = Math.max(0, col - 2);
        const maxCol = Math.min(state.cols - 1, col + 2);
        const minRow = Math.max(0, row - 2);
        const maxRow = Math.min(state.rows - 1, row + 2);

        for (let ry = minRow; ry <= maxRow; ry++) {
            for (let cx = minCol; cx <= maxCol; cx++) {
                const q = state.grid[cx + ry * state.cols];
                if (!q || q === p) continue;

                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < min) min = d;
            }
        }
    }

    return min;
}

function theoreticalMaxPoints(state: SamplerState): number {
    return Math.floor((2 * state.width * state.height) / (Math.sqrt(3) * state.r * state.r));
}