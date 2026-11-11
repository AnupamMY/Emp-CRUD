import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import app from './app';
import connectDB from './config/db';

async function startServer() {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown startup error';
    console.error(`Server startup failed: ${message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}
