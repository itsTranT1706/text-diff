import express, { Request, Response } from 'express';
import cors from 'cors';
import { diffWords } from 'diff';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface DiffRequest {
    text1: string;
    text2: string;
}

interface DiffPart {
    value: string;
    added?: boolean;
    removed?: boolean;
}

interface DiffResponse {
    diff: DiffPart[];
}

// POST /diff endpoint
app.post('/diff', (req: Request<{}, DiffResponse, DiffRequest>, res: Response<DiffResponse>) => {
    const { text1, text2 } = req.body;

    // Validate input
    if (typeof text1 !== 'string' || typeof text2 !== 'string') {
        return res.status(400).json({
            diff: [{ value: 'Error: text1 and text2 must be strings' }]
        });
    }

    // Compute diff
    const differences = diffWords(text1, text2);

    // Format response
    const diff: DiffPart[] = differences.map((part) => {
        const result: DiffPart = { value: part.value };
        if (part.added) {
            result.added = true;
        }
        if (part.removed) {
            result.removed = true;
        }
        return result;
    });

    res.json({ diff });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

console.log("Backend server running on http://localhost:${PORT}");
// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
