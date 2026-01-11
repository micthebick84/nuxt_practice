import oracledb from 'oracledb';

// Oracle connection configuration
const dbConfig = {
  user: process.env.ORACLE_USER || 'hm_busan',
  password: process.env.ORACLE_PASSWORD || 'hm_soft',
  connectString: process.env.ORACLE_CONNECT_STRING || '10.1.0.103:1521/FREE',
};

// Only initialize Oracle Client if library directory is specified
// Otherwise, oracledb will attempt to use Thin mode or find libraries in PATH
if (process.env.ORACLE_CLIENT_LIB_DIR) {
  try {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
  } catch (err) {
    console.warn('Oracle Client initialization warning:', err);
  }
}

let pool: oracledb.Pool | null = null;

/**
 * Get or create Oracle connection pool
 */
async function getPool(): Promise<oracledb.Pool> {
  if (!pool) {
    pool = await oracledb.createPool({
      ...dbConfig,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });
  }
  return pool;
}

/**
 * Execute a query with automatic connection management
 */
export async function executeQuery(sql: string, binds: any[] = [], options: oracledb.ExecuteOptions = {}): Promise<oracledb.Result<any>> {
  const pool = await getPool();
  let connection: oracledb.Connection | undefined;

  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options,
    });
    return result;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

/**
 * Oracle DB wrapper with query method similar to pg Pool
 */
export const oracleDb = {
  async query(sql: string, binds: any[] = []): Promise<{ rows: any[] }> {
    const result = await executeQuery(sql, binds);
    return { rows: result.rows || [] };
  },
};

export default oracleDb;
