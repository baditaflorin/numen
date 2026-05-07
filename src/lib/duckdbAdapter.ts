export type DuckDBStatus = {
  module: string;
  mainModule: string;
  pthreadWorker: boolean;
};

export async function loadDuckDBStatus(): Promise<DuckDBStatus> {
  const duckdb = await import("@duckdb/duckdb-wasm");
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);
  return {
    module: "DuckDB-WASM",
    mainModule: bundle.mainModule,
    pthreadWorker: Boolean(bundle.pthreadWorker),
  };
}
